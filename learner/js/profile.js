// js/profile.js

document.addEventListener('DOMContentLoaded', () => {
    const nameInput = document.getElementById('name');
    const nicknameInput = document.getElementById('nickname');
    const databaseInput = document.getElementById('database');
    const submitBtn = document.getElementById('submit-btn');
    const cancelBtn = document.getElementById('cancel-btn');

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

    if (userData) {
        nameInput.value = userData.name;
        nicknameInput.value = userData.nickname;
    }

    submitBtn.addEventListener('click', () => {
        const name = nameInput.value;
        const nickname = nicknameInput.value;
        const databaseFile = databaseInput.files[0];

        if (name && nickname) {
            if (databaseFile) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    try {
                        const database = JSON.parse(event.target.result);
                        localStorage.setItem(userDataKey, JSON.stringify({ name, nickname, database }));
                        window.location.href = 'dashboard.html';
                    } catch (error) {
                        alert('Invalid database file.');
                    }
                };
                reader.readAsText(databaseFile);
            } else {
                localStorage.setItem(userDataKey, JSON.stringify({ name, nickname, database: userData.database }));
                window.location.href = 'dashboard.html';
            }
        } else {
            alert('Please fill in name and nickname.');
        }
    });

    cancelBtn.addEventListener('click', () => {
        window.location.href = 'dashboard.html';
    });
});