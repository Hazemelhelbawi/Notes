import React from 'react'
import Home from './Components/Home/Home'
import Login from './Components/Login/Login'
import Register from './Components/Register/Register'
import './App.css'
import { createBrowserRouter , Navigate, RouterProvider} from 'react-router-dom'
import Layout from './Components/Layout/Layout'
import ProtectedRoute from './Components/ProtectedRoute/ProtectedRoute'
import jwt_Decode from "jwt-decode";
import { useState,useEffect } from 'react';
import NotFound from './Components/NotFound/NotFound'
export default function App() {


  let [userData, setUserData] = useState(null);
  function saveUser(props) {
    let token = localStorage.getItem("token");
    let decoded = jwt_Decode(token);
    setUserData(decoded);
  }



  useEffect(() => {
    if (localStorage.getItem("token")) {
      saveUser();
    }
  }, []);

  let logout = () => {
    localStorage.removeItem("token");
    setUserData(null);
    return <Navigate to="login" />;
  };

  let routers = createBrowserRouter([
    {path:'/',element: <Layout userData={userData} logout={logout} />
  ,children:[
    {index:true,element:<ProtectedRoute userData={userData}><Home/></ProtectedRoute>},
    {path:'login',element:<Login saveUser={saveUser} />},
    {path:'register',element:<Register/>},
    {path:'*',element:<NotFound/>},


  ]
  }
  ])
  return (
    <>
<RouterProvider router={routers}/>
    </>
  )
}
