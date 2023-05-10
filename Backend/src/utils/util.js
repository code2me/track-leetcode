import dotenv from 'dotenv';
dotenv.config();
import axios from 'axios';
import {
    getJsQuestionsFromDatabase,
    updateJsQuestionsInDatabase,
} from '../db/database.js';

const corsProxy = process.env.CORS_PROXY;
const url = process.env.JSON_URL;

const extractData = (input) => {
    const {
        matchedUser: { username },
        matchedUser: {
            profile: { realName },
        },
        recentSubmissionList,
    } = input;

    const data = {
        username,
        realName,
        recentSubmissionList: recentSubmissionList.map(({ title, timestamp, statusDisplay, lang }) => ({
            title,
            timestamp,
            statusDisplay,
            lang,
        })),
    };

    return data;
};

const fetchJsonObject = async (jsQuestionsCollection) => {
    const currentTime = new Date();
    const targetTimes = [
        new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate(), 5, 35, 0, 0),
        new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate(), 6, 0, 0, 0),
    ];

    const shouldUpdateCache =
        currentTime > targetTimes[0] && currentTime < targetTimes[1];

    if (shouldUpdateCache) {
        const jsQuestions = await getJsQuestionsFromDatabase(jsQuestionsCollection);

        if (jsQuestions) {
            return jsQuestions;
        }
    }

    try {
        const response = await axios.get(corsProxy + url, {
            headers: {
                'x-requested-with': 'XMLHttpRequest',
            },
        });

        if (shouldUpdateCache) {
            await updateJsQuestionsInDatabase(jsQuestionsCollection, response.data);
        }

        return response.data;
    } catch (error) {
        console.error('Error fetching JSON object:', error);
    }
};


function updateAcceptedQuestions(recentSubmissions, storedAcceptedQuestions, uncompletedJsQuestions) {
    // Create a Map to store unique accepted question titles
    const acceptedQuestionsMap = new Map();

    // Add stored accepted questions to the map
    storedAcceptedQuestions.forEach(question => {
        acceptedQuestionsMap.set(question.title, question);
    });

    // Check if recent submissions contain new accepted questions
    recentSubmissions.forEach(submission => {
        if (
            uncompletedJsQuestions.includes(submission.title) &&
            submission.statusDisplay === 'Accepted' &&
            !acceptedQuestionsMap.has(submission.title)
        ) {
            acceptedQuestionsMap.set(submission.title, submission);
        }
    });

    // Convert the Map back to an array
    const acceptedQuestions = Array.from(acceptedQuestionsMap.values());

    // Filter out stored accepted questions to return only the new ones
    const newAcceptedQuestions = acceptedQuestions.filter(
        question => !storedAcceptedQuestions.find(stored => stored.title === question.title)
    );

    return newAcceptedQuestions;
}

export {
    extractData, 
    fetchJsonObject,
    updateAcceptedQuestions, 
};