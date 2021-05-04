import React from 'react'
import {useHistory} from "react-router-dom"
import '../../App.css';
import {useState, useEffect} from 'react'
import M from 'materialize-css'

const CreatePost = () => {
    const history = useHistory()
    const [title,setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [image,setImage] = useState("")
    const [url,setUrl] = useState("")

    const postData = () =>{
        fetch("/createPost",{
            method: "post",
            headers:{
                "Content-Type":"application/json",
                "Authorization" : "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                title:title,
                body:description,
                picture:url
            })
        }).then(res => res.json())
        .then(data=>{
            if(data.error){
                M.toast({html: data.error,classes: "#b71c1c red darken-4"})

            }
            else{
                M.toast({html: 'Successfully Posted', classes: "#43a047 green darken-1"})
                history.push('/')
                localStorage.setItem("user.isProfile",true)
            }
        }).catch((err) => {
            console.log(err)
        })

    }

    useEffect(()=>{
        if(url){
            postData()

        }

    },[url])

    const addPost = () =>{
        if(image){
            const data = new FormData()
            data.append("file",image)
            data.append("upload_preset","tech-insta")
            data.append("cloud_name","ilakya")
            fetch("https://api.cloudinary.com/v1_1/ilakya/image/upload",{
                method: "post",
                body: data
            }).then((res)=>{
                res.json().then((data1)=>{
                    setUrl(data1.url)
                })
            }).catch((err)=>{
                console.log(err)
            })
        }
        else{
            postData()
        }
        
    }
    return (
        <div className="card input-field create-post">
            <h2 className="insta-font">Create Post</h2>
            <input type="text" placeholder="title"
            value={title} 
            onChange={(e) => {
                setTitle(e.target.value)}
            }/>
            <input type="text" placeholder="description"
            value={description} 
            onChange={(e) => {
                setDescription(e.target.value)}
            }/>
            <div className="file-field input-field">
                <div className="btn #00b0ff light-blue accent-3">
                    <span>Upload Image</span>
                    <input type="file" placeholder="upload image"
                    onChange={(e) => {
                        setImage(e.target.files[0])}
                    }/>
                </div>
                <div className="file-path-wrapper">
                    <input className="file-path validate" type="text" />
                </div>
            </div>
            <button className="btn waves-effect #00b0ff light-blue accent-3 button-customize" type="submit" 
            onClick={()=>addPost()}>
                Submit Post
            </button>

        </div>
    )
}

export default CreatePost
