# Track Leetcode

This is the LeetCode Tracker application. It is used to track leetcode 30 days Javascript Questions. 
It uses Node.js, Express, and MongoDB to store and manage user data and web Scraped LeetCode JavaScript questions from [discussion form](https://leetcode.com/discuss/study-guide/3458761).

## Table of Contents

- [Track Leetcode](#track-leetcode)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Usage](#usage)
  - [API Routes](#api-routes)
  - [Environment Variables](#environment-variables)
  - [License](#license)
  - [System Architecture](#system-architecture)

## Installation

1. Clone the repository:

```
git clone https://github.com/code2me/track-leetcode.git
```

2. Install dependencies:

```
cd track-leetcode

npm install
```

3. Setup Environment variable in .env and put file in track-leetcode/backend

- MONGODB_URI: Your MongoDB connection string.

- PORT: The port on which the server will listen.

- CORS_PROXY: The URL of a CORS proxy to bypass CORS restrictions.

- JSON_URL: The URL of the remote JSON file containing JavaScript questions.

4. Start the server:

```
npm start
```

## Usage

After starting the server, you can access the API at <http://localhost:3000>.

## API Routes

POST /username: Submit a LeetCode username to fetch user information, store accepted questions, and get the count of accepted JavaScript questions.

GET /jsquestions: Fetch the list of JavaScript questions from a remote JSON file.

## Environment Variables

The following environment variables should be set in your .env file:

- MONGODB_URI: Your MongoDB connection string.

- PORT: The port on which the server will listen.

- CORS_PROXY: The URL of a CORS proxy to bypass CORS restrictions.

- JSON_URL: The URL of the remote JSON file containing JavaScript questions.

## License

This project is licensed under the MIT License.

## System Architecture
![System Architecture](https://github.com/code2me/track-leetcode/blob/main/design.png?raw=true)
