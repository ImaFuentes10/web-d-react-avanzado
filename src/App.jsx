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

export const App = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  })
  // Guarda la respuesta de llama
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)

  const handlePrompt = async (data) => {
    console.log(data.userInput)
    setLoading(true)
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
