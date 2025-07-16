import axios from 'axios'

export const useOllama = () => {
  const sendMessage = async (userPrompt) => {
    try {
      const res = await axios.post('http://localhost:11434/api/generate', {
        model: 'gemma3:4b',
        prompt: userPrompt,
        stream: false
      })
      return res
    } catch (error) {
      console.error('Error:', error)
    } finally {
      /* setLoading(false) */
    }
  }

  return { sendMessage }
}
