// storage.js
// Handles generic localStorage helpers

export function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function load(key, defaultValue = null) {
  const val = localStorage.getItem(key);
  return val ? JSON.parse(val) : defaultValue;
}
