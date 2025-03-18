// js/manage.js

console.log("Manage script loaded!");

let courses = [];

function loadCourses() {
  const storedCourses = localStorage.getItem('courses');
  if (storedCourses) {
    courses = JSON.parse(storedCourses);
  }
}

loadCourses();

function populateCourseSelectBackup() {
  const courseSelect = document.getElementById('course-select-backup');
  courseSelect.innerHTML = '<option value="">Select a Course</option>';
  courses.forEach(course => {
    const option = document.createElement('option');
    option.value = course.title;
    option.textContent = course.title;
    courseSelect.appendChild(option);
  });
}

populateCourseSelectBackup();

// Function to download full backup
function downloadFullBackup() {
  const data = {
    courses: JSON.parse(localStorage.getItem('courses')) || [],
    topics: JSON.parse(localStorage.getItem('topics')) || []
  };
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'full-backup.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Function to download course backup
function downloadCourseBackup() {
  const selectedCourse = document.getElementById('course-select-backup').value;
  if (!selectedCourse) {
    alert('Please select a course.');
    return;
  }
  const courseData = {
    courses: courses.filter(course => course.title === selectedCourse),
    topics: JSON.parse(localStorage.getItem('topics')).filter(topic => topic.course === selectedCourse)
  };
  const json = JSON.stringify(courseData, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${selectedCourse}-backup.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Function to restore full backup
function restoreFullBackup() {
  const fileInput = document.getElementById('restore-full-backup');
  const file = fileInput.files[0];
  if (!file) {
    alert('Please select a file to restore.');
    return;
  }
  const reader = new FileReader();
  reader.onload = function(event) {
    try {
      const data = JSON.parse(event.target.result);
      localStorage.setItem('courses', JSON.stringify(data.courses));
      localStorage.setItem('topics', JSON.stringify(data.topics));
      alert('Restore successful!');
      location.reload();
    } catch (error) {
      alert('Invalid file format.');
    }
  };
  reader.readAsText(file);
}

// Event listeners
document.getElementById('download-full-backup').addEventListener('click', downloadFullBackup);
document.getElementById('download-course-backup').addEventListener('click', downloadCourseBackup);
document.getElementById('restore-full-backup-button').addEventListener('click', () => document.getElementById('restore-full-backup').click());
document.getElementById('restore-full-backup').addEventListener('change', restoreFullBackup);