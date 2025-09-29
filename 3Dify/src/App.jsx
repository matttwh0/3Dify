import { useState } from 'react'
import './App.css'
import Message from './Message';
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <div><Message/></div>
      <div>
        <h1 class="text-3x1 font-bold underline">Hello World!</h1>
      </div>
    </>
  )
}

export default App
