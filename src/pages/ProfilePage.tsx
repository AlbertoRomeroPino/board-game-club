import { useState } from 'react';
import { useAuth } from '../auth/authContext';
import ProfileForm from '../components/ProfileForm';
import '../styles/profile.css';

const ProfilePage = () => {
  const { user } = useAuth();
  const [editando, setEditando] = useState(false);

  return (
    <div className="perfil-container">
      {editando ? (
        <ProfileForm 
          onCancel={() => setEditando(false)} 
          onSave={() => setEditando(false)} 
        />
      ) : (
        <>
          <div className="perfil-header">
            <img 
              src={user?.imagenUrl || '/Foto de perfil/PerfilDefecto.jpg'} 
              alt="Imagen de usuario" 
              className="perfil-avatar"
            />
            <h1 className="perfil-nombre">{user?.name}</h1>
          </div>

          <ul className="perfil-info">
            <li className="perfil-info-item">
              <span className="perfil-info-icon">✉️</span>
              <div className="perfil-info-content">
                <span className="perfil-info-label">Correo electrónico</span>
                <span className="perfil-info-value">{user?.email}</span>
              </div>
            </li>
          </ul>

          <div className="perfil-actions">
            <button 
              className="perfil-btn-editar" 
              onClick={() => setEditando(true)}
            >
              Editar perfil
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default ProfilePage
