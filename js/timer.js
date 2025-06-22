// timer.js
// Handles Pomodoro timer logic and state

export const TIMER_MODES = {
  FOCUS: { label: 'Focus', duration: 25 * 60 },
  SHORT_BREAK: { label: 'Short Break', duration: 5 * 60 },
  LONG_BREAK: { label: 'Long Break', duration: 15 * 60 }
};

let timer = {
  mode: 'FOCUS',
  secondsLeft: TIMER_MODES.FOCUS.duration,
  isRunning: false,
  intervalId: null,
  pomodorosCompleted: 0,
  autoStart: false,
  onTick: null,
  onSessionEnd: null,
  sessionCount: 0,
  breakCount: 0
};

export function startTimer() {
  if (timer.isRunning) return;
  timer.isRunning = true;
  timer.intervalId = setInterval(() => {
    if (timer.secondsLeft > 0) {
      timer.secondsLeft--;
      timer.onTick && timer.onTick(timer);
    } else {
      clearInterval(timer.intervalId);
      timer.isRunning = false;
      if (timer.mode === 'FOCUS') {
        timer.pomodorosCompleted++;
        timer.sessionCount++;
      } else {
        timer.breakCount++;
      }
      timer.onSessionEnd && timer.onSessionEnd(timer);
    }
  }, 1000);
}

export function pauseTimer() {
  if (timer.intervalId) clearInterval(timer.intervalId);
  timer.isRunning = false;
}

export function autoStartNextSession(settings) {
  // Auto-switch between focus and breaks
  if (timer.mode === 'FOCUS') {
    if (timer.sessionCount % 4 === 0) {
      setMode('LONG_BREAK');
    } else {
      setMode('SHORT_BREAK');
    }
  } else {
    setMode('FOCUS');
  }
  resetTimer();
  if (settings && settings.autoStart) {
    startTimer();
  }
}

export function resetTimer() {
  pauseTimer();
  timer.secondsLeft = TIMER_MODES[timer.mode].duration;
}

export function setMode(mode) {
  pauseTimer();
  timer.mode = mode;
  timer.secondsLeft = TIMER_MODES[mode].duration;
}

export function getTimer() {
  return { ...timer };
}

export function setOnTick(callback) {
  timer.onTick = callback;
}

export function setOnSessionEnd(callback) {
  timer.onSessionEnd = callback;
}
