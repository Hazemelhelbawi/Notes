import React from 'react'
import axios from 'axios';
import jwt_decode from "jwt-decode";
import { useEffect } from 'react';
import { useState } from 'react';
import Swal from 'sweetalert2'
import {Helmet} from "react-helmet";


function Home() {


    const [notes, setNotes] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [note, setNote] = useState({
        title: "",
        desc: ""
    })

    useEffect(() => {
        getUserNotes()
    }, [])


    function getNote({ target }) {
        setNote({ ...note, [target.name]: target.value })
    }

    async function addNote(e) {
        e.preventDefault()
        console.log(note);
        let decoded = jwt_decode(localStorage.getItem("token"));
        console.log(decoded);

        let { data } = await axios.post("https://route-movies-api.vercel.app/addNote", {
            ...note,
            token: localStorage.getItem("token"),
            userID: decoded._id
        })

        if (data.message === "success") {
            Swal.fire('Add!', '', 'success').then(()=>{
                getUserNotes()

            })

            

        }

        console.log(data);
    }
    async function editeNote(e) {
        e.preventDefault();
        console.log(note);
        let decoded = jwt_decode(localStorage.getItem("token"));
        console.log(decoded);


        let {data} = await axios.put('https://route-movies-api.vercel.app/updateNote',{
            ...note,
            token: localStorage.getItem("token"),
            userID: decoded._id
             
        })

        if (data.message == "updated") {
            Swal.fire('Edite!', '', 'success').then(()=>{
                getUserNotes()

            })

            

        }

        console.log(data);
    }


   async function updateNote(index){
    console.log(notes[index]);
    document.querySelector("#exampleModal1 input").value=notes[index].title;
    document.querySelector("#exampleModal1 textarea").value=notes[index].desc;
    setNote({ ...note, "title":notes[index].title ,"desc":notes[index].desc , "NoteID":notes[index]._id });


    //     let {data} = await axios.put('https://route-movies-api.vercel.app/updateNote',{
    //          data:{
    //         "token": localStorage.getItem("token")

    //     }
    // })
    // if (data.message == "success") {
    //     getUserNotes()

    //     }

    }


    async function getUserNotes() {
        // setIsLoading(true)
        let decoded = jwt_decode(localStorage.getItem("token"));
        console.log(decoded);
        let { data } = await axios.get("https://route-movies-api.vercel.app/getUserNotes", {
            headers: {
                token: localStorage.getItem("token"),
                userID: decoded._id
            }
        })

        console.log(data);

        if (data.message == "success") {
            setNotes(data.Notes)
        }

        if (data.message == "no notes found") {
            setNotes([])
        }



        // console.log(notes);
        setIsLoading(false)
    }

   async function deleteNote(noteID){

    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: 'btn btn-success',
          cancelButton: 'btn btn-danger'
        },
        buttonsStyling: false
      })
      
      swalWithBootstrapButtons.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel!',
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {

        (async ()=>{
    let {data} = await axios.delete('https://route-movies-api.vercel.app/deleteNote',{
        data:{
            "NoteID": noteID,
            "token": localStorage.getItem("token")

        }
    })



    if (data.message == "deleted") {
        getUserNotes()
                  swalWithBootstrapButtons.fire(
            'Deleted!',
            'Your file has been deleted.',
            'success'
          )
    }
        })();



        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
        ) {
          swalWithBootstrapButtons.fire(
            'Cancelled',
            'Your imaginary file is safe :)',
            'error'
          )
        }
      })
      



    }


    function gitHubUser(){
        Swal.fire({
            title: 'Submit your Github username',
            input: 'text',
            inputAttributes: {
              autocapitalize: 'off'
            },
            showCancelButton: true,
            confirmButtonText: 'Look up',
            showLoaderOnConfirm: true,
            preConfirm: (login) => {
              return fetch(`//api.github.com/users/${login}`)
                .then(response => {
                  if (!response.ok) {
                    throw new Error(response.statusText)
                  }
                  return response.json()
                })
                .catch(error => {
                  Swal.showValidationMessage(
                    `Request failed: ${error}`
                  )
                })
            },
            allowOutsideClick: () => !Swal.isLoading()
          }).then((result) => {
            if (result.isConfirmed) {
              Swal.fire({
                title: `${result.value.login}'s avatar`,
                imageUrl: result.value.avatar_url
              })
            }
          })
    }




    return (
        <>
                        <Helmet>
                <meta charSet="utf-8" />
                <title>Home</title>
            </Helmet>
                {isLoading && 
        (      <div className="col-md-12">
        <div className="d-felx justify-content-center align-item-center py-5">
          <div className='text-center text-white '>
          <span className="loader"></span>
          </div>
        </div>
      </div>)}
            <div className="container my-5">
                    <div className="d-flex justify-content-between align-items-center">
                    <div className="col-md-6 ms-0">
                <button className='btn btn-success' onClick={gitHubUser}>your github avater <i className="fa-brands fa-github"></i> </button>

                </div>
                    <div className="col-md-6 text-end">
                    <a className="add p-2 btn" data-bs-toggle="modal" data-bs-target="#exampleModal"><i className="fas fa-plus-circle"></i> Add
                        New</a>
                </div>

                    </div>

            </div>


            {/* <!-- Add Modal --> */}
            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <form id="add-form" onSubmit={addNote}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <input onChange={getNote} placeholder="Type Title" name="title" className="form-control" type="text" />
                                <textarea onChange={getNote} className="form-control my-2" placeholder="Type your note" name="desc" id="" cols="30" rows="10"></textarea>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                <button data-bs-dismiss="modal" type="submit" className="btn btn-info"><i className="fas fa-plus-circle"></i> Add Note</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>

            {/* <!-- Edit Modal --> */}
            <div className="modal fade" id="exampleModal1" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <form id="edit-form" onSubmit={editeNote}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <input onChange={getNote} placeholder="Type Title" name="title" className="form-control" type="text" />
                                <textarea onChange={getNote} className="form-control my-2" placeholder="Type your note" name="desc" id="" cols="30" rows="10"></textarea>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" data-dismiss="modal">Close</button>
                                <button data-bs-dismiss="modal" type="submit" className="btn btn-info">Update Note</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>



            {/* <!-- ==========================Notes=============================== --> */}

            <div className="container">
                <div className="row">

                    {notes.map((note, index) => {
                        return <div key={index} className="col-xl-4 col-md-6 my-4 ">
                            <div className="note p-4 card ">
                                <div className="d-flex justify-content-between">
                                <h3 className="">{note.title}</h3>
                                <div className=''>
                                <a onClick={()=> {updateNote(index)}} data-bs-toggle="modal" data-bs-target="#exampleModal1" ><i className="fas fa-edit  edit"></i></a>
                                <a onClick={()=>{deleteNote(note._id)}}> <i className="fas fa-trash-alt  px-3 del "></i></a>
                                </div>
                                </div>

                                <span className=""></span>
                                <p className='p-1'>{note.desc}</p>
                                {/* <p>{note.desc?.split(" ").splice(0,20).join(" ")}</p> */}
                                {/* {note.desc?<p className="p-1 w-100">{note.desc?.split(" ").splice(0,50).join(" ")}</p>:''} */}

                            </div>
                        </div>
                    })}



                </div>

                {notes.length == 0 && !isLoading ? <div className="row">
                    <h2 className='text-white text-center '>No notes found</h2>
                </div> : ""}
            </div>

        </>
    )
}

export default Home
