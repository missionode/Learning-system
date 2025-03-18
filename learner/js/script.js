// js/script.js

document.addEventListener('DOMContentLoaded', () => {

    // ... (existing code for bottom nav) ...

    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const menuItems = document.querySelector('.menu-items');

    hamburgerMenu.addEventListener('click', () => {
        menuItems.classList.toggle('show');
    });

    document.addEventListener('click', (event) => {
        if (!event.target.closest('.top-nav')) {
            menuItems.classList.remove('show');
        }
    });

});