import React, {useState,useEffect,useContext} from 'react'
import {UserContext} from "../../App"


const Profile = () => {
    const [data,setData] = useState([])
    const {state,dispatch} = useContext(UserContext)
    const [image,setImage] = useState("")
    const [url,setUrl] = useState("")
    useEffect(() => {
        fetch('/myPost', {
            method : "get",
            headers:{
                "Authorization" : "Bearer "+ localStorage.getItem("jwt")
            }
        }).then(res => res.json())
        .then((res) => {
            setData(res.result)
        })
    },[])
    useEffect(() => {
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
                    
                    fetch('/updateProfilePicture',{
                        method : "put",
                        headers:{
                            "Content-type" : "application/json",
                            "Authorization" : "Bearer "+localStorage.getItem('jwt')
                        },
                        body : JSON.stringify({
                            profilePicture: data1.url
                        })
                    }).then(res=>res.json())
                    .then((result)=>{
                        setUrl(result.profilePicture)
                        dispatch({
                            type:"UPDATE-PIC",
                            payload:result.profilePicture
                        })
                    }).catch((error)=>{
                        console.log(error)
                    })
                })
            }).catch((err)=>{
                console.log(err)
            })
        } 
    }, [image])
    const updateProfilePicture=(file) =>{
        setImage(file)

        // else{
        //     uploadFields()
        // }
    }

    return (
        
        <div className="profile-parent">
            <div className="profile-info">
                <div className="profile-pic">
                    <img src= {state ? state.profilePicture : "Loading"}/>
                </div>
                <div className="profile">
                    <h5>{state ? state.name : "Loading.."}</h5>
                    <h5>{state ? state.email : "Loading.."}</h5>

                    <div className="profile-follower-posts">
                        <h6>{state ? data.length : 0} Posts</h6>
                        <h6>{state ? state.followers.length : 0} Followers</h6>
                        <h6>{state ? state.following.length : 0} Following</h6>

                    </div>

                    <div className="file-field input-field">
                    <div className="btn #00b0ff light-blue accent-3">
                        <span>Upload Profile Picture</span>
                        <input type="file" placeholder="upload image"
                        onChange={(e) => {
                            updateProfilePicture(e.target.files[0])}
                        }/>
                    </div>
                    <div className="file-path-wrapper">
                        <input className="file-path validate" />
                    </div>
                </div>
                </div>
            </div>
            <div className="gallery">
                {
                    data.map(item=>{
                        { 
                            if(item.picture){
                               return(
                                <img className="item" 
                                src={item.picture} alt={item.title} key={item._id}/>
                               ) 
                            }
                        }

                    })
                }
                
            </div>
        </div>
    )
}

export default Profile
