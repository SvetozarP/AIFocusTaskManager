# AI Focus Task Manager

A Pomodoro Focus To-Do Manager built with Vanilla JS, Tailwind CSS, and localStorage, served by a Node.js/Express backend.

## Features
- Pomodoro timer with Focus, Short Break, and Long Break modes
- Task management: add, edit, delete, complete tasks
- Session (pomodoro) tracking per task
- Task deadlines and filtering (Today, Upcoming, Completed, All)
- LocalStorage persistence (no account required)
- Responsive UI with Tailwind CSS
- Dark mode and sound toggle
- Express server for static file serving

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v14 or newer recommended)

### Installation
1. Clone the repository or download the source code.
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the server:
   ```sh
   npm start
   ```
4. Open your browser and go to [http://localhost:3000](http://localhost:3000)

## Project Structure
```
AIFocusTaskManager/
├── css/
│   └── tailwind.css
├── js/
│   ├── settings.js
│   ├── storage.js
│   ├── tasks.js
│   ├── timer.js
│   └── ui.js
├── index.html
├── package.json
├── server.js
└── README.md
```

## Scripts
- `npm start` — Starts the Express server on port 3000 (or `PORT` env variable)

## Customization
- **Timer durations and settings** can be adjusted in the UI settings panel.
- **Theme and sound** can be toggled in the UI.

## License
This project is licensed under the MIT License.

---

*Created for educational purposes as part of the AI for Developers course at SoftUni.*
