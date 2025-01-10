import { Route, Routes } from 'react-router-dom'
import TodoPage from './pages/TodoPage'
import NotFound from './pages/NotFound'
import Login from './pages/Login'
import Register from './pages/Register'

function App() {  

  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/tasks" element={<TodoPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}

export default App