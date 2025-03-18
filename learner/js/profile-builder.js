// js/profile-builder.js

document.addEventListener('DOMContentLoaded', () => {
    const nameInput = document.getElementById('name');
    const nicknameInput = document.getElementById('nickname');
    const databaseInput = document.getElementById('database');
    const submitBtn = document.getElementById('submit-btn');

    submitBtn.addEventListener('click', () => {
        const name = nameInput.value;
        const nickname = nicknameInput.value;
        const databaseFile = databaseInput.files[0];

        if (name && nickname && databaseFile) {
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const database = JSON.parse(event.target.result);
                    const uniqueKey = `learningAppUserData_${Date.now()}`; // More unique key
                    localStorage.setItem(uniqueKey, JSON.stringify({ name, nickname, database }));
                    window.location.href = 'dashboard.html';
                } catch (error) {
                    alert('Invalid database file.');
                }
            };
            reader.readAsText(databaseFile);
        } else {
            alert('Please fill in all fields.');
        }
    });
});