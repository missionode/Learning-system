// js/topics.js

console.log("Topics script loaded!");

let courses = [];
let topics = [];
let editingIndex = -1; // Track the index of the topic being edited

function loadCourses() {
  const storedCourses = localStorage.getItem('courses');
  if (storedCourses) {
    courses = JSON.parse(storedCourses);
  }
}

function loadTopics() {
    const storedTopics = localStorage.getItem('topics');
    if (storedTopics) {
        topics = JSON.parse(storedTopics);
    }
}

function saveTopics() {
    localStorage.setItem('topics', JSON.stringify(topics));
}

loadCourses();
loadTopics();

function populateCourseSelect() {
  const courseSelect = document.getElementById('selected-course');
  courseSelect.innerHTML = '<option value="">Select a Course</option>';
  courses.forEach(course => {
    const option = document.createElement('option');
    option.value = course.title;
    option.textContent = course.title;
    courseSelect.appendChild(option);
  });
}

populateCourseSelect();

function renderTopicList(searchQuery = '') {
  const topicList = document.getElementById('topic-list');
  topicList.innerHTML = '';

  const selectedCourse = document.getElementById('selected-course').value;

  const filteredTopics = topics.filter(topic =>
    topic.title.toLowerCase().includes(searchQuery.toLowerCase()) && topic.course === selectedCourse
  );

  filteredTopics.forEach((topic, index) => {
    const actualIndex = topics.findIndex(t => t.title === topic.title && t.course === topic.course && t.googleDocLink === topic.googleDocLink && t.videoLink === topic.videoLink && t.audioLink === topic.audioLink && t.slideLink === topic.slideLink && t.quizData === topic.quizData);

    const topicItem = document.createElement('div');
    topicItem.classList.add('topic-item');
    topicItem.innerHTML = `
      <div class="topic-title">${topic.title}</div>
      <div class="topic-actions">
        <button onclick="startEditTopic(${actualIndex})">Edit</button>
        <button onclick="deleteTopic(${actualIndex})">Delete</button>
      </div>
    `;
    topicList.appendChild(topicItem);
  });
}

renderTopicList();

document.getElementById('selected-course').addEventListener('change', () => {
    renderTopicList();
});

document.addEventListener('DOMContentLoaded', () => {
  const topicForm = document.getElementById('topic-form');
  topicForm.innerHTML = `
    <div class="search-container">
      <input type="text" id="search-topic" placeholder="Search Topics">
    </div>
    <input type="text" id="topic-title" placeholder="Topic Title">
    <select id="topic-tag">
      <option value="Hike">Hike</option>
      <option value="Checkpoint">Checkpoint</option>
      <option value="Starting point">Starting point</option>
    </select>
    <input type="url" id="google-doc-link" placeholder="Google Doc Link">
    <input type="url" id="video-link" placeholder="Video Link">
    <input type="url" id="audio-link" placeholder="Audio Link">
    <input type="url" id="slide-link" placeholder="Google Slide Link">
    <textarea id="quiz-data" rows="30" placeholder="Quiz Data (CSV)"></textarea>
    <button id="add-topic-button">Add Topic</button>
    <button id="update-topic-button" style="display: none;">Update Topic</button>
    <button id="cancel-edit-button" style="display: none;">Cancel</button>
  `;

  const addTopicButton = document.getElementById('add-topic-button');
  const updateTopicButton = document.getElementById('update-topic-button');
  const cancelEditButton = document.getElementById('cancel-edit-button');

  addTopicButton.addEventListener('click', () => {
    addOrUpdateTopic();
  });

  updateTopicButton.addEventListener('click', () => {
    addOrUpdateTopic();
  });

  cancelEditButton.addEventListener('click', () => {
    cancelEdit();
  });

  const searchInput = document.getElementById('search-topic');
  searchInput.addEventListener('input', () => {
    renderTopicList(searchInput.value);
  });
});

function addOrUpdateTopic() {
  const topicTitle = document.getElementById('topic-title').value;
  const topicTag = document.getElementById('topic-tag').value;
  const googleDocLink = document.getElementById('google-doc-link').value;
  const videoLink = document.getElementById('video-link').value;
  const audioLink = document.getElementById('audio-link').value;
  const slideLink = document.getElementById('slide-link').value;
  const quizData = document.getElementById('quiz-data').value;
  const selectedCourse = document.getElementById('selected-course').value;

  if (topicTitle && googleDocLink && selectedCourse) {
    if (editingIndex === -1) {
      topics.push({
        title: topicTitle,
        tag: topicTag,
        googleDocLink: googleDocLink,
        videoLink: videoLink,
        audioLink: audioLink,
        slideLink: slideLink,
        quizData: quizData,
        course: selectedCourse,
      });
    } else {
      topics[editingIndex].title = topicTitle;
      topics[editingIndex].tag = topicTag;
      topics[editingIndex].googleDocLink = googleDocLink;
      topics[editingIndex].videoLink = videoLink;
      topics[editingIndex].audioLink = audioLink;
      topics[editingIndex].slideLink = slideLink;
      topics[editingIndex].quizData = quizData;
    }
    saveTopics();
    renderTopicList();
    clearForm();
  } else {
    alert('Please fill in all required fields and select a course.');
  }
}

function startEditTopic(index) {
  editingIndex = index;
  const topic = topics[index];
  document.getElementById('topic-title').value = topic.title;
  document.getElementById('topic-tag').value = topic.tag;
  document.getElementById('google-doc-link').value = topic.googleDocLink;
  document.getElementById('video-link').value = topic.videoLink;
  document.getElementById('audio-link').value = topic.audioLink;
  document.getElementById('slide-link').value = topic.slideLink;
  document.getElementById('quiz-data').value = topic.quizData;

  document.getElementById('add-topic-button').style.display = 'none';
  document.getElementById('update-topic-button').style.display = 'inline-block';
  document.getElementById('cancel-edit-button').style.display = 'inline-block';
}

function cancelEdit() {
  editingIndex = -1;
  clearForm();
  document.getElementById('add-topic-button').style.display = 'inline-block';
  document.getElementById('update-topic-button').style.display = 'none';
  document.getElementById('cancel-edit-button').style.display = 'none';
}

function clearForm() {
  document.getElementById('topic-title').value = '';
  document.getElementById('google-doc-link').value = '';
  document.getElementById('video-link').value = '';
  document.getElementById('audio-link').value = '';
  document.getElementById('slide-link').value = '';
  document.getElementById('quiz-data').value = '';
  document.getElementById('search-topic').value = '';
}

function deleteTopic(index) {
  if (confirm('Are you sure you want to delete this topic?')) {
    topics.splice(index, 1);
    saveTopics();
    renderTopicList();
  }
}