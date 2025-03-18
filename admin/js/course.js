// js/course.js

console.log("Course script loaded!");

let courses = [];

function saveCourses() {
  localStorage.setItem('courses', JSON.stringify(courses));
}

function loadCourses() {
  const storedCourses = localStorage.getItem('courses');
  if (storedCourses) {
    courses = JSON.parse(storedCourses);
  }
}

loadCourses();

function renderCourseList(searchQuery = '') {
  const courseList = document.getElementById('course-list');
  courseList.innerHTML = '';

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  filteredCourses.forEach((course, index) => {
    const courseItem = document.createElement('div');
    courseItem.classList.add('course-item');
    courseItem.innerHTML = `
      <div class="course-title">${course.title}</div>
      <div class="course-actions">
        <button onclick="editCourse(${courses.indexOf(course)})">Edit</button>
        <button onclick="deleteCourse(${courses.indexOf(course)})">Delete</button>
      </div>
    `;
    courseList.appendChild(courseItem);
  });
}

renderCourseList();

function addCourse(title) {
  courses.push({ title });
  saveCourses();
  renderCourseList();
}

function editCourse(index) {
  const newTitle = prompt('Enter new course title:', courses[index].title);
  if (newTitle) {
    courses[index].title = newTitle;
    saveCourses();
    renderCourseList();
  }
}

function deleteCourse(index) {
  if (confirm('Are you sure you want to delete this course?')) {
    courses.splice(index, 1);
    saveCourses();
    renderCourseList();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const courseForm = document.getElementById('course-form');
  courseForm.innerHTML = `
    <div class="search-container">
      <input type="text" id="search-course" placeholder="Search Courses">
    </div>
    <input type="text" id="course-title" placeholder="Course Title">
    <button id="add-course-button">Add Course</button>
  `;

  const addCourseButton = document.getElementById('add-course-button');
  addCourseButton.addEventListener('click', () => {
    const courseTitle = document.getElementById('course-title').value;
    if (courseTitle) {
      addCourse(courseTitle);
      document.getElementById('course-title').value = '';
      document.getElementById('search-course').value = '';
    }
  });

  const searchInput = document.getElementById('search-course');
  searchInput.addEventListener('input', () => {
    renderCourseList(searchInput.value);
  });
});