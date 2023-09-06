import React, { useState } from 'react'
import api from './config/configApi'

function App() {
  const [evento, setEvento] = useState('')
  const [image, setImage] = useState('')
  const [status, setStatus] = useState({
    type: '',
    mensagem: '',
  })

  const uploadImage = async (e) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append('evento', evento) // Adiciona o nome do evento ao FormData
    formData.append('image', image)

    try {
      const response = await api.post('/upload-image', formData)

      setStatus({
        type: 'success',
        mensagem: response.data.mensagem,
      })
    } catch (err) {
      if (err.response) {
        setStatus({
          type: 'error',
          mensagem: err.response.data.mensagem,
        })
      } else {
        setStatus({
          type: 'error',
          mensagem: 'Erro: Tente mais tarde!',
        })
      }
    }
  }

  return (
    <div>
      <h1>Upload</h1>

      {status.type === 'success' && (
        <p style={{ color: 'green' }}>{status.mensagem}</p>
      )}

      {status.type === 'error' && (
        <p style={{ color: '#ff0000' }}>{status.mensagem}</p>
      )}

      <form onSubmit={uploadImage}>
        <label>Evento: </label>
        <input
          type='text'
          value={evento} // Define o valor do input como o valor do estado 'evento'
          onChange={(e) => setEvento(e.target.value)} // Atualiza o estado 'evento' quando o valor do input muda
        />
        <label>Imagem: </label>
        <input
          type='file'
          name='image'
          onChange={(e) => setImage(e.target.files[0])}
        />
        <br />
        <br />

        <button type='submit'>Salvar</button>
      </form>
    </div>
  )
}

export default App
