import React, {useContext, useRef, useEffect, useState} from 'react'
import '../App.css';
import {Link,useHistory} from "react-router-dom"
import {UserContext} from "../App"
import M from 'materialize-css'


const NavBar = () => {
    const history = useHistory()
    const searchModal = useRef(null)
    const [search,setSearch] = useState('')
    const [users,setUsers] = useState([])
    const {state,dispatch} = useContext(UserContext)
    const user = JSON.parse(localStorage.getItem("user"))
    useEffect(() => {
        M.Modal.init(searchModal.current)
    }, [])

    const fetchUsers = (query) =>{
        setSearch(query)
        fetch("/searchUsers", {
            method: "post",
            headers:{
                "Content-Type":"application/json",
                "Authorization" : "Bearer " + localStorage.getItem("jwt")

            },
            body: JSON.stringify({
                query,
            })
        }).then(res => res.json())
        .then(data=>{
            if(data.error){
                M.toast({html: data.error,classes: "#b71c1c red darken-4"})

            }
            else{
                setUsers(data)

                // M.toast({html: 'Successfully Signed In', classes: "#43a047 green darken-1"})
                // history.push('/')
            }
        }).catch((err) => {
            console.log(err)
        }) 
        
    }
    const renderList = () => {
        if(user){
            return [
                <li key ="search"><i data-target="modal1" className="modal-trigger large material-icons black-icon">search</i> </li>,
                <li key="profile"><Link to="/profile" className="nav-font" >Profile</Link></li>,
                <li  key="subscriberPosts"><Link to="/subscriberPosts" className="nav-font">My Following Posts</Link></li>,
                <li  key="myPosts"><Link to="/myPosts" className="nav-font">My Posts</Link></li>,
                <li key="createPost"><Link to="/createPost" className="nav-font" >Create Post</Link></li>,
                <li key ="updatePost"><Link to="/updateCV" className="nav-font" >Update CV</Link></li>,
                <li key="signOut">
                    <button className="btn waves-effect #00b0ff light-blue accent-3" type="submit"
                    onClick={()=>{
                        localStorage.clear()
                        dispatch({type:"CLEAR"})
                        history.push('/signIn')
                    }} >
                        Sign Out
                    </button>
                </li>
            ]
        }
        else{
            return [
                <li key="signUp"><Link to="/signUp" className="nav-font">SignUp</Link></li>,
                <li key="signIn"><Link to="/signIn" className="nav-font">SignIn</Link></li>
                    
            ]
        }
    }
    return (
        <nav>
            <div className="nav-wrapper white nav-padding">
                <Link to={state ? "/" : "/signIn"} className="brand-logo insta-font">TechInsta</Link>
                <ul id="nav-mobile" className="right hide-on-med-and-down">
                    {renderList()}

                </ul>
            </div>
            {/* <!-- Modal Structure --> */}
            <div id="modal1" className="modal black-icon" ref = {searchModal}>
            
                <div className="modal-content">
                
                    <input type="text" placeholder="search user"className="input-feild"
                    value ={search} onChange={(e) => {
                        fetchUsers(e.target.value)}
                    }></input>
                    <ul className="collection">
                        {users.map(item=>{
                            return <Link 
                            onClick = {()=>{
                                M.Modal.getInstance(searchModal.current).close()
                                setSearch('')
                            }}
                            to={item._id == state._id ? "/profile":"/userProfile/"+item._id}>
                                <li className="collection-item full-width" key={item._id}>{item.email}</li>
                            </Link>

                        })}
                        

                    </ul>
                    
                </div>
                
                <div className="modal-footer">
                    
                    <button 
                    onClick={()=>setSearch('')}
                    className="modal-close waves-effect waves-green btn-flat">
                        Search
                    </button>
                </div>
            </div>
                    
        </nav>
    )
}

export default NavBar
