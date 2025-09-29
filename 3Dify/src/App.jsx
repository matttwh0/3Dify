import { useState } from 'react'
import './App.css'
import Message from './Message';
import LandingPage from './LandingPage';
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <div>
      {/*<Message/>*/}
      </div>
      <div>
        <LandingPage/>
      </div>
    </>
  )
}

export default App
