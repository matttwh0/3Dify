import { useState } from 'react'
import './App.css'
import Message from './Message';
import LandingPage from './Dashboard';
import PostPhotoScene from './PostForm';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <div>
      </div>
      <div>
        <LandingPage/>
        <PostPhotoScene/>
        <Message/>
      </div>
    </>
  )
}

export default App
