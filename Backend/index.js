import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import { LeetCode } from 'leetcode-query';
import morgan from 'morgan';
import cors from 'cors';

import {
    connectDb,
    storeAcceptedQuestions,
    getStoredAcceptedQuestions,
} from './src/db/database.js';
import {
    extractData,
    fetchJsonObject,
    updateAcceptedQuestions,
} from './src/utils/util.js';

const app = express();
const port = process.env.PORT || 3000;
const leetcode = new LeetCode();
app.use(express.json());
app.use(morgan('tiny'));
app.use(cors());

const recentSubmissionsMap = new Map();

let acceptedQuestionsCollection;
let jsQuestionsCollection;

(async () => {
    const db = await connectDb();
    if (db) {
        acceptedQuestionsCollection = db.collection('accepted_questions');
        jsQuestionsCollection = db.collection('js_questions');
    }
})();

// Express server and API routes
app.post("/username", async (req, res) => {
    try {
        const { username } = req.body;
        const user = await leetcode.user(username);
        if (!user || !user.matchedUser) {
            res.status(400).json({ error: "Invalid username" });
            return;
        }
        const data = extractData(user);
        recentSubmissionsMap.set(username, data.recentSubmissionList);
        const jsQuestions = await fetchJsonObject();

        // Retrieve stored accepted questions
        const storedAcceptedQuestions = await getStoredAcceptedQuestions(acceptedQuestionsCollection, username);

        // Filter out completed questions from the jsQuestions list
        const uncompletedJsQuestions = jsQuestions[0].questions.filter(
            question => !storedAcceptedQuestions.find(stored => stored.title === question)
        );

        // Update the accepted questions and store the updated list
        const updatedAcceptedQuestions = updateAcceptedQuestions(data.recentSubmissionList, storedAcceptedQuestions, uncompletedJsQuestions);
        await storeAcceptedQuestions(acceptedQuestionsCollection, username, [...storedAcceptedQuestions, ...updatedAcceptedQuestions]);

        // Calculate the total count of accepted questions
        const count = storedAcceptedQuestions.length + updatedAcceptedQuestions.length;

        res.status(200).json({ message: "Username submitted successfully", count, acceptedQuestions: [...storedAcceptedQuestions, ...updatedAcceptedQuestions] });
    } catch (error) {
        console.error("Error in POST /username:", error);
        res.status(500).json({ error: "An error occurred while processing the request" });
    }
});

app.get('/jsquestions', async (req, res) => {
    try {
        const jsQuestions = await fetchJsonObject(jsQuestionsCollection);
        res.status(200).json(jsQuestions);
    } catch (error) {
        console.error("Error in GET /jsquestions:", error);
        res.status(500).json({ error: "An error occurred while fetching the JSON object" });
    }
});


app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
