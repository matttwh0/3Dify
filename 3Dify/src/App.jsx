import { useState } from 'react'
import './App.css'
import Message from './Message';
import LandingPage from './Dashboard';
import PostPhotoScene from './PostForm';
import GetToken from './getToken';
import { TestGetToken } from './TestGetToken';
import { TestPostForm } from './TestPostForm';
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <div>
      </div>
      <div>
        <LandingPage/>
        <PostPhotoScene/>
        <TestPostForm/>
        <TestGetToken/>
        
        <Message/>
      </div>
    </>
  )
}

export default App
