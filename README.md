# Chatzap

This project is a chat application built with [React](https://react.dev/) and [Firebase](https://firebase.google.com/).

Hosted on: https://chatzap.netlify.app/{target="_blank"}
## Features

* User Authentication: Secure login and registration functionalities using Firebase Authentication.
* Protected Routes: Ensures that only authenticated users can access certain pages.
* Real-time Chat: Allows users to send and receive messages in real-time.
* Image and Emoji Support: Users can send images and use emojis in their messages.
* Responsive Design: The application is styled with SCSS for a modern and responsive user interface.
* Loading Screen: Displays a loading screen while the application initializes.
* User Search: Enables users to search for other users and start new chats.

## Technologies Used

* React: For building the user interface.
* Firebase: For backend services including Firestore, Authentication, and Storage.
* React Router: For handling navigation and protected routes.
* SCSS: For styling the application.
* Emoji Picker: For selecting emojis in messages.
* Date-fns: For formatting dates and times.
* Lodash.debounce: For optimizing search input handling.

# Getting Started

## Clone the repository:
``` 
git clone https://github.com/zap3420/chatzap.git
cd chatzap
```
## Install the dependencies:
```
npm install
```
## Create a .env file in the root directory and add your Firebase configuration:
```
REACT_APP_API_KEY=your_api_key
REACT_APP_AUTH_DOMAIN=your_auth_domain
REACT_APP_PROJECT_ID=your_project_id
REACT_APP_STORAGE_BUCKET=your_storage_bucket
REACT_APP_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_APP_ID=your_app_id
```
## Start the development server:
```
npm start
```
Open http://localhost:3000 to view it in your browser.

## License
This project is licensed under the MIT License.

