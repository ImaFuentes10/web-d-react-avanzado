import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useContext } from 'react'
import { ChatContext } from '../context/ChatContext'
import { useOllama } from '../hooks/useOllama'
import '../ChatBot.css'

const schema = yup.object({
  userInput: yup
    .string()
    .min(3, 'El mensaje debe contener al menos 3 caracteres')
    .required('El mensaje es obligatorio'),
})

export const ChatBot = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  })
  const { state, dispatch } = useContext(ChatContext)
  const { sendMessage } = useOllama()

  const handlePrompt = async (data) => {
    dispatch({ type: 'ADD_MESSAGE', payload: { from: 'user', text: data.userInput } })
    dispatch({ type: 'SET_LOADING', payload: true })

    try {
      const res = await sendMessage(data.userInput)
      dispatch({ type: 'ADD_MESSAGE', payload: { from: 'bot', text: res.data.response } })
    } catch (error) {
      console.error(error)
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  return (
    <>
      <div className='chat-container'>
        <div className='chat-messages'>
          {state.messages.map((msg, index) => (
            <div
              key={index}
              className={`message ${msg.from === 'user' ? 'user' : 'bot'}`}
            >
              {msg.text}
            </div>
          ))}
          {state.loading && <p className='loading'>Generando respuesta 🚀</p>}
        </div>
        <form onSubmit={handleSubmit(handlePrompt)}>
          <input
            type='text'
            {...register('userInput')}
            placeholder='Escribe tu mensaje...'
          />
          <button type='submit'>Preguntar</button>
        </form>
        {errors.userInput && <p>{errors.userInput.message}</p>}
      </div>
    </>
  )
}
