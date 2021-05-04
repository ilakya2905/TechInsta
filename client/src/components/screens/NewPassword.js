import React from 'react'
import {Link, useHistory, useParams} from "react-router-dom"
import '../../App.css';
import {useState} from 'react'
import M from 'materialize-css'

const NewPassword = () => {
    const history = useHistory()
    const [password,setPassword] = useState("")
    const {token} = useParams()
    const updatePassword = ()=>{
       
        fetch("/updatePassword", {
            method: "post",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                password:password,
                token
            })
        }).then(res => res.json())
        .then(data=>{
            if(data.error){
                M.toast({html: data.error,classes: "#b71c1c red darken-4"})

            }
            else{
               
                M.toast({html: 'Successfully Updated', classes: "#43a047 green darken-1"})
                history.push('/signIn')
            }
        }).catch((err) => {
            console.log(err)
        }) 
        

    }
    return (
        <div className="my-card">
            <div className="card auth-card input-field">
                <h2 className="insta-font">TechInsta</h2>
                <input type="password" placeholder="new password"className="input-feild"
                value ={password} onChange={(e) => {
                    setPassword(e.target.value)}
                }></input>

                <br></br>
                <button className="btn waves-effect #00b0ff light-blue accent-3 button-customize" type="submit"
                onClick={()=>updatePassword()} >
                    Reset password
                </button>

            </div>
        </div>
    )
}

export default NewPassword
