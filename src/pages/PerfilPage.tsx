import { useAuth } from '../auth/authContext';

const PerfilPage = () => {
  
    return (
    <div>
        <h1>Perfil del usuario: {useAuth().user?.name} </h1>
        <ul>
          <li>
            Correo electronico: {useAuth().user?.email}
          </li>
          <li>
            <img src={useAuth().user?.imagenUrl} alt="Imagen de usuario" />
          </li>
        </ul>

      <button>Editar</button>
    </div>
  )
}

export default PerfilPage
