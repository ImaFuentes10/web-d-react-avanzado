import './index.css'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import axios from 'axios'
import { useReducer, useState } from 'react'

const schema = yup.object({
  userInput: yup
    .string()
    .min(3, 'El mensaje debe contener al menos 3 caracteres')
    .required('El mensaje es obligatorio'),
})

const initialState = {
  messages: []
}

const chatReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_MESSAGE':
      console.log('agregando mensaje...')
      console.log(state)
      return {
        ...state, messages: [...state.messages, action.payload]
      }
    default:
      return state
  }
}

export const App = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  })
  // Guarda la respuesta de llama
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)
  const [state, dispatch] = useReducer(chatReducer, initialState)

  const handlePrompt = async (data) => {
    console.log(data.userInput)
    setLoading(true)
    try {
      const res = await axios.post('http://localhost:11434/api/generate', {
        model: 'gemma3:4b',
        prompt: data.userInput,
        stream: false
      })
      setResponse(res.data.response)
      dispatch({ type: 'ADD_MESSAGE', payload: { from: 'user', text: data.userInput } })
      dispatch({ type: 'ADD_MESSAGE', payload: { from: 'bot', text: res.data.response } })
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit((handlePrompt))}>
        <input
          type='text'
          {...register('userInput')}
          className='w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400'
        />
        {errors.userInput && <p>{errors.userInput.message}</p>}
        <button
          className='w-full py-2 rounded transition cursor-pointer bg-blue-600 text-white hover:bg-blue-700'
        >Preguntar
        </button>
      </form>
      {/* <div>
        <p>{loading ? 'Generando respuesta' : response}</p>
      </div> */}
      <div>
        {state.messages.map((msg, index) => (
          <p key={index}>
            <strong>{msg.from === 'user' ? 'Tú:' : 'Bot:'}</strong>
            {msg.text}
          </p>
        ))}
      </div>
    </>
  )
}
