const express = require('express')
const cors = require('cors')
const { Pool } = require('pg') // Importe a biblioteca pg

const app = express()
const uploadUser = require('./middlewares/uploadImage')

// Configuração do banco de dados PostgreSQL
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'bdeventos',
  password: 'postgres',
  port: 5432, // Porta padrão do PostgreSQL
})

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE')
  res.header(
    'Access-Control-Allow-Headers',
    'X-PINGOTHER, Content-Type, Authorization'
  )
  app.use(cors())
  next()
})

app.post('/upload-image', uploadUser.single('image'), async (req, res) => {
  if (req.file) {
    const { evento, originalname } = req.body // Nome do evento e nome original do arquivo

    try {
      // Insira os dados no banco de dados
      const query =
        'INSERT INTO eventos (nome_evento, nome_imagem) VALUES ($1, $2)'
      const values = [evento, originalname]
      await pool.query(query, values)

      return res.json({
        erro: false,
        mensagem: 'Upload realizado com sucesso!',
      })
    } catch (error) {
      console.error('Erro ao inserir no banco de dados:', error)
      return res.status(500).json({
        erro: true,
        mensagem: 'Erro interno no servidor',
      })
    }
  }

  return res.status(400).json({
    erro: true,
    mensagem:
      'Erro: Upload não realizado com sucesso, necessário enviar uma imagem PNG ou JPG!',
  })
})

app.listen(8081, () => {
  console.log('Servidor iniciado na porta 8081: http://localhost:8081')
})
