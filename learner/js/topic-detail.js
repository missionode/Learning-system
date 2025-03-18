// js/topic-detail.js

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
            document.getElementById('topic-title').textContent = topic.title;
            document.getElementById('topic-tag').textContent = topic.tag;

            const googleDocIframe = document.getElementById('google-doc-iframe');
            if (topic.googleDocLink) {
                googleDocIframe.src = topic.googleDocLink;
            } else {
                googleDocIframe.style.display = 'none';
            }

            const videoIframe = document.getElementById('video-iframe');
            if (topic.videoLink) {
                videoIframe.src = topic.videoLink;
            } else {
                videoIframe.style.display = 'none';
            }

            const audioPlayer = document.getElementById('audio-player');
            if (topic.audioLink) {
                audioPlayer.src = topic.audioLink;
            } else {
                audioPlayer.style.display = 'none';
            }

            const slideIframe = document.getElementById('slide-iframe');
            if (topic.slideLink) {
                slideIframe.src = topic.slideLink;
            } else {
                slideIframe.style.display = 'none';
            }

            document.getElementById('mark-complete-btn').addEventListener('click', () => {
                const topicStatuses = JSON.parse(localStorage.getItem('topicStatuses')) || {};
                // topicStatuses[topic.title] = 'completed';
                localStorage.setItem('topicStatuses', JSON.stringify(topicStatuses));
                window.location.href = `quiz.html?topic=${encodeURIComponent(topic.title)}`;
            });
        } else {
            console.log("Topic not found.");
            window.location.href = "journey.html";
        }
    } else {
        console.log("User data or topic title not found.");
        window.location.href = "journey.html";
    }
});