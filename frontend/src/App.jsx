import { ChatBot } from './components/ChatBot'
import { ChatProvider } from './context/ChatProvider'
import './index.css'

export const App = () => {
  // Guarda la respuesta de llama
  /* const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false) */

  return (
    <ChatProvider>
      <ChatBot />
    </ChatProvider>
  )
}
