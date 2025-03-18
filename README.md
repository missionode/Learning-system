# Learning-system

# Learning App

This is a simple learning application built with HTML, CSS, and JavaScript, designed to help users track their learning progress.

## Features

* **User Profiles:** Users can create profiles with their name, nickname, and upload a JSON database file containing learning topics.
* **Dashboard:** Displays an overview of the user's progress, including topics they excel in and topics they need to focus on.
* **Journey:** Allows users to view and start learning topics.
* **Topic Pages:** Each topic has a dedicated page with content and a "Complete" button.
* **Track Progress:** Provides a detailed view of the user's progress, showing the completion status of each topic.
* **Responsive Navigation:** Includes a top navigation bar with a hamburger menu for smaller screens and a bottom navigation bar for easy navigation.
* **Charts:** Displays charts for quiz performance and completed topics.

## Getting Started

1.  **Clone the Repository:**
    ```bash
    git clone <repository_url>
    ```
2.  **Open `index.html`:** Open the `index.html` file in your web browser.
3.  **Create a Profile:** Fill in the profile information and upload a JSON database file.
4.  **Explore the App:** Use the navigation to explore the different features of the application.

## JSON Database Format

The JSON database file should have the following structure:

```json
{
  "courses": [
    {
      "title": "Course Title"
    }
  ],
  "topics": [
    {
      "title": "Topic Title",
      "tag": "Topic Tag",
      "googleDocLink": "Google Doc Link",
      "videoLink": "Video Link",
      "audioLink": "Audio Link",
      "slideLink": "Slide Link",
      "quizData": "CSV formatted quiz data",
      "course": "Course Title"
    },
    // ... more topics
  ]
}