// js/settings.js

document.addEventListener('DOMContentLoaded', () => {
    const backupBtn = document.getElementById('backup-btn');
    const restoreInput = document.getElementById('restore-input');
    const restoreBtn = document.getElementById('restore-btn');

    backupBtn.addEventListener('click', () => {
        let allData = {};
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            allData[key] = JSON.parse(localStorage.getItem(key));
        }
        const jsonData = JSON.stringify(allData);
        const blob = new Blob([jsonData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'learning-app-backup.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });

    restoreBtn.addEventListener('click', () => {
        restoreInput.click();
    });

    restoreInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    for (const key in data) {
                        localStorage.setItem(key, JSON.stringify(data[key]));
                    }
                    alert('Data restored successfully!');
                    window.location.reload();
                } catch (error) {
                    alert('Invalid backup file.');
                }
            };
            reader.readAsText(file);
        }
    });
});

document.getElementById('reset-data-btn').addEventListener('click', () => {
    localStorage.clear();
    alert('Data reset successfully!');
    window.location.reload();
});