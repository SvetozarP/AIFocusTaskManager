// settings.js
// Handles app settings (theme, sound, auto-start, etc.)

const SETTINGS_KEY = 'focus_settings';

export function getSettings() {
  return JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}');
}

export function saveSettings(settings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}
