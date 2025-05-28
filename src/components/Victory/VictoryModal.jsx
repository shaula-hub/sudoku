// src/components/Victory/VictoryModal.jsx
import React from "react";
import Confetti from "react-confetti";
import { useGame } from "../../context/GameContext";
import "../../styles/animations.css";

function VictoryModal() {
  const { dispatch } = useGame();
  const [windowSize, setWindowSize] = React.useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // Update window size if resized
  React.useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const startNewGame = () => {
    dispatch({ type: "NEW_GAME" });
  };

  return (
    <>
      <Confetti
        width={windowSize.width}
        height={windowSize.height}
        recycle={false}
        numberOfPieces={500}
      />

      <div className="victory-overlay">
        <div className="victory-message">
          <h2>🎉 Судоку завершён! 🎉</h2>
          <p>Подравляем! Вы успешно заполнили Судоку!</p>
          <button className="victory-button" onClick={startNewGame}>
            Играть снова
          </button>
        </div>
      </div>
    </>
  );
}

export default VictoryModal;
