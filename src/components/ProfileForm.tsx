import { useState } from 'react';
import { useAuth } from '../auth/authContext';
import { authService } from '../services/authService';
import {sileo} from 'sileo';

import '../styles/profile.css';

type ProfileFormProps = {
  onCancel: () => void;
  onSave: () => void;
};

const ProfileForm = ({ onCancel, onSave }: ProfileFormProps) => {
  const { user, token, updateUser } = useAuth();
  const [name, setName] = useState(user?.name ?? '');
  const [imagenUrl, setImagenUrl] = useState(user?.imagenUrl ?? '');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !token) return;

    setLoading(true);

    const updatePromise = authService.updateUser(
      user.id,
      { name, imagenUrl },
      token
    );

    sileo.promise(updatePromise, {
      loading: { title: "Guardando cambios..." },
      success: { title: "Perfil actualizado correctamente" },
      error: { title: "Error al actualizar el perfil" },
    });

    try {
      const updatedUser = await updatePromise;
      updateUser(updatedUser);
      onSave();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="perfil-form" onSubmit={handleSubmit}>
      <h2 className="perfil-form-title">Editar perfil</h2>

      <div className="perfil-form-preview">
        <img 
          src={imagenUrl || '/Foto de perfil/PerfilDefecto.jpg'} 
          alt="Vista previa" 
          className="perfil-avatar"
        />
      </div>

      <div className="perfil-form-group">
        <label htmlFor="name">Nombre</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="perfil-form-group">
        <label htmlFor="imagenUrl">URL de imagen</label>
        <input
          type="url"
          id="imagenUrl"
          value={imagenUrl}
          onChange={(e) => setImagenUrl(e.target.value)}
          placeholder="https://ejemplo.com/imagen.jpg"
        />
      </div>

      <div className="perfil-form-actions">
        <button 
          type="button" 
          className="perfil-btn-cancelar" 
          onClick={onCancel}
          disabled={loading}
        >
          Cancelar
        </button>
        <button 
          type="submit" 
          className="perfil-btn-guardar"
          disabled={loading}
        >
          {loading ? 'Guardando...' : 'Guardar'}
        </button>
      </div>
    </form>
  );
};

export default ProfileForm;
