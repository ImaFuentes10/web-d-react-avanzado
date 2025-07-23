require('dotenv').config()

/* console.log(process.env.PORT)
console.log(process.env.NOMBRE) */

// Importamos el módulo de Express
const express = require('express')

const { infoPeliculas } = require('./peliculas')

// Creamos una aplicación de Express
const app = express()

// Definimos el puerto que va a escuchar el servidor
const PORT = process.env.PORT

app.get('/', (req, res) => {
  res.send('Hola mundo')
})

app.get('/api/peliculas', (req, res) => {
  res.send(infoPeliculas)
})

app.get('/api/peliculas/accion/:titulo/:year', (req, res) => {
  const { titulo, year } = req.params
  const results = infoPeliculas.accion.filter(pelicula => pelicula.titulo === titulo && pelicula.year === Number(year))

  if (results.length === 0) {
    return res.status(400).send(`No se encontraron resultados para ${titulo} en el año ${year}`)
  }
  res.send(results)
})

app.get('/api/peliculas/comedia/:country', (req, res) => {
  const country = req.params.country
  const results = infoPeliculas.comedia.filter(pelicula => pelicula.country === country)

  if (req.query.ordenar === 'year') {
    return res.send(results.sort((a, b) => b.year - a.year))
  }

  res.send(results)
})

app.use(express.json())
app.post('/api/peliculas', (req, res) => {
  const nuevaPelicula = req.body

  console.log(nuevaPelicula)

  res.status(201).send({
    message: 'Película recibida exitosamente',
    data: nuevaPelicula
  })
})

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`)
})
