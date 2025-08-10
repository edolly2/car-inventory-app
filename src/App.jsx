import { useState } from 'react'
import InventoryManager from './InventoryManager.jsx'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <InventoryManager/>
    </>
  )
}

export default App
