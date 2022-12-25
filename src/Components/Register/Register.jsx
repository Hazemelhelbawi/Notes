import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import {Helmet} from "react-helmet";
import Joi from 'joi';

export default function Register() {
let navigate = useNavigate()


  const[user,setUser]=useState({
    first_name:'',
    last_name:'',
    email:'',
    password:'',
  })

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [validateError, setValidateError] = useState([])
  // const [message, setMessage] = useState('')
  function getUser({target}){
      setUser({...user,[target.name]: target.value })
      console.log(user);
  }

  async function register(e) {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    if(validateUser()){

    

     console.log(user);

   let {data}= await axios.post('https:/sticky-note-fe.vercel.app/signup',user)
    if (data.message === 'success'){
      // setMessage('success')
      navigate('/login')
      }else {
      setError(data.message)

    }
   setIsLoading(false)
   console.log(data);
 
  
  }
}
  function validateUser(){
    let schema = Joi.object({
      first_name: Joi.string().min(3).max(10).required().messages({
        "string.empty":"first name is required",
        "string.min":"first name is required"
      }),
      last_name: Joi.string().min(3).max(10).required().messages({
        "string.empty":"last name is required",
        "string.min":"last name is required"
      }),

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
      console.log(res);
      return false
    }else{
      return true
    }
  }


  return (
    <>
                    <Helmet>
                <meta charSet="utf-8" />
                <title>Register</title>
            </Helmet>
    <div className="container formInfo py-5">
    <h2 className='text-center text-uppercase text-white'>Register</h2>
    

    
      <form onSubmit={register} className="form w-50 m-auto">
        <div className="form-group py-2">
          <input onChange={getUser} className=' bg-transparent' type="text" name='first_name' placeholder='First Name' />
      
          <div className="text-danger text-center fw-bold fs-5">
             {validateError.filter((ele)=>ele.context.label=='first_name')[0]?.message}

             </div>      
               </div>
        <div className="form-group py-2">
          <input onChange={getUser} className=' bg-transparent' type="text" name='last_name' placeholder='Last Name' />
          <div className="text-danger text-center fw-bold fs-5">
             {validateError.filter((ele)=>ele.context.label=='last_name')[0]?.message}

             </div> 
      
        </div>
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
        <button className={`btn btn-outline-info` +(isLoading? ' disabled' : '') }>{isLoading === true ?<i className="fas fa-spinner fa-spin " ></i>:'Sign Up'}</button>
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
