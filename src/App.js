import React, { useState, useEffect } from 'react'
import axios from 'axios'

/**
 * Permite crear variables utilizadas en `<Input />`
 * y manejar su estado con el hook `useState`
 * @param {string} type text, date, password
 */
const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  return {
    type,
    value,
    onChange
  }
}

/**
 * `useResource` maneja las requests
 * que anteriormente usamos en services.
 * La ventaja es que podemos utilizar el 
 * mismo hook para diferentes recursos (blogs, notes, persons)
 * 
 * Devuelve un array con 2 items:
 * El primero contiene los recursos en sí y
 * el segundo contiene los métodos para manipular
 * estos recursos
 * 
 * @param {string} baseUrl API Url
 */
const useResource = (baseUrl) => {
  const [resources, setResources] = useState([])

  /**
   * Obtiene todos los recursos en `baseUrl`
   * y actualiza `resources`
   */
  useEffect(() => {

    const getAll = async () => {
      const response = await axios.get(baseUrl) 
      setResources(response.data)
    }

    getAll();
  }, [baseUrl])

  /**
   * Realiza una POST request a `baseUrl`
   * Luego añade el nuevo recurso a `resources`
   * @param {Object} resource 
   */
  const create = async (resource) => {
    const response = await axios.post(baseUrl, resource)

    setResources(resources.concat(response.data))
  }

  /** 
   * Acá declaramos los métodos que va a devolver `useResource`
   * Se pueden utilizar para manipular `resources`
   */
  const service = {
    create
  }

  return [
    resources, service
  ]
}

const App = () => {
  const content = useField('text')
  const name = useField('text')
  const number = useField('text')

  const [notes, noteService] = useResource('http://localhost:3005/notes')
  const [persons, personService] = useResource('http://localhost:3005/persons')

  const handleNoteSubmit = (event) => {
    event.preventDefault()
    noteService.create({ content: content.value })
  }

  const handlePersonSubmit = (event) => {
    event.preventDefault()
    personService.create({ name: name.value, number: number.value })
  }

  return (
    <div>
      <h2>notes</h2>
      <form onSubmit={handleNoteSubmit}>
        <input {...content} />
        <button>create</button>
      </form>
      {notes.map(n => <p key={n.id}>{n.content}</p>)}

      <h2>persons</h2>
      <form onSubmit={handlePersonSubmit}>
        name <input {...name} /> <br />
        number <input {...number} />
        <button>create</button>
      </form>
      {persons.map(n => <p key={n.id}>{n.name} {n.number}</p>)}
    </div>
  )
}

export default App