document.addEventListener('DOMContentLoaded', function () {
    const usernameInput = document.getElementById('username');
    const submitbtn = document.getElementById('submitbtn');
    const result = document.getElementById('result');
    const result_span = document.getElementById('result_span');
    const error = document.getElementById('error');
    const today_question = document.getElementById('today_question');
    const day_div = document.getElementById('day_div');
    const topic_div = document.getElementById('topic_div');
    const inputContainer = document.querySelector('.input-container');
    const greeting = document.createElement('h2');
    const backButton = document.createElement('button');

    // Load the stored username from local storage
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
        inputContainer.remove();
        submitbtn.remove();
        greeting.textContent = `Hi, ${storedUsername}!`;
        document.body.insertBefore(greeting, result);
        document.body.insertBefore(backButton, result);
        updateCount(storedUsername);
    } else {
        result.innerHTML = 'See your completed question by entering username.';
    }

    backButton.textContent = 'Back';
    backButton.classList.add('button-85');
    backButton.style.marginTop = '10px';

    backButton.addEventListener('click', () => {
        localStorage.removeItem('username');
        greeting.remove();
        backButton.remove();
        document.body.insertBefore(inputContainer, result);
        document.body.insertBefore(submitbtn, result);
        result.innerHTML = 'See your completed question by entering username.';
    });

    submitbtn.addEventListener('click', async () => {
        const username = usernameInput.value;
        if (username) {
            localStorage.setItem('username', username);
            inputContainer.remove();
            submitbtn.remove();
            greeting.textContent = `Hi, ${username}!`;
            document.body.insertBefore(greeting, result);
            document.body.insertBefore(backButton, result);

            await updateCount(username);
        }
    });

    async function updateCount(username) {
        try {
            const response = await fetch('https://leetcode-backend-v2n3.onrender.com/username', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username })
            });

            if (response.ok) {
                const data = await response.json();
                result_span.innerHTML = `${data.count}`;
            } else {
                error.innerHTML = 'An error occurred while processing the request.';
            }
        } catch (error) {
            console.error('Error in updating count:', error);
            error.innerHTML = 'An error occurred while processing the request.';
        }
    }

    // fetch recently added question added to leetcode post from backend
    async function fetchJsonObject() {
        try {
            const response = await fetch('https://leetcode-backend-v2n3.onrender.com/jsQuestions');

            const responseText = await response.text();
            console.log('Response text:', responseText);

            const data = JSON.parse(responseText); 

            const items = data[0].days.map((day, index) => {
                return {
                    day: data[0].days[index],
                    topic: data[0].topics[index],
                    question: data[0].questions[index],
                    link: data[0].links[index],
                };
            });
            day_div.textContent = items[0].day;
            topic_div.textContent = items[0].topic;
            today_question.href = items[0].link;
            today_question.textContent = items[0].question;
            today_question.target = '_blank';
        } catch (error) {
            console.error('Error fetching JSON object:', error);
        }
    }

    fetchJsonObject();
});