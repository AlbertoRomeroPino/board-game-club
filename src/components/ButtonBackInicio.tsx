import { useNavigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'

const ButtonBackInicio = () => {
  const navigate = useNavigate()

  return (
    <button className="button-back-inicio" onClick={() => navigate('/')}>
      <ChevronLeft size={20} />
      Volver al Inicio
    </button>
  )
}

export default ButtonBackInicio
