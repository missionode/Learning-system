// js/journey.js

document.addEventListener('DOMContentLoaded', () => {
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

    if (userData && userData.database && userData.database.topics) {
        const topics = userData.database.topics;
        const topicStatuses = JSON.parse(localStorage.getItem('topicStatuses')) || {};
        const topicList = document.getElementById('topic-list');

        topics.forEach((topic, index) => {
            const topicDiv = document.createElement('div');
            topicDiv.classList.add('topic-item');

            const topicTitle = document.createElement('h3');
            topicTitle.textContent = topic.title;
            topicTitle.setAttribute('title', topic.title);
            topicDiv.appendChild(topicTitle);

            const topicTag = document.createElement('p');
            topicTag.classList.add('topic-tag'); // Add a class for styling
            let icon = '';
            if (topic.tag === 'Starting point') {
                icon = '<i class="fas fa-flag-checkered"></i> ';
            } else if (topic.tag === 'Checkpoint') {
                icon = '<i class="fas fa-map-marker-alt"></i> ';
            } else if (topic.tag === 'Hike') {
                icon = '<i class="fas fa-mountain"></i> ';
            }
            topicTag.innerHTML = icon + topic.tag;
            topicDiv.appendChild(topicTag);

           

            const status = topicStatuses[topic.title] || 'pending';
            const statusText = document.createElement('p');
            statusText.textContent = `Status: ${status}`;
            statusText.classList.add(`status-${status}`); // Add status class for styling
            topicDiv.appendChild(statusText);

            if (status === 'completed') {
                // topicTitle.textContent = 'Completed';
                const viewDetailsBtn = document.createElement('a');
                viewDetailsBtn.textContent = 'Completed';
                viewDetailsBtn.href = `topic-detail.html?topic=${encodeURIComponent(topic.title)}`;
                topicDiv.appendChild(viewDetailsBtn);
            } else {
                let previousTopicCompleted = true;
                if (index > 0) {
                    const previousTopic = topics[index - 1];
                    if (topicStatuses[previousTopic.title] !== 'completed') {
                        previousTopicCompleted = false;
                    }
                }

                if (previousTopicCompleted) {
                    const viewDetailsBtn = document.createElement('a');
                    viewDetailsBtn.textContent = 'Start Learning';
                    viewDetailsBtn.href = `topic-detail.html?topic=${encodeURIComponent(topic.title)}`;
                    topicDiv.appendChild(viewDetailsBtn);
                } else {
                    const viewDetailsBtn = document.createElement('p');
                    viewDetailsBtn.textContent = 'Complete Previous Topic First';
                    topicDiv.appendChild(viewDetailsBtn);
                }
            }

            topicList.appendChild(topicDiv);
        });

        // Check if all topics are completed
        const allTopicsCompleted = topics.every(topic => topicStatuses[topic.title] === 'completed');
        if (allTopicsCompleted && topics.length > 0) {
            alert('Congratulations! You have successfully completed all topics.');
            window.location.href = 'dashboard.html'; // Redirect to dashboard
        }
    } else {
        console.log("User data or topics not found.");
        window.location.href = "dashboard.html";
    } 


    const tagElements = document.querySelectorAll(".topic-tag");
    tagElements.forEach(element => {
      addClassBasedOnTagContent(element);
    });

});


function addClassBasedOnTagContent(element) {
    if (!element || !element.classList) {
      console.error("Invalid element provided.");
      return;
    }
  
    const tagContent = element.textContent.trim().toLowerCase(); // Get content, trim, and lowercase
  
    if (tagContent.includes("starting point")) {
      element.classList.add("starting-point");
    } else if (tagContent.includes("hike")) {
      element.classList.add("hike");
    } else if (tagContent.includes("checkpoint")) {
      element.classList.add("checkpoint");
    } else {
      // Optionally add a default class or handle unknown tags
      element.classList.add("unknown-tag");
    }
  }