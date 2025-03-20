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

            // Quiz Details
            let minScore = 0;
            if (topic.tag === 'Hike') {
                minScore = 80;
            } else if (topic.tag === 'Checkpoint') {
                minScore = 60;
            }

            // Quiz Questions
            const quizQuestionsContainer = document.getElementById('quiz-questions');
            const questions = parseQuizData(topic.quizData);
            const numberOfQuestions = questions.length;

            // Display total time
            const totalTimeDisplay = document.getElementById('total-time-display');
            const totalQuizTime = questions.length * 30;
            totalTimeDisplay.textContent = `Total Quiz Time: ${totalQuizTime} seconds`;

            questions.forEach((question, index) => {
                const questionDiv = document.createElement('div');
                questionDiv.classList.add('quiz-question');
                questionDiv.style.display = 'none'; // Hide questions initially
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
            timerDisplay.style.display = 'none'; // Hide timer initially

            function startTimer() {
                timerDisplay.style.display = ''; // Show timer when quiz starts
                // Show all questions at the start of the quiz
                const questionDivs = quizQuestionsContainer.querySelectorAll('.quiz-question');
                questionDivs.forEach(questionDiv => {
                    questionDiv.style.display = '';
                });

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


            // Submit Quiz - initially hidden
            const submitQuizButton = document.getElementById('submit-quiz-btn');
            submitQuizButton.style.display = 'none'; // Hide submit button initially
            submitQuizButton.addEventListener('click', handleQuizCompletion);

            // Define topicStatuses at the beginning of the script, before handleQuizCompletion
            let topicStatuses = JSON.parse(localStorage.getItem('topicStatuses')) || {};


            function handleQuizCompletion() {
                // Stop the timer when the quiz is completed
                clearInterval(quizTimer);

                const answers = [];
                questions.forEach((question, index) => {
                    const selectedOption = document.querySelector(`input[name="q${index}"]:checked`);
                    answers.push(selectedOption ? selectedOption.value : null);
                });
                const score = calculateScore(questions, answers);
                const resultDiv = document.getElementById('quiz-result');
                let message = `You scored ${score}%. Failed. The quiz will restart in `;

                questions.forEach((question, index) => {
                    const selectedOption = document.querySelector(`input[name="q${index}"]:checked`);
                    const questionDiv = quizQuestionsContainer.querySelectorAll('.quiz-question')[index];
                    const labels = questionDiv.querySelectorAll('label'); // Get all labels

                    labels.forEach(label => {
                        const input = label.querySelector('input');
                        if (topic.tag === 'Starting point') {
                            if (input.value === question.correct) {
                                label.style.backgroundColor = '#90EE90'; // Light green for correct
                                label.style.color = 'black';
                            } else if (selectedOption && input.value === selectedOption.value) {
                                label.style.backgroundColor = '#FFC0CB'; // Pink for incorrect
                                label.style.color = 'black';
                            }
                        }
                        else{
                            if (selectedOption && input.value === selectedOption.value && selectedOption.value !== question.correct) {
                                label.style.backgroundColor = '#FFC0CB'; // Pink for incorrect
                                label.style.color = 'black';
                            }
                        }
                    });
                });

                if (topic.tag !== 'Starting point') {
                    if (score >= minScore) {
                        resultDiv.innerHTML = `You scored ${score}%. Passed!`;
                        topicStatuses[topic.title] = 'completed';
                        localStorage.setItem('topicStatuses', JSON.stringify(topicStatuses));

                        // Find the index of the current topic
                        const currentTopicIndex = userData.database.topics.findIndex(t => t.title === topicTitle);

                        // Get the next topic
                        const nextTopic = userData.database.topics[currentTopicIndex + 1];


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
                        // Remove the submit button.
                        submitQuizButton.remove();

                        let countdown = 60;
                        const countdownInterval = setInterval(() => {
                            resultDiv.innerHTML = message + `${countdown} seconds.`;
                            countdown--;

                            if (countdown < 0) {
                                clearInterval(countdownInterval);
                                window.location.reload();
                            }
                        }, 1000);
                    }
                } else {
                    //Starting point topic always completed, but only after submit
                    topicStatuses[topic.title] = 'completed';
                    localStorage.setItem('topicStatuses', JSON.stringify(topicStatuses));

                    const currentTopicIndex = userData.database.topics.findIndex(t => t.title === topicTitle);
                    const nextTopic = userData.database.topics[currentTopicIndex + 1];

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

            function resetQuiz() {
                clearInterval(quizTimer);
                document.getElementById('quiz-result').innerHTML = "";
                timeLeft = totalQuizTime;
                questions.forEach((question, index) => {
                    const questionDiv = quizQuestionsContainer.querySelectorAll('.quiz-question')[index];
                    questionDiv.querySelectorAll('input').forEach(input => {
                        input.checked = false;
                    })
                    questionDiv.style.display = 'none'; // Hide all questions
                });
                timerDisplay.style.display = 'none';
                submitQuizButton.style.display = 'none';
            }

            // Initial setup: show confirmation alert
            const confirmation = confirm(`This quiz has ${totalQuizTime} seconds and ${numberOfQuestions} questions.  The minimum passing score is ${minScore}%. Are you ready to start the quiz?`);
            if (confirmation) {
                startTimer();
                quizQuestionsContainer.style.display = '';
                submitQuizButton.style.display = '';
                timerDisplay.style.display = ''; //show timer
            } else {
                history.back();
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
