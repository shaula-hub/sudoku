// Update src/components/Settings/SettingsModal.jsx
import React, { useState } from "react";
import { useGame } from "../../context/GameContext";
import {
  DIFFICULTY_COLORS,
  DIFFICULTY_RANGES,
} from "../../config/difficultySettings";
import "./styles.css";

function SettingsModal({ onClose, currentDifficulty }) {
  const { dispatch } = useGame();

  // Build difficulty ranges with colors from centralized config
  const difficultyRanges = {};
  Object.keys(DIFFICULTY_RANGES).forEach((key) => {
    difficultyRanges[key] = {
      ...DIFFICULTY_RANGES[key],
      color: DIFFICULTY_COLORS[key],
    };
  });

  // Get default cells to remove based on current difficulty
  const getDefaultCellsToRemove = () => {
    const range =
      difficultyRanges[currentDifficulty] || difficultyRanges.beginner;
    return Math.floor((range.min + range.max) / 2); // Middle of the range
  };

  // Load saved settings or use defaults
  const loadSavedSettings = () => {
    const savedSettings = localStorage.getItem("sudokuSettings");
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      return {
        cellsToRemove: parsed.cellsToRemove || getDefaultCellsToRemove(),
        hints: parsed.hints || {
          areaHighlight: false,
          technique: false,
          candidate: false,
        },
      };
    }
    return {
      cellsToRemove: getDefaultCellsToRemove(),
      hints: {
        areaHighlight: false,
        technique: false,
        candidate: false,
      },
    };
  };

  const [settings, setSettings] = useState(loadSavedSettings);

  // Determine current difficulty level based on cells to remove
  const getCurrentDifficultyInfo = () => {
    for (const [key, range] of Object.entries(difficultyRanges)) {
      if (
        settings.cellsToRemove >= range.min &&
        settings.cellsToRemove <= range.max
      ) {
        return { level: key, ...range };
      }
    }
    // If not in any range, find the closest one
    const closest = Object.entries(difficultyRanges).reduce(
      (prev, [key, range]) => {
        const prevDistance = Math.min(
          Math.abs(settings.cellsToRemove - prev[1].min),
          Math.abs(settings.cellsToRemove - prev[1].max)
        );
        const currentDistance = Math.min(
          Math.abs(settings.cellsToRemove - range.min),
          Math.abs(settings.cellsToRemove - range.max)
        );
        return currentDistance < prevDistance ? [key, range] : prev;
      }
    );
    return { level: closest[0], ...closest[1] };
  };

  const currentDifficultyInfo = getCurrentDifficultyInfo();

  // Update cells to remove when slider changes
  const handleSliderChange = (event) => {
    const cellsToRemove = Math.min(
      81,
      Math.max(5, parseInt(event.target.value))
    );
    setSettings({ ...settings, cellsToRemove });
  };

  const handleHintChange = (hintType) => {
    setSettings({
      ...settings,
      hints: {
        ...settings.hints,
        [hintType]: !settings.hints[hintType],
      },
    });
  };

  // Save settings and start new game
  const handleSaveSettings = () => {
    const settingsToSave = {
      cellsToRemove: settings.cellsToRemove,
      difficulty: currentDifficultyInfo.level,
      hints: settings.hints,
    };

    localStorage.setItem("sudokuSettings", JSON.stringify(settingsToSave));

    // Update game context with hint settings
    dispatch({ type: "UPDATE_HINTS", hints: settings.hints });

    // Force refresh the game with the exact settings
    dispatch({
      type: "REFRESH_GAME",
      difficulty: currentDifficultyInfo.level,
      cellsToRemove: settings.cellsToRemove,
    });

    // Close modal after a short delay to ensure game updates
    setTimeout(() => {
      onClose();
    }, 100);
  };

  // Get remaining cells count
  const remainingCells = 81 - settings.cellsToRemove;

  return (
    <div className="modal-overlay">
      <div className="settings-modal">
        <div
          className="modal-container"
          style={{ "background-color": "#E3C5FF" }}
        >
          <div className="modal-header">
            <h2>Настройки</h2>
            <button className="close-button" onClick={onClose}>
              &times;
            </button>
          </div>

          <div className="settings-section">
            <h3>Выберите уровень сложности двигая бегунок</h3>

            <div className="difficulty-slider-container">
              <div className="difficulty-info">
                <span
                  className="difficulty-level"
                  style={{
                    color: currentDifficultyInfo.color,
                    fontWeight: "bold",
                    fontSize: "1.65rem",
                  }}
                >
                  {currentDifficultyInfo.label}
                </span>
                <span className="cells-info">
                  Ячеек: скрытых {settings.cellsToRemove}, оставшихся{" "}
                  {remainingCells}
                </span>
              </div>

              <div className="slider-container">
                <label htmlFor="difficulty-slider">
                  Скрытых ячеек (min: 5, max: 61):
                </label>

                <div className="slider-wrapper">
                  <div className="slider-track-wrapper">
                    <div
                      className="slider-progress"
                      style={{
                        "--slider-color": currentDifficultyInfo.color,
                        "--slider-progress": `${
                          ((settings.cellsToRemove - 5) / (61 - 5)) * 100
                        }%`,
                      }}
                    ></div>
                    <input
                      id="difficulty-slider"
                      type="range"
                      min="5"
                      max="61"
                      value={settings.cellsToRemove}
                      onChange={handleSliderChange}
                      className="difficulty-slider"
                      style={{
                        "--slider-color": currentDifficultyInfo.color,
                      }}
                    />
                  </div>

                  <div
                    className="slider-value"
                    style={{ backgroundColor: currentDifficultyInfo.color }}
                  >
                    {settings.cellsToRemove}
                  </div>
                </div>
              </div>

              <div className="difficulty-ranges">
                {Object.entries(difficultyRanges).map(([key, range]) => (
                  <div
                    key={key}
                    className={`range-indicator ${
                      currentDifficultyInfo.level === key ? "active" : ""
                    }`}
                    style={{ "--range-color": range.color }}
                  >
                    <span className="range-label">{range.label}</span>
                    <span className="range-values">
                      {range.min}-{range.max}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="settings-section">
            <h3>Подсказки (вызываются при долгом нажатии):</h3>
            <div className="hint-options">
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  checked={settings.hints.areaHighlight}
                  onChange={() => handleHintChange("areaHighlight")}
                />
                <span className="checkbox-label">Подсветка областей</span>
              </label>

              <label className="checkbox-container">
                <input
                  type="checkbox"
                  checked={settings.hints.technique}
                  onChange={() => handleHintChange("technique")}
                />
                <span className="checkbox-label">Подсказка техники поиска</span>
              </label>

              <label className="checkbox-container">
                <input
                  type="checkbox"
                  checked={settings.hints.candidate}
                  onChange={() => handleHintChange("candidate")}
                />
                <span className="checkbox-label">
                  Показ возможных кандидатов
                </span>
              </label>
            </div>
          </div>

          <div className="modal-footer">
            <button className="save-button" onClick={handleSaveSettings}>
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsModal;
