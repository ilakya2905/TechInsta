import React from 'react'
import {Link, useHistory} from "react-router-dom"
import '../../App.css';
import {useState, useContext} from 'react'
import M from 'materialize-css'

const ResetPassword = () => {
    const history = useHistory()
    const [email,setEmail] = useState("")
    const signMeIn = ()=>{
        //email validation
        if (email !== "" && ! /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)){
            return M.toast({html: 'Please enter a valid mail',classes: "#b71c1c red darken-4"})
        }
        fetch("/resetPassword", {
            method: "post",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                email:email,
            })
        }).then(res => res.json())
        .then(data=>{
            if(data.error){
                M.toast({html: data.error,classes: "#b71c1c red darken-4"})

            }
            else{
                M.toast({html: 'Check your email to reset password', classes: "#43a047 green darken-1"})
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
                <input type="text" placeholder="email" className="input-feild"
                value ={email} onChange={(e) => {
                    setEmail(e.target.value)}
                }></input>

                <br></br>
                <button className="btn waves-effect #00b0ff light-blue accent-3 button-customize" type="submit"
                onClick={()=>signMeIn()} >
                    Confirm Mail
                </button>

            </div>
        </div>
    )
}

export default ResetPassword
