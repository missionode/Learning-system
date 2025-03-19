// js/script.js

document.addEventListener('DOMContentLoaded', () => {



    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const menuItems = document.querySelector('.menu-items');
    
    if (hamburgerMenu) {
        hamburgerMenu.addEventListener('click', () => {
            menuItems.classList.toggle('show');
        });
    }
   
    document.addEventListener('click', (event) => {
        if (!event.target.closest('.top-nav')) {
            menuItems.classList.remove('show');
        }
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



