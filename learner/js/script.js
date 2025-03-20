// js/script.js

document.addEventListener('DOMContentLoaded', () => {



    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const menuItems = document.querySelector('.menu-items');
    
    if (hamburgerMenu) {
        hamburgerMenu.addEventListener('click', () => {
            menuItems.classList.toggle('show');
        });
    }
   if (menuItems) {
    document.addEventListener('click', (event) => {
        if (!event.target.closest('.top-nav')) {
            menuItems.classList.remove('show');
        }
    });
   }
    

function checkCourseCompletionAndRedirect() {
        const topicStatuses = JSON.parse(localStorage.getItem('topicStatuses')) || {};
        const userDataKey = Object.keys(localStorage).find(key => key.startsWith('learningAppUserData_'));

        if (userDataKey) {
            const userData = JSON.parse(localStorage.getItem(userDataKey));
            if (userData && userData.database && userData.database.topics) {
                const topics = userData.database.topics;
                // Check if there are topics and if all are completed
                const allCompleted = topics.length > 0 && topics.every(topic => topicStatuses[topic.title] === 'completed');

                if (allCompleted) {
                    // Redirect to congratulations page only if not already on it, and not on profile or settings
                    const currentPage = window.location.pathname;
                    if (
                        currentPage.indexOf('congratulations.html') === -1 &&
                        currentPage.indexOf('profile.html') === -1 &&
                        currentPage.indexOf('settings.html') === -1
                    ) {
                        window.location.href = 'congratulations.html';
                    }
                }
            }
        }
    }

    checkCourseCompletionAndRedirect();


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



