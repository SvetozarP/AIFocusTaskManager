# Pomodoro Focus To-Do Manager – GitHub Copilot Prompt

## 🧠 Role
You are a **very experienced front-end developer**. Build a **Pomodoro Focus To-Do Manager** web application using **only vanilla JavaScript, HTML, and Tailwind CSS** (no frameworks like React). The design must closely follow this reference screenshot:

📷 [Focus To-Do App Screenshot](https://windows-cdn.softpedia.com/screenshots/Focus-To-Do-Pomodoro-Timer-To-Do-List_1.png)

Use modern JavaScript (ES6+) best practices and modular architecture where possible.

---

## 🎯 Objective
Create a **fully functional and visually similar** version of the Focus To-Do app, implementing its **Pomodoro timer + task management features** based on the official app's feature list:  
🔗 https://www.focustodo.cn/#features

---

## 📦 Tech Stack

- **HTML5**
- **Vanilla JavaScript (ES6+)**
- **Tailwind CSS** for all styling
- **localStorage** for data persistence

Do **not** use any frameworks or libraries like React, Vue, Angular, or jQuery.

---

## 🖼️ Layout & Design Requirements

Match the screenshot design as closely as possible using Tailwind:

### 🔲 Sidebar (Left)
- Navigation list:  
  - **Today**, **Upcoming**, **All Tasks**, **Completed**
- “Add Task” button
- Optional: Sections for **Projects** (folders with colored icons)

### 🕒 Main Panel (Center)
- **Pomodoro Timer**
  - Large circular countdown
  - Controls: Start / Pause / Reset
  - Tabs: Focus / Short Break / Long Break
  - Session counter (e.g., 🍅 x3)
- **Task List**
  - Task item with:
    - Checkbox
    - Task name
    - Estimated Pomodoros (e.g., 🍅x2)
    - Edit/Delete icons
  - Active task highlights under timer

---

## ✅ Features to Implement

### ⏱ Pomodoro Timer Logic
- Timer modes:
  - Focus: 25 min (default)
  - Short Break: 5 min
  - Long Break: 15 min
- Auto-cycle:
  - After 4 Pomodoros → Long Break
  - Between Pomodoros → Short Break
- Auto-start toggle for sessions and breaks
- Circular progress animation (CSS or canvas)
- Play sound/vibrate on session complete

### 📋 Task Manager
- Add/edit/delete task
- Mark task as completed
- Set estimated Pomodoros (1–5 tomatoes)
- Highlight active task
- Filter by Today / Upcoming / All / Completed
- Save tasks in `localStorage`

### ⚙️ Settings Panel
- Toggle: Light/Dark theme
- Toggle: Sound on/off
- Toggle: Auto-start sessions
- Optional: Language dropdown for i18n structure

---

## 📁 File Structure

Use modular JS and separate files for maintainability:

/index.html
/css/tailwind.css
/js/
timer.js
tasks.js
storage.js
ui.js
settings.js

All files must:
- Be readable and maintainable
- Use semantic HTML elements
- Use Tailwind classes for layout and components
- Keep all app data in `localStorage`

---

## 🧩 Bonus (Optional)
- Desktop notifications when timer ends
- Drag-and-drop task sorting
- Animated transitions (e.g., Tailwind with `transition` + JS)

---

## 📌 Deliverables
- A complete front-end project in HTML, JS, and Tailwind CSS
- Pixel-accurate layout and interactive UX based on the screenshot
- No external frameworks or component libraries used