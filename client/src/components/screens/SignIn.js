import React from 'react'
import {Link, useHistory} from "react-router-dom"
import '../../App.css';
import {useState, useContext} from 'react'
import M from 'materialize-css'
import {UserContext} from '../../App'

const SignIn = () => {
    const {state, dispatch} = useContext(UserContext)
    const history = useHistory()
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")
    const signMeIn = ()=>{
        //email validation
        if (email !== "" && ! /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)){
            return M.toast({html: 'Please enter a valid mail',classes: "#b71c1c red darken-4"})
        }
        fetch("/signIn", {
            method: "post",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                email:email,
                password:password
            })
        }).then(res => res.json())
        .then(data=>{
            if(data.error){
                M.toast({html: data.error,classes: "#b71c1c red darken-4"})

            }
            else{
                localStorage.setItem("jwt",data.token)
                localStorage.setItem("user",JSON.stringify(data.user))
                dispatch({type: "USER", payload:data.user})

                M.toast({html: 'Successfully Signed In', classes: "#43a047 green darken-1"})
                history.push('/')
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
                <input type="password" placeholder="password"className="input-feild"
                value ={password} onChange={(e) => {
                    setPassword(e.target.value)}
                }></input>
                <Link to="/resetPassword">
                    <h6 className="nav-link">Forget Password?</h6>
                </Link>

                <Link to="/signUp">
                    <h6 className="nav-link">Don't have an account?</h6>
                </Link>

                <br></br>
                <button className="btn waves-effect #00b0ff light-blue accent-3 button-customize" type="submit"
                onClick={()=>signMeIn()} >
                    SignIn
                </button>

            </div>
        </div>
    )
}

export default SignIn
