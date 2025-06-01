import './App.css'
import Home from './pages/home'
import { RouterProvider } from 'react-router-dom';
import { router } from './router';

function App() {

  return (
    <>
      <RouterProvider router={router} />
      <Home title="MyPassVault"/>
    </>
  )
}

export default App
