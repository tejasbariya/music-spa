# Music SPA - Full Stack Transformation

This project is a modern Single Page Application (SPA) built to stream, upload, and search for music. It was migrated from a static AngularJS website into a full-stack application featuring a customized **Dark Glassmorphism** user interface.

## 🚀 Features

*   **Dark Glassmorphism UI**: A sleek, modern user interface utilizing custom CSS, frosted glass overlays, and vibrant accent colors.
*   **Authentication**: Secure user registration and login using JSON Web Tokens (JWT) and Bcrypt password hashing.
*   **Local Backend & DB**: Powered by Node.js and Express, with a lightweight SQLite database (`database.sqlite`) to store user profiles, song metadata, and playlists.
*   **MP3 Uploads**: Users can upload `.mp3` files through the browser. Files are stored on the server using `multer` and served dynamically.
*   **iTunes Search Integration**: Search for any song or artist in the world using the live iTunes API and listen to real audio previews directly from the Home dashboard.
*   **Music Player**: A custom-built media player to stream your uploaded local library. Includes automatic ID3 tag extraction for album artwork previews.

## 📁 Project Structure

The project follows a standard separation of frontend and backend concerns:

```
├── public/                 # Frontend SPA (Client-side)
│   ├── index.html          # Main Entry File
│   ├── js/                 # AngularJS Application Logic
│   │   ├── app.js          # Core Controllers (Home, Upload)
│   │   ├── auth.js         # Authentication logic & JWT routing
│   │   ├── player.js       # Music Player Controller
│   │   └── routes.js       # UI Routing Engine
│   ├── pages/              # HTML Partials (Home, Login, Player, etc.)
│   ├── styles/             # CSS (theme.css contains the Glassmorphism logic)
│   └── imgs/               # Static Images
├── server/                 # Backend API (Node.js/Express)
│   ├── server.js           # Main Express Server
│   ├── db.js               # SQLite Database Initialization
│   └── routes/             # API Endpoints (auth.js, songs.js)
├── songs/                  # Storage directory for uploaded .mp3 files
├── database.sqlite         # Local SQLite DB File
└── package.json            # Node.js dependencies and scripts
```

## 🛠️ Installation & Setup

1.  **Prerequisites**: Make sure you have [Node.js](https://nodejs.org/) installed on your machine.
2.  **Install Dependencies**: Navigate to the project root directory in your terminal and run install:
    ```bash
    npm install
    ```
3.  **Start the Server**: 
    ```bash
    npm start
    ```
    *This will boot up the Node.js server on port 3000.*
4.  **View the App**: Open your web browser and navigate to:
    ```
    http://localhost:3000
    ```

## 🧪 Testing the Flow
1. Open the app (`http://localhost:3000`). You will be redirected to the **Login** screen since Route Guards are enabled.
2. Click **Register** and create a new account.
3. Once registered and logged in, you will land on the **Home Dashboard**.
4. Use the search bar to query the iTunes API and play previews.
5. Navigate to the **Upload** page, select an MP3 file from your computer, and upload it to the local server.
6. Navigate to the **Player** page to listen to your newly uploaded song. 

## 📝 Technologies Used
*   **Frontend**: AngularJS (1.8.x), HTML5 Audio, Vanilla CSS
*   **Backend**: Node.js, Express.js
*   **Database**: SQLite3
*   **Libraries**: `jsmediatags` (Frontend ID3 extraction), `bcrypt` & `jsonwebtoken` (Auth), `multer` (File handling)
