// src/config/difficultySettings.js
export const DIFFICULTY_COLORS = {
  child: "#F3CD08", // Yellow
  beginner: "#F5A007", // Orange
  easy: "#4CAF50", // Green
  medium: "#00BFFF", // Deep Sky Blue
  hard: "#0000FF", // Blue #0047AB
  expert: "#e51247", // Red
  master: "#8a2be2", // Purple
};

export const DIFFICULTY_RANGES = {
  child: { min: 5, max: 19, label: "Детсад" },
  beginner: { min: 20, max: 29, label: "Начинающий" },
  easy: { min: 30, max: 39, label: "Халявщик" },
  medium: { min: 40, max: 49, label: "Середняк" },
  hard: { min: 50, max: 56, label: "Профи" },
  expert: { min: 57, max: 59, label: "Эксперт" },
  master: { min: 60, max: 61, label: "Мастер" },
};

export const getDifficultyColor = (difficulty, fallback = "beginner") => {
  return DIFFICULTY_COLORS[difficulty] || DIFFICULTY_COLORS[fallback];
};

export const getDifficultyRange = (difficulty, fallback = "beginner") => {
  return DIFFICULTY_RANGES[difficulty] || DIFFICULTY_RANGES[fallback];
};
