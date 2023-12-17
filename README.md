# Theater

This project is a web application created to reduce dependency on YouTube. It allows you to download YouTube videos and play them locally. The frontend is built using React and TypeScript, while the backend uses Express.js. It is designed for local computer operations.

## Key Features

- Downloading YouTube videos
- Remote video playback
- Video list management
- Providing video metadata

## Project Setup

1. Clone this repository.
2. Run `npm install` in the client and server directories.
3. Run `npm run build` in the client directory to build the frontend.
4. Run `ts-node index.ts` in the server directory to start the backend.
5. Ensure that yt-dlp has been installed.

## Project Configuration

The project mainly consists of two directories: `client` and `server`. The `client` directory contains the frontend code, and the `server` directory contains the backend code.

## Frontend

The frontend is built using React and TypeScript. Tailwind CSS is used for styling. There is a user interface where users can enter YouTube video IDs and start the download. The `video-react` library is used for video playback.

## Backend

The backend is built using Express.js. It provides functionality to download YouTube videos, manage videos, and provide video metadata.
