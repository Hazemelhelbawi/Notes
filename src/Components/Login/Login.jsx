import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import {Helmet} from "react-helmet";
import Joi from "joi";

export default function Login({ saveUser }) {
  const [validateError, setValidateError] = useState([])

  let navigate = useNavigate()
  const[user,setUser]=useState({

    email:'',
    password:'',
  })

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  // const [message, setMessage] = useState('')
  function getUser({target}){
      setUser({...user,[target.name]: target.value })
      console.log(user);
  }

  async function login(e) {
    e.preventDefault()
    setError('')
    // setMessage('')

    setIsLoading(true)

    if(validateUser()){

     console.log(user);
   let {data}= await axios.post('https:/sticky-note-fe.vercel.app/signin',user)
    if (data.message === 'success'){
      // setMessage('success')
      localStorage.setItem("token", data.token);
      saveUser();
      navigate('/')
      }else {
      setError(data.message)

    }
   setIsLoading(false)
   console.log(data);
 
  }
  }

  function validateUser(){
    let schema = Joi.object({

      email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).messages({
        "string.empty":"email is required",
        "string.min":"email is required"
      }),
      password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).messages({
        "string.empty":"password is required",
        "string.min":"password is required"
      }),
    })

    let res = schema.validate(user,{abortEarly:false})
    if(res.error){
      setValidateError(res.error.details)
      return false
    }else{
      return true
    }
  }

  return (
    <>
                    <Helmet>
                <meta charSet="utf-8" />
                <title>Login</title>
            </Helmet>
    <div className="container formInfo py-5">
    <h2 className='text-center text-uppercase text-white'>Login</h2>
      <form onSubmit={login} className="form w-50 m-auto">

        <div className="form-group py-2">
          <input onChange={getUser} className=' bg-transparent' type="email" name='email' placeholder='Email Address' />
          <div className="text-danger text-center fw-bold fs-5">
             {validateError.filter((ele)=>ele.context.label=='email')[0]?.message}

             </div> 
      
        </div>
        <div className="form-group py-2">
          <input onChange={getUser} className=' bg-transparent' type="Password" name='password' placeholder='password' />
          <div className="text-danger text-center fw-bold fs-5">
             {validateError.filter((ele)=>ele.context.label=='password')[0]?.message}

             </div> 

        </div>
        <div className='py-2 d-flex justify-content-center'>
        <button className={`btn btn-outline-info` +(isLoading? ' disabled' : '') }>{isLoading == true ?<i className="fas fa-spinner fa-spin " ></i>:'Sign In'}</button>
        </div>
        {error && <div className='alert alert-danger mt-2 text-center'>
          {error}
        </div>}
        {/* {message && <div className='alert alert-success mt-2 text-center'>
          {message}
        </div>} */}
      </form>
    </div>
    </>
  )
}
