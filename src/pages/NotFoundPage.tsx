import { useNavigate } from 'react-router-dom';
import '../styles/notfound.css';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="notfound-page">
      <div className="notfound-container">
        <div className="dice-container">
          <div className="d20">
            <span className="dice-number">1</span>
          </div>
          <div className="dice-shadow"></div>
        </div>

        <div className="notfound-content">
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
