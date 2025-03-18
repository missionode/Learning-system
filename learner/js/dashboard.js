// js/dashboard.js

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        let userDataKey = null;

        // Find the user data key
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('learningAppUserData_')) {
                userDataKey = key;
                break;
            }
        }

        if (userDataKey) {
            const userDataString = localStorage.getItem(userDataKey);
            const topicStatusesString = localStorage.getItem('topicStatuses');

            console.log("userDataString:", userDataString);
            console.log("topicStatusesString:", topicStatusesString);

            if (userDataString) {
                try {
                    const userData = JSON.parse(userDataString);
                    let topicStatuses = JSON.parse(topicStatusesString) || {};

                    console.log("userData:", userData);
                    console.log("topicStatuses:", topicStatuses);

                    if (userData && userData.database && userData.database.topics) {
                        const topics = userData.database.topics;
                        const excelTopicsList = document.getElementById('excel-topics');
                        const focusTopicsList = document.getElementById('focus-topics');

                        // Welcome message
                        const welcomeMessage = document.getElementById('welcome-message');
                        welcomeMessage.textContent = `Welcome, ${userData.name}!`;

                        // Journey button
                        const journeyButton = document.getElementById('journey-btn');
                        journeyButton.addEventListener('click', () => {
                            window.location.href = 'journey.html';
                        });

                        //create topic status if it does not exist.
                        topics.forEach(topic => {
                            if(!topicStatuses[topic.title]){
                                topicStatuses[topic.title] = "pending";
                            }
                        });
                        localStorage.setItem('topicStatuses', JSON.stringify(topicStatuses));

                        // Separate topics based on status
                        const excelTopics = [];
                        const focusTopics = [];

                        topics.forEach(topic => {
                            const status = topicStatuses[topic.title] || 'pending';
                            if (status === 'completed') {
                                excelTopics.push(topic);
                            } else {
                                focusTopics.push(topic);
                            }
                        });

                        // Populate Excel Topics
                        excelTopics.forEach(topic => {
                            const listItem = document.createElement('li');
                            listItem.textContent = topic.title;
                            excelTopicsList.appendChild(listItem);
                        });

                        // Populate Focus Topics
                        focusTopics.forEach(topic => {
                            const listItem = document.createElement('li');
                            listItem.textContent = topic.title;
                            focusTopicsList.appendChild(listItem);
                        });

                        console.log("excelTopics:", excelTopics);
                        console.log("focusTopics:", focusTopics);

                        // Charts
                        const completedTopicNames = Object.keys(topicStatuses).filter(topicName => topicStatuses[topicName] === 'completed');
                        const completedTopicScores = completedTopicNames.map(() => 100); // Assume 100% for completed

                        const timeSpentChart = new Chart(document.getElementById('time-spent-chart'), {
                            type: 'bar',
                            data: {
                                labels: completedTopicNames,
                                datasets: [{
                                    label: 'Completed Topics',
                                    data: completedTopicNames.map(()=>1), //Using number of completed topics as time spent data.
                                    backgroundColor: 'rgba(54, 162, 235, 0.5)',
                                    borderColor: 'rgba(54, 162, 235, 1)',
                                    borderWidth: 1
                                }]
                            },
                            options: {
                                scales: {
                                    y: {
                                        beginAtZero: true
                                    }
                                }
                            }
                        });

                        const quizPerformanceChart = new Chart(document.getElementById('quiz-performance-chart'), {
                            type: 'line',
                            data: {
                                labels: completedTopicNames,
                                datasets: [{
                                    label: 'Score (%)',
                                    data: completedTopicScores,
                                    fill: false,
                                    borderColor: 'rgb(75, 192, 192)',
                                    tension: 0.1
                                }]
                            },
                            options: {
                                scales: {
                                    y: {
                                        beginAtZero: true,
                                        max: 100
                                    }
                                }
                            }
                        });

                    } else {
                        console.error("Invalid data structure in localStorage.");
                    }
                } catch (error) {
                    console.error("Error parsing JSON:", error);
                }
            } else {
                console.error("User data not found in localStorage.");
            }
        } else {
            console.error("User data key not found in localStorage.");
        }
    }, 100);
});