import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/notfound.css';

const NotFoundPage = () => {
  const navigate = useNavigate();
  const [diceNumber, setDiceNumber] = useState<number>(Math.floor(Math.random() * 20) + 1);
  const [isRolling, setIsRolling] = useState(true);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (!isRolling) return;

    // Número de iteraciones antes de parar en 1
    const totalIterations = 15 + Math.floor(Math.random() * 10);
    let currentIteration = 0;

    const rollInterval = setInterval(() => {
      currentIteration++;
      
      if (currentIteration >= totalIterations) {
        // Última iteración: mostrar el 1
        setDiceNumber(1);
        setIsRolling(false);
        clearInterval(rollInterval);
        
        // Mostrar el contenido después de un pequeño delay
        setTimeout(() => setShowContent(true), 500);
      } else {
        // Números aleatorios del 1 al 20
        setDiceNumber(Math.floor(Math.random() * 20) + 1);
      }
    }, 100 + currentIteration * 5); // Va más lento gradualmente

    return () => clearInterval(rollInterval);
  }, [isRolling]);

  return (
    <div className="notfound-page">
      <div className="notfound-container">
        <div className="dice-container">
          <div className={`d20 ${isRolling ? 'rolling' : 'landed'}`}>
            <span className="dice-number">{diceNumber}</span>
          </div>
          <div className="dice-shadow"></div>
        </div>

        <div className={`notfound-content ${showContent ? 'visible' : 'hidden'}`}>
          <h1 className="notfound-title">¡Pifia Crítica!</h1>
          <p className="notfound-code">Error 404</p>
          <p className="notfound-message">
            Has sacado un <strong>1 natural</strong> en tu tirada de Navegación.
          </p>
          <p className="notfound-flavor">
            "El aventurero tropieza con sus propios pies y cae de bruces en un callejón sin salida. 
            La página que buscas no existe en este reino."
          </p>
          
          <div className="notfound-stats">
            <div className="stat-block">
              <span className="stat-label">Tirada</span>
              <span className="stat-value">1</span>
            </div>
            <div className="stat-block">
              <span className="stat-label">CD requerida</span>
              <span className="stat-value">10</span>
            </div>
            <div className="stat-block">
              <span className="stat-label">Resultado</span>
              <span className="stat-value fail">FALLO</span>
            </div>
          </div>

          <div className="notfound-actions">
            <button className="btn-primary" onClick={() => navigate('/inicio')}>
              🏠 Volver al Inicio
            </button>
            <button className="btn-secondary" onClick={() => navigate(-1)}>
              ↩️ Tirada de Salvación (Volver)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
