import { createBrowserRouter } from "react-router-dom";
import Login from './pages/login.tsx';
import Home from './pages/home.tsx';
import SignUp from './pages/signup.tsx';
import Dashboard from "./pages/dashboard.tsx";

export const router = createBrowserRouter([
    { path: "/", element: <Home title="MyPassVault"/>}, 
    { path: "/login", element: <Login />},
    { path: "/signup", element: <SignUp />},
    { path: "/dashboard", element: <Dashboard />},
  ]);