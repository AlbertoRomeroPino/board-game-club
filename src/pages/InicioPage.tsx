import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/authContext';
import '../styles/inicio.css';
import { 
  BookOpen, 
  Compass, 
  Library, 
  Heart, 
  ChevronRight 
} from 'lucide-react';
import Seccion from '../components/Sección';

export const InicioPage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="inicio-page">
      {/* Hero Section - Estilo Pergamino Antiguo */}
      <header className="inicio-hero">
        <div className="inicio-hero-texture" />
        
        <h1 className="inicio-title">
          MeepleKeep
        </h1>
        <p className="inicio-tagline">
          "El refugio rústico para tu colección de juegos de mesa."
        </p>

        <div className="inicio-cta">
          {isAuthenticated ? (
            <Link 
              to="/juegos" 
              className="cta-button cta-button--primary"
            >
              Ir a mi Colección <ChevronRight size={20} />
            </Link>
          ) : (
            <div className="inicio-cta-group">
              <Link 
                to="/iniciar-sesion" 
                className="cta-button cta-button--primary"
              >
                Iniciar Sesión <ChevronRight size={20} />
              </Link>
              <Link 
                to="/registro" 
                className="cta-button cta-button--secondary"
              >
                Forjar una Cuenta <ChevronRight size={20} />
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* Grid de Información - Dividido en 4 */}
      <main className="inicio-main">
        <div className="inicio-grid">
          
          {/* 1. De qué trata */}
          <Seccion 
            title="La Bitácora"
            text="MeepleKeep es más que un inventario; es la historia de tus partidas. Organiza cada caja, componente y expansión de tu ludoteca en un espacio digital diseñado por y para jugadores de mesa."
            icon={BookOpen}
            variant="tan"
          />

          {/* 2. Explora y descubre */}
          <Seccion
            title="Explora"
            text="Descubre nuevos mundos. Navega por el catálogo de la comunidad, filtra por mecánicas, tiempo de juego o número de jugadores y encuentra el próximo gran reto para tu grupo de juego."
            icon={Compass}
            variant="forest"
          />
            

          {/* 3. Guarda los que tengas */}
          <Seccion
            title="Tu Estantería"
            text="Lleva el control total. Registra los juegos que ya posees, gestiona detalles específicos y mantén tu colección física perfectamente reflejada en la nube para consultarla en cualquier lugar."
            icon={Library}
            variant="wood"
          />

          {/* 4. Favoritos y Deseos */}
          <Seccion
            title="Deseos"
            text="Marca tus objetivos. Añade a favoritos aquellos juegos que te han enamorado y, cuando finalmente lleguen a tu mesa, conviértelos a tu colección con un solo clic."
            icon={Heart}
            variant="crimson"
          />

        </div>
      </main>

      {/* Footer Estilo Madera */}
      <footer className="inicio-footer">
        <p className="inicio-footer__text">
          © 2024 MeepleKeep • El arte de jugar y organizar
        </p>
      </footer>
    </div>
  );
};