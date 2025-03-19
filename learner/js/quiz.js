document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const topicTitle = urlParams.get('topic');

    let userData = null;
    let userDataKey = null;

    // Retrieve the user data key
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('learningAppUserData_')) {
            userDataKey = key;
            break;
        }
    }

    // Retrieve user data if key is found
    if (userDataKey) {
        userData = JSON.parse(localStorage.getItem(userDataKey));
    }

    if (userData && userData.database && userData.database.topics && topicTitle) {
        const topic = userData.database.topics.find(t => t.title === topicTitle);

        if (topic) {
            document.getElementById('quiz-title').textContent = `Quiz: ${topic.title}`;

            // Quiz Rules
            const quizRulesText = document.getElementById('quiz-rules-text');
            let minScore = 0;
            if (topic.tag === 'Hike') {
                minScore = 80;
            } else if (topic.tag === 'Checkpoint') {
                minScore = 60;
            }
            quizRulesText.textContent = `To pass this quiz, you need to score at least ${minScore}%. All the Best.`;

            // Quiz Questions
            const quizQuestionsContainer = document.getElementById('quiz-questions');
            const questions = parseQuizData(topic.quizData);

            // Display total time
            const totalTimeDisplay = document.getElementById('total-time-display');
            const totalQuizTime = questions.length * 30; // 30 seconds per question
            totalTimeDisplay.textContent = `Total Quiz Time: ${totalQuizTime} seconds`;

            questions.forEach((question, index) => {
                const questionDiv = document.createElement('div');
                questionDiv.classList.add('quiz-question');
                questionDiv.innerHTML = `<h3>${question.question}</h3>`;
                question.options.forEach(option => {
                    questionDiv.innerHTML += `<label><input type="${question.type === 'true-false' ? 'radio' : 'radio'}" name="q${index}" value="${option}"> ${option}</label>`;
                });
                quizQuestionsContainer.appendChild(questionDiv);
            });

            // Timer Logic
            let quizTimer;
            let timeLeft = totalQuizTime;
            const timerDisplay = document.getElementById('timer-display');

            function startTimer() {
                timerDisplay.textContent = `Time left: ${timeLeft}s`;

                quizTimer = setInterval(() => {
                    timeLeft--;
                    timerDisplay.textContent = `Time left: ${timeLeft}s`;

                    if (timeLeft < 0) {
                        clearInterval(quizTimer);
                        alert("Time's up for the quiz!");
                        handleQuizCompletion();
                    }
                }, 1000);
            }

            startTimer();

            // Submit Quiz
            document.getElementById('submit-quiz-btn').addEventListener('click', () => {
                clearInterval(quizTimer);
                handleQuizCompletion();
            });

            function handleQuizCompletion() {
                const answers = [];
                questions.forEach((question, index) => {
                    const selectedOption = document.querySelector(`input[name="q${index}"]:checked`);
                    answers.push(selectedOption ? selectedOption.value : null);
                });
                const score = calculateScore(questions, answers);
                const resultDiv = document.getElementById('quiz-result');
                resultDiv.innerHTML = `You scored ${score}%.`;

                const topicStatuses = JSON.parse(localStorage.getItem('topicStatuses')) || {};
                const topics = userData.database.topics;
                const currentIndex = topics.findIndex(t => t.title === topic.title);
                const nextTopic = topics[currentIndex + 1];

                if (topic.tag !== 'Starting point') {
                    if (score >= minScore) {
                        resultDiv.innerHTML += ' Passed!';
                        topicStatuses[topic.title] = 'completed';
                        localStorage.setItem('topicStatuses', JSON.stringify(topicStatuses));

                        if (nextTopic) {
                            resultDiv.innerHTML += `<br><button id="next-topic-btn">Next Topic</button>`;
                            document.getElementById('next-topic-btn').addEventListener('click', () => {
                                window.location.href = `topic-detail.html?topic=${encodeURIComponent(nextTopic.title)}`;
                            });
                        } else {
                            alert('You have completed all topics!');
                            window.location.href = 'journey.html';
                        }
                    } else {
                        resultDiv.innerHTML += ' Failed. Try again.';
                        document.getElementById('submit-quiz-btn').textContent = "Restart Quiz";
                        document.getElementById('submit-quiz-btn').onclick = function() {
                            resetQuiz();
                        }

                    }
                } else {
                    //Starting point topic always completed, but only after submit
                    topicStatuses[topic.title] = 'completed';
                    localStorage.setItem('topicStatuses', JSON.stringify(topicStatuses));

                    if (nextTopic) {
                        resultDiv.innerHTML += `<br><button id="next-topic-btn">Next Topic</button>`;
                        document.getElementById('next-topic-btn').addEventListener('click', () => {
                            window.location.href = `topic-detail.html?topic=${encodeURIComponent(nextTopic.title)}`;
                        });
                    } else {
                        alert('You have completed all topics!');
                        window.location.href = 'journey.html';
                    }
                }
            }

            function resetQuiz(){
                clearInterval(quizTimer);
                document.getElementById('quiz-result').innerHTML = "";
                timeLeft = totalQuizTime;
                document.querySelectorAll('.quiz-question').forEach(questionDiv => {
                    questionDiv.querySelectorAll('input').forEach(input => {
                        input.checked = false;
                    })
                })
                startTimer();
                document.getElementById('submit-quiz-btn').textContent = "Submit Quiz";
                document.getElementById('submit-quiz-btn').onclick = function() {
                    clearInterval(quizTimer);
                    handleQuizCompletion();
                }
            }

        } else {
            console.log("Topic not found.");
            window.location.href = "journey.html";
        }
    } else {
        console.log("User data or topic title not found.");
        window.location.href = "journey.html";
    }
});

function parseQuizData(csvData) {
    const questions = [];
    const rows = csvData.split('\n');
    rows.forEach(row => {
        const cols = row.split('","');
        if (cols.length === 4) {
            const question = cols[0].replace('"', '');
            const options = cols[1].split(',');
            const correct = cols[2];
            const type = cols[3].replace('"', '');
            questions.push({ question, options, correct, type });
        }
    });
    return questions;
}

function calculateScore(questions, answers) {
    let correctAnswers = 0;
    questions.forEach((question, index) => {
        if (answers[index] === question.correct) {
            correctAnswers++;
        }
    });
    return (correctAnswers / questions.length) * 100;
}