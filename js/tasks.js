// tasks.js
// Handles task CRUD and Pomodoro association

const TASKS_KEY = 'focus_tasks';

export function getTasks() {
  return JSON.parse(localStorage.getItem(TASKS_KEY) || '[]');
}

export function saveTasks(tasks) {
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
}

export function addTask(task) {
  const tasks = getTasks();
  tasks.push(task);
  saveTasks(tasks);
}

export function updateTask(updatedTask) {
  const tasks = getTasks().map(t => t.id === updatedTask.id ? updatedTask : t);
  saveTasks(tasks);
}

export function deleteTask(id) {
  const tasks = getTasks().filter(t => t.id !== id);
  saveTasks(tasks);
}

export function getTaskById(id) {
  return getTasks().find(t => t.id === id);
}

// New: Filter helpers
export function getTodayTasks() {
  const today = new Date();
  today.setHours(0,0,0,0);
  return getTasks().filter(t => t.deadline && new Date(t.deadline).setHours(0,0,0,0) === today.getTime() && !t.completed);
}

export function getUpcomingTasks() {
  const today = new Date();
  today.setHours(0,0,0,0);
  return getTasks().filter(t => t.deadline && new Date(t.deadline).setHours(0,0,0,0) > today.getTime() && !t.completed);
}

export function getCompletedTasks() {
  return getTasks().filter(t => t.completed);
}

export function getAllTasks() {
  return getTasks();
}
