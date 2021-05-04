import React, {useEffect} from 'react'
import {Link, useHistory} from "react-router-dom"
import '../../App.css';
import {useState} from 'react'
import M from 'materialize-css'


const SignUp = () => {
    const history = useHistory()
    const [name,setName] = useState("")
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")
    const [image,setImage] = useState("")
    const [url,setUrl]=useState(undefined)
    useEffect(() => {
        if(url){
            uploadFields()
        }
    }, [url])

    const uploadFields = () =>{
                //email validation
                if (email !== "" && ! /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)){
                    return M.toast({html: 'Please enter a valid mail',classes: "#b71c1c red darken-4"})
                }
                fetch("/signUp", {
                    method: "post",
                    headers:{
                        "Content-Type":"application/json"
                    },
                    body: JSON.stringify({
                        name:name,
                        email:email,
                        password:password,
                        profilePicture:url
                    })
                }).then(res => res.json())
                .then(data=>{
                    if(data.error){
                        M.toast({html: data.error,classes: "#b71c1c red darken-4"})
        
                    }
                    else{
                        M.toast({html: 'Successfully Signed Up', classes: "#43a047 green darken-1"})
                        history.push('/signIn')
                    }
                }).catch((err) => {
                    console.log(err)
                })  
                
        
            
    }
    const signMeUp = ()=>{
        if(image){
            uploadProfilePic()
        }
        else{
            uploadFields()
        }

    }
    const uploadProfilePic = () =>{
        
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
            uploadFields()
        }

    }
    return (
        <div className="my-card">
            <div className="card auth-card input-field">
                <h2 className="insta-font">TechInsta</h2>
                <input type="text" placeholder="email" className="input-feild"
                value ={email} onChange={(e) => {
                    setEmail(e.target.value)}
                }></input>
                <input type="text" placeholder="user name"className="input-feild" 
                value ={name} onChange={(e) => {
                    setName(e.target.value)}
                }></input>
                <input type="password" placeholder="password"className="input-feild"
                value ={password} onChange={(e) => {
                    setPassword(e.target.value)}
                }></input>

                <div className="file-field input-field">
                    <div className="btn #00b0ff light-blue accent-3">
                        <span>Upload Profile Picture</span>
                        <input type="file" placeholder="upload image"
                        onChange={(e) => {
                            setImage(e.target.files[0])}
                        }/>
                    </div>
                    <div className="file-path-wrapper">
                        <input className="file-path validate" type="text" />
                    </div>
                </div>

                <br></br>
                <Link to="/signIn">
                    <h6 className="nav-link">Already have an account?</h6>
                </Link>
                

                <br></br>
                <button className="btn waves-effect #00b0ff light-blue accent-3 button-customize" type="submit" 
                 onClick={()=>signMeUp()}>
                    SignUp
                </button>

            </div>
        </div>
    )
}

export default SignUp
