// js/splash.js

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const isFirstVisit = localStorage.getItem('firstVisit') === null;
        if (isFirstVisit) {
            localStorage.setItem('firstVisit', 'false');
            window.location.href = 'onboarding.html';
        } else {
            window.location.href = 'dashboard.html';
        }
    }, 3000);
});