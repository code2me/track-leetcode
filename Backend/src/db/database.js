import dotenv from 'dotenv';
dotenv.config();

import { MongoClient, ServerApiVersion } from 'mongodb';

const db_userame = process.env.DB_USERNAME;
const db_clustername = process.env.DB_CLUSTERNAME
const uri = `mongodb+srv://${db_userame}@${db_clustername}/?retryWrites=true&w=majority`;
const dbName = 'leetcode_challenge';

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

const connectDb = async () => {
    try {
        await client.connect();
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
        return client.db(dbName);
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        return null;
    }
};

async function getJsQuestionsFromDatabase(jsQuestionsCollection) {
    try {
        const storedJsQuestions = await jsQuestionsCollection.findOne({});
        return storedJsQuestions ? storedJsQuestions.questions : null;
    } catch (error) {
        console.error('Error getting JS questions from database:', error);
    }
}

async function updateJsQuestionsInDatabase(jsQuestionsCollection, questions) {
    try {
        await jsQuestionsCollection.updateOne(
            {},
            { $set: { questions, lastFetched: new Date() } },
            { upsert: true }
        );
    } catch (error) {
        console.error('Error updating JS questions in database:', error);
    }
}

async function storeAcceptedQuestions(acceptedQuestionsCollection, username, acceptedQuestions) {
    try {
        await acceptedQuestionsCollection.updateOne(
            { username },
            { $set: { acceptedQuestions } },
            { upsert: true }
        );
    } catch (error) {
        console.error('Error storing accepted questions:', error);
    }
}

async function getStoredAcceptedQuestions(acceptedQuestionsCollection, username) {
    try {
        const userQuestions = await acceptedQuestionsCollection.findOne({ username });
        return userQuestions ? userQuestions.acceptedQuestions : [];
    } catch (error) {
        console.error('Error getting stored accepted questions:', error);
    }
}

export {
    connectDb,
    getJsQuestionsFromDatabase,
    updateJsQuestionsInDatabase,
    storeAcceptedQuestions,
    getStoredAcceptedQuestions,
};