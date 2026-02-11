import { useNavigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'

const BackHomeButton = () => {
  const navigate = useNavigate()

  return (
    <button className="back-home-button" onClick={() => navigate('/')}>
      <ChevronLeft size={20} />
      Back to Home
    </button>
  )
}

export default BackHomeButton
