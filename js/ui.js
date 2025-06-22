// ui.js
// Handles DOM rendering and event binding
import { TIMER_MODES, startTimer, pauseTimer, resetTimer, setMode, getTimer, setOnTick, setOnSessionEnd, autoStartNextSession } from './timer.js';
import { getTasks, addTask, updateTask, deleteTask, getTodayTasks, getUpcomingTasks, getCompletedTasks, getAllTasks, getTaskById } from './tasks.js';
import { getSettings, saveSettings } from './settings.js';

document.addEventListener('DOMContentLoaded', () => {
  // --- Pomodoro Timer UI Logic ---
  const timerDisplay = document.getElementById('timer-display');
  const startBtn = document.getElementById('start-timer');
  const pauseBtn = document.getElementById('pause-timer');
  const resetBtn = document.getElementById('reset-timer');
  const pomodoroCount = document.getElementById('pomodoro-count');
  const focusTab = document.querySelector('.focus-tab');
  const shortBreakTab = document.querySelector('.shortbreak-tab');
  const longBreakTab = document.querySelector('.longbreak-tab');

  function formatTime(seconds) {
    const m = String(Math.floor(seconds / 60)).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');
    return `${m}:${s}`;
  }

  function updateTimerUI() {
    const timer = getTimer();
    if (timerDisplay) timerDisplay.textContent = formatTime(timer.secondsLeft);
    // Show number of completed tasks
    if (pomodoroCount) {
      const completedTasks = getCompletedTasks();
      pomodoroCount.textContent = completedTasks.length;
    }
    if (startBtn) startBtn.disabled = timer.isRunning;
    if (pauseBtn) pauseBtn.disabled = !timer.isRunning;
  }

  setOnTick(updateTimerUI);
  updateTimerUI();

  if (startBtn) startBtn.addEventListener('click', () => {
    startTimer();
    updateTimerUI();
  });
  if (pauseBtn) pauseBtn.addEventListener('click', () => {
    pauseTimer();
    updateTimerUI();
  });
  if (resetBtn) resetBtn.addEventListener('click', () => {
    resetTimer();
    updateTimerUI();
  });

  if (focusTab) focusTab.addEventListener('click', () => {
    setMode('FOCUS');
    updateTimerUI();
    focusTab.classList.add('bg-blue-100', 'text-blue-700');
    shortBreakTab.classList.remove('bg-blue-100', 'text-blue-700');
    longBreakTab.classList.remove('bg-blue-100', 'text-blue-700');
  });
  if (shortBreakTab) shortBreakTab.addEventListener('click', () => {
    setMode('SHORT_BREAK');
    updateTimerUI();
    focusTab.classList.remove('bg-blue-100', 'text-blue-700');
    shortBreakTab.classList.add('bg-blue-100', 'text-blue-700');
    longBreakTab.classList.remove('bg-blue-100', 'text-blue-700');
  });
  if (longBreakTab) longBreakTab.addEventListener('click', () => {
    setMode('LONG_BREAK');
    updateTimerUI();
    focusTab.classList.remove('bg-blue-100', 'text-blue-700');
    shortBreakTab.classList.remove('bg-blue-100', 'text-blue-700');
    longBreakTab.classList.add('bg-blue-100', 'text-blue-700');
  });

  // --- Task List UI Logic ---
  const taskInput = document.getElementById('task-input');
  const taskList = document.getElementById('task-list');
  const sidebar = document.getElementById('sidebar');

  // Filter state
  let currentFilter = 'today';
  let activeTaskId = null;

  function renderTasks() {
    let tasks = [];
    if (currentFilter === 'today') tasks = getTodayTasks();
    else if (currentFilter === 'upcoming') tasks = getUpcomingTasks();
    else if (currentFilter === 'completed') tasks = getCompletedTasks();
    else tasks = getAllTasks();
    if (!taskList) return;
    taskList.innerHTML = '';
    if (tasks.length === 0) {
      const empty = document.createElement('li');
      empty.className = 'text-center text-gray-400 py-4';
      empty.textContent = 'No tasks yet.';
      taskList.appendChild(empty);
      // Ensure background for empty state in dark mode
      if (document.body.classList.contains('bg-gray-900')) {
        empty.classList.add('bg-gray-800', 'text-white');
        empty.classList.remove('bg-white', 'text-gray-900');
      } else {
        empty.classList.remove('bg-gray-800', 'text-white');
        empty.classList.add('bg-white', 'text-gray-900');
      }
      return;
    }
    tasks.forEach(task => {
      const li = document.createElement('li');
      li.className = 'flex items-center justify-between rounded shadow p-2';
      // Set background and text color based on theme
      if (document.body.classList.contains('bg-gray-900')) {
        li.classList.add('bg-gray-800', 'text-white');
        li.classList.remove('bg-white', 'text-gray-900');
      } else {
        li.classList.remove('bg-gray-800', 'text-white');
        li.classList.add('bg-white', 'text-gray-900');
      }
      if (activeTaskId === task.id) {
        li.classList.add('ring-2', 'ring-blue-400');
      }
      li.innerHTML = `
        <div class="flex items-center gap-2">
          <input type="checkbox" ${task.completed ? 'checked' : ''} data-id="${task.id}" class="task-complete">
          <span class="${task.completed ? 'line-through text-gray-400' : ''}">${task.name}</span>
          <span class="ml-2 text-red-500">🍅x${task.pomodoros || 1}</span>
          <span class="ml-2 text-xs text-gray-500">${task.deadline ? 'Due: ' + new Date(task.deadline).toLocaleDateString() : ''}</span>
        </div>
        <div class="flex gap-2">
          <button class="edit-task text-blue-500" data-id="${task.id}"><span class="material-icons">edit</span></button>
          <button class="delete-task text-red-500" data-id="${task.id}"><span class="material-icons">delete</span></button>
        </div>
      `;
      taskList.appendChild(li);
    });
  }

  // Add Task (with deadline)
  if (taskInput) {
    taskInput.addEventListener('keydown', e => {
      if (e.key === 'Enter' && taskInput.value.trim()) {
        const name = taskInput.value.trim();
        const deadline = prompt('Enter deadline (YYYY-MM-DD) or leave blank:');
        let deadlineISO = '';
        if (deadline) {
          const d = new Date(deadline);
          if (!isNaN(d.getTime())) deadlineISO = d.toISOString();
        }
        addTask({
          id: Date.now(),
          name,
          completed: false,
          pomodoros: 1,
          deadline: deadlineISO
        });
        taskInput.value = '';
        renderTasks();
      }
    });
  }

  // Task actions (complete, edit, delete)
  if (taskList) {
    taskList.addEventListener('click', e => {
      const target = e.target.closest('[data-id]');
      if (!target) return;
      const id = Number(target.dataset.id);
      if (e.target.closest('.delete-task')) {
        deleteTask(id);
        renderTasks();
      } else if (e.target.closest('.edit-task')) {
        const tasks = getAllTasks();
        const task = tasks.find(t => t.id === id);
        const newName = prompt('Edit task name:', task.name);
        const newDeadline = prompt('Edit deadline (YYYY-MM-DD):', task.deadline ? task.deadline.slice(0,10) : '');
        let deadlineISO = '';
        if (newDeadline) {
          const d = new Date(newDeadline);
          if (!isNaN(d.getTime())) deadlineISO = d.toISOString();
        }
        if (newName !== null && newName.trim()) {
          updateTask({ ...task, name: newName.trim(), deadline: deadlineISO });
          renderTasks();
        }
      } else if (e.target.classList.contains('task-complete')) {
        const tasks = getAllTasks();
        const task = tasks.find(t => t.id === id);
        updateTask({ ...task, completed: !task.completed });
        renderTasks();
      }
    });
  }

  // When a task is clicked, set as active
  if (taskList) {
    taskList.addEventListener('click', e => {
      const target = e.target.closest('[data-id]');
      if (!target) return;
      const id = Number(target.dataset.id);
      if (!e.target.classList.contains('edit-task') && !e.target.classList.contains('delete-task') && !e.target.classList.contains('task-complete')) {
        activeTaskId = id;
        renderTasks();
      }
    });
  }

  // --- Pomodoro session end logic ---
  setOnSessionEnd(() => {
    const settings = getSettings();
    // If a task is active, increment its pomodoros and mark complete if needed
    if (activeTaskId) {
      const task = getTaskById(activeTaskId);
      if (task) {
        // Increment completed pomodoros for this task
        task.pomodorosCompleted = (task.pomodorosCompleted || 0) + 1;
        // Mark as completed if reached estimated pomodoros
        if (task.pomodorosCompleted >= (task.pomodoros || 1)) {
          task.completed = true;
        }
        updateTask(task);
        renderTasks();
        updateTimerUI(); // Ensure session count updates in UI
      }
    }
    // Auto-start next session if enabled
    autoStartNextSession(settings);
  });

  // --- Sidebar UI Logic ---
  // Sidebar toggle (for mobile)
  const sidebarToggle = document.getElementById('sidebar-toggle');
  if (sidebarToggle) {
    sidebarToggle.addEventListener('click', () => {
      sidebar.classList.toggle('hidden');
    });
  }

  // Sidebar filter buttons
  if (sidebar) {
    sidebar.addEventListener('click', e => {
      const btn = e.target.closest('button');
      if (!btn) return;
      if (btn.textContent.includes('Today')) currentFilter = 'today';
      else if (btn.textContent.includes('Upcoming')) currentFilter = 'upcoming';
      else if (btn.textContent.includes('Completed')) currentFilter = 'completed';
      else if (btn.textContent.includes('All Tasks')) currentFilter = 'all';
      renderTasks();
    });
  }

  // + Add Task button (sidebar)
  const addTaskBtn = sidebar ? sidebar.querySelector('button.bg-blue-500') : null;
  if (addTaskBtn) {
    addTaskBtn.addEventListener('click', () => {
      const name = prompt('Task name:');
      if (!name || !name.trim()) return;
      const deadline = prompt('Enter deadline (YYYY-MM-DD) or leave blank:');
      let deadlineISO = '';
      if (deadline) {
        const d = new Date(deadline);
        if (!isNaN(d.getTime())) deadlineISO = d.toISOString();
      }
      addTask({
        id: Date.now(),
        name: name.trim(),
        completed: false,
        pomodoros: 1,
        deadline: deadlineISO
      });
      renderTasks();
    });
  }

  // --- Settings Panel Logic ---
  const darkToggle = document.getElementById('toggle-dark');
  const soundToggle = document.getElementById('toggle-sound');
  const autoStartToggle = document.getElementById('toggle-autostart');

  // Sound effect
  const clickAudio = new Audio('https://cdn.pixabay.com/audio/2022/10/16/audio_12b6b1b7b7.mp3'); // A clearer pop sound
  clickAudio.volume = 1.0;
  clickAudio.preload = 'auto';

  function playClickSound() {
    const settings = getSettings();
    if (settings.sound) {
      try {
        clickAudio.currentTime = 0;
        clickAudio.play();
      } catch (e) {
        // If play() fails, try creating a new Audio instance (for some browsers)
        const altAudio = new Audio('https://cdn.pixabay.com/audio/2022/10/16/audio_12b6b1b7b7.mp3');
        altAudio.volume = 1.0;
        altAudio.play();
      }
    }
  }

  // Add sound to all main buttons
  [startBtn, pauseBtn, resetBtn, focusTab, shortBreakTab, longBreakTab].forEach(btn => {
    if (btn) btn.addEventListener('click', playClickSound);
  });

  function applySettings() {
    const settings = getSettings();
    if (darkToggle) darkToggle.checked = !!settings.dark;
    if (soundToggle) soundToggle.checked = !!settings.sound;
    if (autoStartToggle) autoStartToggle.checked = !!settings.autoStart;
    // Apply dark theme
    if (settings.dark) {
      document.body.classList.add('bg-gray-900', 'text-white');
      document.body.classList.remove('bg-gray-100', 'text-gray-900');
      document.querySelectorAll('aside, main, section').forEach(el => {
        el.classList.add('bg-gray-800', 'text-white');
        el.classList.remove('bg-white', 'bg-gray-50', 'text-gray-900');
      });
      document.querySelectorAll('input, textarea').forEach(el => {
        el.classList.add('bg-gray-700', 'text-white', 'placeholder-gray-300');
        el.classList.remove('bg-white', 'text-gray-900', 'placeholder-gray-400');
      });
      // Timer display: dark background, white font
      const timerDisplay = document.getElementById('timer-display');
      if (timerDisplay) {
        timerDisplay.classList.add('bg-gray-900', 'text-white', 'border-gray-600');
        timerDisplay.classList.remove('bg-white', 'text-black', 'border-blue-400');
      }
      // Task list items: dark background, white font
      document.querySelectorAll('#task-list li').forEach(li => {
        li.classList.add('bg-gray-800', 'text-white');
        li.classList.remove('bg-white', 'text-gray-900');
      });
    } else {
      document.body.classList.remove('bg-gray-900', 'text-white');
      document.body.classList.add('bg-gray-100', 'text-gray-900');
      document.querySelectorAll('aside, main, section').forEach(el => {
        el.classList.remove('bg-gray-800', 'text-white');
        el.classList.add('bg-white');
        el.classList.add('text-gray-900');
        el.classList.remove('bg-gray-50');
      });
      document.querySelectorAll('input, textarea').forEach(el => {
        el.classList.remove('bg-gray-700', 'text-white', 'placeholder-gray-300');
        el.classList.add('bg-white', 'text-gray-900', 'placeholder-gray-400');
      });
      // Timer display: light background, black font
      const timerDisplay = document.getElementById('timer-display');
      if (timerDisplay) {
        timerDisplay.classList.remove('bg-gray-900', 'text-white', 'border-gray-600');
        timerDisplay.classList.add('bg-white', 'text-black', 'border-blue-400');
      }
      // Task list items: light background, dark font
      document.querySelectorAll('#task-list li').forEach(li => {
        li.classList.remove('bg-gray-800', 'text-white');
        li.classList.add('bg-white', 'text-gray-900');
      });
    }
  }

  // Sidebar filter buttons hover color fix for dark mode
  function updateSidebarButtonHover() {
    const sidebarButtons = sidebar ? sidebar.querySelectorAll('nav button') : [];
    sidebarButtons.forEach(btn => {
      btn.classList.remove('hover:bg-gray-100', 'hover:bg-gray-700');
      if (document.body.classList.contains('bg-gray-900')) {
        btn.classList.add('hover:bg-gray-700');
        btn.classList.remove('hover:bg-gray-100');
      } else {
        btn.classList.add('hover:bg-gray-100');
        btn.classList.remove('hover:bg-gray-700');
      }
    });
  }

  if (darkToggle) darkToggle.addEventListener('change', () => {
    const settings = getSettings();
    settings.dark = darkToggle.checked;
    saveSettings(settings);
    applySettings();
  });
  if (soundToggle) soundToggle.addEventListener('change', () => {
    const settings = getSettings();
    settings.sound = soundToggle.checked;
    saveSettings(settings);
  });
  if (autoStartToggle) autoStartToggle.addEventListener('change', () => {
    const settings = getSettings();
    settings.autoStart = autoStartToggle.checked;
    saveSettings(settings);
  });

  // --- Session Control Buttons ---
  const startSessionBtn = document.getElementById('start-session');
  const completeSessionBtn = document.getElementById('complete-session');
  const endSessionBtn = document.getElementById('end-session');

  if (startSessionBtn) {
    startSessionBtn.addEventListener('click', () => {
      startTimer();
      updateTimerUI();
    });
  }

  if (completeSessionBtn) {
    completeSessionBtn.addEventListener('click', () => {
      pauseTimer();
      // Record session as completed for active task
      if (activeTaskId) {
        const task = getTaskById(activeTaskId);
        if (task) {
          // Increment both pomodorosCompleted and sessionCount
          task.pomodorosCompleted = (task.pomodorosCompleted || 0) + 1;
          if (typeof window !== 'undefined' && window.TIMER_MODES) {
            // If timer.js is in global scope, increment global session count
            window.TIMER_MODES.sessionCount = (window.TIMER_MODES.sessionCount || 0) + 1;
          }
        }
      }
    });
  }

  if (endSessionBtn) {
    endSessionBtn.addEventListener('click', () => {
      // Just pause the timer and don't record the session
      pauseTimer();
    });
  }

  // --- Initial Settings Application ---
  applySettings();
  renderTasks();
});