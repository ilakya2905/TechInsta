import React, {useState,useEffect,useContext} from 'react'
import {UserContext} from "../../App"
import M from 'materialize-css'

import {Link} from 'react-router-dom'
const MyPosts = () => {
    const [data,setData] = useState([])
    const {state,dispatch}= useContext(UserContext)

    useEffect(() => {
        fetch('/myPost', {
            method : "get",
            headers:{
                "Authorization" : "Bearer "+ localStorage.getItem("jwt")
            }
        }).then(res => res.json())
        .then((result) => {
            setData(result.result)
        })
    }, [])
    const likePost =(id) => {
        fetch('/like',{
            method:"put",
            headers:{
                "Content-Type" : "application/json",
                "Authorization" : "Bearer "+ localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId : id
            })
        }).then(res=>res.json())
        .then(res=>{
            const newData = data.map(item =>{
                if(item._id == res._id){
                    return res
                }
                else{
                    return item
                }
            })
            setData(newData)
        }).catch((error)=>{
            console.log(error)
        })
    }
    const unLikePost =(id) => {
        fetch('/unLike',{
            method:"put",
            headers:{
                "Content-Type" : "application/json",
                "Authorization" : "Bearer "+ localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId : id
            })
        }).then(res=>res.json())
        .then(res=>{
            const newData = data.map(item =>{
                if(item._id == res._id){
                    return res
                }else{
                    return item
                }
            })
            setData(newData)        
        }).catch((error)=>{
            console.log(error)
        })
    }
    const makeComment = (text,postId) =>{
        fetch('/addComment',{
            method: "put",
            headers:{
                "Content-Type" : "application/json",
                "Authorization" : "Bearer "+ localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId,
                text
            })
        }).then(res=>res.json())
        .then(res=>{
            const newData = data.map(item =>{
                if(item._id == res._id){
                    return res
                }else{
                    return item
                }
            })
            setData(newData)        
        }).catch((error)=>{
            console.log(error)
        })
    }
    const deletePost = (postId) =>{
        fetch(`/deletePost/${postId}`,{
            method:"delete",
            headers:{
                "Authorization" : "Bearer "+ localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then((result)=>{
            const newData = data.filter(item=>{
                return item._id !== result._id
            })
            setData(newData)
            M.toast({html: 'Successfully deleted the post', classes: "#43a047 green darken-1"})


        }).catch((error)=>{
            console.log(error)
            M.toast({html: error,classes: "#b71c1c red darken-4"})

        })
    }
    return (
        <div className="home-parent">
            {
                data.map((item) => {
                    return (
                        <div className="card home-post-card" key={item._id}>
                            <h5 className="posted-by" >
                                <Link to={`/userProfile/${item.postedBy._id}`}>
                                    {item.postedBy.name}
                                </Link>
                                {
                                    item.postedBy._id == state._id && 
                                    <i onClick = {()=> deletePost(item._id)} 
                                    className="material-icons delete-icon" >delete</i>
                                }
                                
                            </h5>
                            { item.picture && 
                                <div className="card-img">
                                    <img src={item.picture}></img>
                                </div>
                            }
                            { item.picture && 
                                <div className="card-content">
                                    <i className="material-icons like-color">favorite</i>
                                    {item.like.includes(state._id) ?
                                        <i className="material-icons " 
                                            onClick={()=>{unLikePost(item._id)}}>thumb_down</i> :
                                        <i className="material-icons " 
                                            onClick={()=>{likePost(item._id)}}>thumb_up</i>

                                    }
                                    <h6 className="post-title">{item.like.length} likes</h6>
                                    <h6 className="post-title">{item.title}</h6>
                                    <p className="post-description">{item.body}</p>
                                    {
                                        item.comments.map(record=>{
                                            return (
                                                <h6><span className="comment-posted-by"><p>{record.postedBy.name} : </p></span>{record.text}</h6>
                                            )
                                        })
                                    }
                                    <form onSubmit={(e)=>{
                                        e.preventDefault()
                                        makeComment(e.target[0].value,item._id)
                                    }}>
                                         <input type="text" placeholder="add a comment"></input>

                                    </form>                                
                                </div>
                            }
                            { ! item.picture && 
                                <div className="card-content">
                                    <h6 className="post-title">{item.title}</h6>
                                    <p className="post-description">{item.body}</p>
                                    <div className="padding-class"></div>
                                    <i className="material-icons like-color">favorite</i>
                                    {item.like.includes(state._id) ?
                                        <i className="material-icons " 
                                            onClick={()=>{unLikePost(item._id)}}>thumb_down</i> :
                                        <i className="material-icons " 
                                            onClick={()=>{likePost(item._id)}}>thumb_up</i>

                                    }
                                    <h6 className="post-title">{item.like.length} likes</h6>
                                    {
                                        item.comments.map(record=>{
                                            return (
                                                <h6><span className="comment-posted-by"><p>{record.postedBy.name} : </p></span>{record.text}</h6>
                                            )
                                        })
                                    }
                                    <form onSubmit={(e)=>{
                                        e.preventDefault()
                                        makeComment(e.target[0].value,item._id)
                                        e.target[0].value = ""
                                    }}>
                                         <input type="text" placeholder="add a comment"></input>

                                    </form>      
                                </div>
                            }
                            
                        </div>
                    )
                })

            }
            

        </div>
    )
}

export default MyPosts
