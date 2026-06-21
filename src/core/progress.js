const STORAGE_KEY = 'game_progress';

export function getSavedProgress() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || { completedLevels: [] };
  } catch {
    return { completedLevels: [] };
  }
}

export function saveProgress(levelIndex) {
  const progress = getSavedProgress();
  if (!progress.completedLevels.includes(levelIndex)) {
    progress.completedLevels.push(levelIndex);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function isLevelUnlocked(index) {
  const progress = getSavedProgress();
  return index === 0 || progress.completedLevels.includes(index - 1);
}

export function isLevelCompleted(index) {
  const progress = getSavedProgress();
  return progress.completedLevels.includes(index);
}