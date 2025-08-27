
Built by https://www.blackbox.ai

---

# TikTok Downloader Competitor

## Project Overview

The **TikTok Downloader Competitor** is a modern application designed to facilitate the downloading of TikTok videos without watermarks. It provides users with a simple and efficient solution to save their favorite TikTok content while maintaining original quality. 

## Installation

To get started with the project, clone the repository and install the dependencies. Follow these steps:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/YourUsername/tiktok-downloader-competitor.git
   cd tiktok-downloader-competitor
   ```

2. **Install the dependencies:**
   ```bash
   npm install
   ```

3. **Create a `.env` file:**
   Create a `.env` file in the root folder of the project and set the required environment variables. You can refer to the project's example to structure it. For instance:
   ```plaintext
   PORT=8000
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   ```

## Usage

To start the server, you have two options depending on whether you want to run it in development mode or production mode.

- **For production:**
   ```bash
   npm start
   ```

- **For development:**
   ```bash
   npm run dev
   ```

Now, you should see a message in your terminal indicating that the server is running:

```
🚀 TikTok Downloader server running on port 8000
📱 Access the app at: http://localhost:8000
```

Navigate to the URL in your web browser to access the application.

## Features

- **Download TikTok Videos:** Easily download videos without watermarks.
- **Rate Limiting:** Protects the application from excessive requests.
- **CORS Support:** Allows your app to interact with different domains securely.
- **Security Enhancements:** Utilizes Helmet to secure HTTP headers.
- **Static File Serving:** Serves static files efficiently from the `public` directory.
- **Error Handling:** Comprehensive error handling mechanism in place.

## Dependencies

This project uses the following dependencies, as listed in the `package.json` file:

- `express`: Web framework for building web applications.
- `dotenv`: Module for loading environment variables from a `.env` file.
- `axios`: Promise-based HTTP client for the browser and Node.js.
- `cors`: Middleware to enable Cross-Origin Resource Sharing.
- `helmet`: Security middleware for setting various HTTP headers.
- `express-rate-limit`: Middleware for limiting repeated requests from the same IP address.

### Development Dependencies

- `nodemon`: A utility that monitors for changes in your source code and automatically restarts your server.

## Project Structure

The project has the following structure:

```
tiktok-downloader-competitor/
│
├── public/                # Directory for static files (HTML, CSS, JS)
│   └── index.html         # Main HTML file
│
├── routes/                # Directory for handling routes
│   └── api.js             # API routes for the application
│
├── middlewares/           # Custom middleware for error handling
│   └── errorHandler.js    # Error handling middleware
│
├── .env                   # Environment configuration
├── package.json           # Project metadata and dependencies
├── package-lock.json      # Exact version mapping for dependencies
└── server.js              # Main application file
```

Feel free to customize and enhance the functionality as per your needs! For any issues, please report via the project's repository.