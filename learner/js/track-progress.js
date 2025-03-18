// js/track-progress.js

document.addEventListener('DOMContentLoaded', () => {
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

        if (userDataString) {
            try {
                const userData = JSON.parse(userDataString);
                const topicStatuses = JSON.parse(topicStatusesString) || {};

                if (userData && userData.database && userData.database.topics) {
                    const topics = userData.database.topics;
                    const completedTopics = topics.filter(topic => topicStatuses[topic.title] === 'completed');
                    const pendingTopics = topics.filter(topic => topicStatuses[topic.title] !== 'completed');
                    const totalTopics = topics.length;
                    const completedCount = completedTopics.length;
                    const completionPercentage = totalTopics > 0 ? (completedCount / totalTopics) * 100 : 0;

                    // Progress Bar
                    const progressBar = document.getElementById('progress-bar');
                    const progressPercentageText = document.getElementById('progress-percentage');
                    progressBar.style.width = `${completionPercentage}%`;
                    progressPercentageText.textContent = `${completionPercentage.toFixed(2)}%`;

                    // Topic Completion Chart
                    const topicCompletionChart = new Chart(document.getElementById('topic-completion-chart'), {
                        type: 'pie',
                        data: {
                            labels: ['Completed', 'Pending'],
                            datasets: [{
                                data: [completedCount, totalTopics - completedCount],
                                backgroundColor: ['#36a2eb', '#ff6384'],
                            }]
                        },
                    });

                    // Quiz Scores Chart (Placeholder - Replace with actual quiz score data)
                    const quizScoresChart = new Chart(document.getElementById('quiz-scores-chart'), {
                        type: 'bar',
                        data: {
                            labels: completedTopics.map(topic => topic.title), // Use completed topic titles as labels
                            datasets: [{
                                label: 'Quiz Scores (%)',
                                data: completedTopics.map(() => 100), // Placeholder: Assume 100% for completed
                                backgroundColor: '#4bc0c0',
                            }]
                        },
                        options: {
                            scales: {
                                y: {
                                    beginAtZero: true,
                                    max: 100,
                                },
                            },
                        },
                    });

                    // Topics to Take List
                    const topicsToTakeList = document.getElementById('topics-to-take-list');
                    pendingTopics.forEach(topic => {
                        const listItem = document.createElement('li');
                        listItem.textContent = topic.title;
                        topicsToTakeList.appendChild(listItem);
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
});