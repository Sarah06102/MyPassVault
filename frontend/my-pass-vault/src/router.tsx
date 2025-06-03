import { createBrowserRouter } from "react-router-dom";
import Login from './pages/login.tsx';
import Home from './pages/home.tsx';
import SignUp from './pages/signup.tsx';
import Dashboard from "./pages/dashboard.tsx";
import Security from "./pages/security.tsx";
import GeneratePassword from "./pages/generate-password.tsx";
import Settings from "./pages/settings.tsx";
import Help from "./pages/help.tsx";
import ResetPassword from './pages/reset-password.tsx';

export const router = createBrowserRouter([
    { path: "/", element: <Home title="MyPassVault"/>}, 
    { path: "/login", element: <Login />},
    { path: "/signup", element: <SignUp />},
    { path: "/dashboard", element: <Dashboard />},
    { path: "/security", element: <Security />},
    { path: "/generate-password", element: <GeneratePassword/>},
    { path: "/settings", element: <Settings />},
    { path: "/help", element: <Help />},
    { path: "/reset-password", element: <ResetPassword /> },
  ]);