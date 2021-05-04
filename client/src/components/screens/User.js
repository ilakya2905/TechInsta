import React, {useState,useEffect,useContext} from 'react'
import {UserContext} from "../../App"
import {useHistory} from "react-router-dom"
import {useParams} from "react-router-dom"
const Profile = () => {
    const history = useHistory()
    const [userProfile,setProfile] = useState([])
    const [showFollow, setFollow] = useState()
    const {state,dispatch} = useContext(UserContext)
    const {userId} = useParams()
    useEffect(() => {
        fetch(`/user/${userId}`, {
            method : "get",
            headers:{
                "Authorization" : "Bearer "+ localStorage.getItem("jwt")
            }
        }).then(res => res.json())
        .then((res) => {
            
            setProfile(res)
            let userObject = JSON.parse(localStorage.getItem("user"))
            let count=0
            res.user.followers.map(item=>{
                if(item==userObject._id){
                    setFollow(false)
                }
                else{
                    count++
                }
            })
            if(count==res.user.followers.length){
                setFollow(true)
            }
        }).catch((error) =>{
            console.log("error",error)
        })
    },[])

    const viewProfile = (userId) =>{
        history.push(`/viewCV/${userId}`)
    }
    const followUser = (followId) =>{
        fetch('/follow',{
            method:"put",
            headers:{
                "Content-type" : "application/json",
                "Authorization" : "Bearer "+localStorage.getItem('jwt')
            },
            body: JSON.stringify({
                followId
            })
        }).then(res=>res.json())
        .then(data=>{
            dispatch({
                type: "UPDATE",
                payload:{
                    following : data.user.following,
                    followers : data.user.followers
                }
            })
            localStorage.setItem("user",JSON.stringify(data.user))
            // setProfile(data.followUser)
            setProfile((prevState)=>{
                return{
                    ...prevState,
                    user:{
                        ...prevState.user,
                        followers: data.followUser.followers,
                        following: data.followUser.following
                    }
                }

            })
            setFollow(false)
        }).catch(error=>{
            console.log(error)
        })
    }

    const unfollowUser = (unfollowId) =>{
        fetch('/unfollow',{
            method:"put",
            headers:{
                "Content-type" : "application/json",
                "Authorization" : "Bearer "+localStorage.getItem('jwt')
            },
            body: JSON.stringify({
                unfollowId
            })
        }).then(res=>res.json())
        .then(data=>{
            dispatch({
                type: "UPDATE",
                payload:{
                    following : data.user.following,
                    followers : data.user.followers
                }
            })
            localStorage.setItem("user",JSON.stringify(data.user))
            // setProfile(data.followUser)
            setProfile((prevState)=>{
                return{
                    ...prevState,
                    user:{
                        ...prevState.user,
                        followers: data.unfollowUser.followers,
                        following: data.unfollowUser.following
                    }
                }

            })
            setFollow(true)

        }).catch(error=>{
            console.log(error)
        })
    }

    if(userProfile.length != 0){
        return(
            <div className="profile-parent">
                <div className="profile-info">
                    <div className="profile-pic">
                        <img src={userProfile.user.profilePicture}/>
                    </div>
                    <div className="profile">
                        <h4>{userProfile.user.name}</h4>
                        <h5>{userProfile.user.email}</h5>
                        <div className="profile-follower-posts">
                            <h6>{userProfile.posts.length} Posts</h6>
                            <h6>{userProfile.user.followers.length} Followers</h6>
                            <h6>{userProfile.user.following.length} Following</h6>

                        </div>
                        { showFollow ? 
                            <button className="btn waves-effect #00b0ff light-blue accent-3 button-customize" type="submit"
                            onClick={()=>followUser(userProfile.user._id)} >
                                Follow
                            </button> :
                            <button className="btn waves-effect #00b0ff light-blue accent-3 button-customize" type="submit"
                            onClick={()=>unfollowUser(userProfile.user._id)} >
                                UnFollow
                            </button>
                        }
                        &nbsp; &nbsp; &nbsp;
                        <button className="btn waves-effect #00b0ff light-blue accent-3" 
                        type="submit"
                        onClick={() => viewProfile(userProfile.user._id)}
                         >
                            View Profile
                        </button>
                        
                    </div>
                </div>
                <div className="gallery">
                    {
                        userProfile.posts.map(item=>{
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
    else{
        return(
            <h1>Loading...</h1>
        )
    }

}

export default Profile
