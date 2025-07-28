// 1. Importar express y dotenv

//  Common JS
/* const express = require('express')
require('dotenv').config() */

// ESModules
import express from 'express'
import dotenv from 'dotenv'
import fs from 'fs'

dotenv.config()

// 2. Crear la aplicación de express
const app = express()
const PORT = process.env.PORT

// Función que lee la info de db.json
const readData = () => {
  try {
    const data = fs.readFileSync('./src/db.json')
    return JSON.parse(data)
  } catch (error) {
    console.error(error)
  }
}

// Función que escribe dentro de db.json
const writeData = (data) => {
  try {
    fs.writeFileSync('./src/db.json', JSON.stringify(data))
  } catch (error) {
    console.error(error)
  }
}

app.get('/', (req, res) => {
  res.send('Hola mundo')
})

app.get('/peliculas', (req, res) => {
  const data = readData()
  res.json(data)
})

app.get('/peliculas/:id', (req, res) => {
  const id = parseInt(req.params.id)
  const result = readData().action.find(pelicula => pelicula.id === id)
  res.json(result)
})

app.use(express.json())

app.post('/peliculas', (req, res) => {
  const data = readData()
  const body = req.body
  const newMovie = {
    id: data.action.length + 1,
    ...body
  }
  data.action.push(newMovie)
  writeData(data)
  res.json(newMovie)
})

app.put('/peliculas/:id', (req, res) => {
  const data = readData()
  const id = parseInt(req.params.id)
  const body = req.body

  const movieIndex = data.action.findIndex(movie => movie.id === id)
  data.action[movieIndex] = {
    ...data.action[movieIndex], // lo que ya existe
    ...body // lo que quiero cambiar
  }
  writeData(data)
  res.json({ message: 'Película actualizada correctamente' })
})

app.delete('/peliculas/:id', (req, res) => {
  const data = readData()
  const id = parseInt(req.params.id)

  const movieIndex = data.action.findIndex(movie => movie.id === id)
  data.action.splice(movieIndex, 1)
  writeData(data)
  res.json({ message: 'Película eliminada correctamente' })
})

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`)
})
