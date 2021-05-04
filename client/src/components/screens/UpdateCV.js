import React from 'react'
import {useHistory} from "react-router-dom"
import '../../App.css';
import {useState, useEffect,useContext} from 'react'
import {UserContext} from "../../App"
import M from 'materialize-css'
import {useParams} from "react-router-dom"


const  UpdateCV = () => {
    const {userId} = useParams()
    const {state, dispatch} = useContext(UserContext)
    const history = useHistory()
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [phoneNumber, setPhoneNumber] = useState("")
    const [bio,setBio] = useState("")
    const [skills,setSkills] = useState("")
    const [company, setCompany] = useState("")
    const [status,setStatus] = useState("")
    const [instagram,setInstagram] = useState("")
    const [facebook,setFacebook] = useState("")
    const [twitter,setTwitter] = useState("")
    const [youtube,setYoutube] = useState("")
    const [github,setGithub] = useState("")
    const[linkedIn,setLinkedIn] = useState("")
    const [experience, setExperience] = useState([
        {
            title:'',
            company: '',
            from: '',
            to: ''
        }
    ])
    const [education, setEducation] = useState([
        {
            school:'',
            degree: '',
            from: '',
            to: ''
        }
    ])

    useEffect(() => {
        let user = JSON.parse(localStorage.getItem('user'))
        if(userId){
            fetch(`/getUserProfile/${userId}`,{
                method:"get",
                headers:{
                    "Content-Type":"application/json",
                    "Authorization" : "Bearer " + localStorage.getItem("jwt")
                }
            }).then(res=> res.json())
            .then(result =>{
                let response = result.result[0]
                setBio(response.bio)
                setFirstName(response.firstName)
                setLastName(response.lastName)
                setStatus(response.status)
                setGithub(response.social.gitHub)
                setLinkedIn(response.social.linkedIn)
                response.social.instagram && setInstagram(response.social.instagram)
                response.social.facebook && setFacebook(response.social.facebook)
                response.social.youtube && setYoutube(response.social.youtube)
                response.social.twitter && setTwitter(response.social.twitter)

                response.phoneNumber && setPhoneNumber(response.phoneNumber)
                response.company && setCompany(response.company)
                setSkills(response.skills.toString())
                setEducation(response.education)
                setExperience(response.experience)
            }).catch((error)=>{
                console.log("errors",error)
            })
        }
        else if(user.isProfile){
            fetch('/getMyProfile',{
                method : "get",
                headers:{
                    "Authorization" : "Bearer " + localStorage.getItem("jwt")
                },
            }).then(res=>res.json())
            .then((result)=>{
                let response = result.result[0]
                setBio(response.bio)
                setFirstName(response.firstName)
                setLastName(response.lastName)
                setStatus(response.status)
                setGithub(response.social.gitHub)
                setLinkedIn(response.social.linkedIn)
                response.social.instagram && setInstagram(response.social.instagram)
                response.social.facebook && setFacebook(response.social.facebook)
                response.social.youtube && setYoutube(response.social.youtube)
                response.social.twitter && setTwitter(response.social.twitter)

                response.phoneNumber && setPhoneNumber(response.phoneNumber)
                response.company && setCompany(response.company)
                setSkills(response.skills.toString())
                setEducation(response.education)
                setExperience(response.experience)
            }).catch((error)=>{
                console.log("errors",error)
            })
        }
        else{
            setBio("")
            setFirstName("")
            setLastName("")
            setStatus("")
            setGithub("")
            setLinkedIn("")
            setInstagram("")
            setFacebook("")
            setYoutube("")
            setTwitter("")

            setPhoneNumber("")
            setCompany("")
            setSkills("")
            setExperience([
                {
                    title:'',
                    company: '',
                    from: '',
                    to: ''
                }
            ])
            setEducation([
                {
                    school:'',
                    degree: '',
                    from: '',
                    to: ''
                }
            ])     
        }
        
    }, [userId])


    const handleChangeInput =(index,e)=>{

        const values = [...experience];
        values[index][e.target.name] = e.target.value
        setExperience(values)
    }
    const addExperience = () =>{
        setExperience([...experience,{
            title:'',
            company: '',
            from: '',
            to: ''
        }])
    }
    const deleteExperience = (index) =>{
        const values = [...experience]
        values.splice(index,1)
        setExperience(values)
    }

    const handleEducation =(index,e)=>{

        const values = [...education];
        values[index][e.target.name] = e.target.value
        setEducation(values)
    }
    const addEducation = () =>{
        setEducation([...education,{
            school:'',
            degree: '',
            from: '',
            to: ''
        }])
    }
    const deleteEducation = (index) =>{
        const values = [...education]
        values.splice(index,1)
        setEducation(values)
    }

    const updateProfile =() =>{
        fetch('/createProfile',{
            method:"post",
            headers:{
                "Content-Type":"application/json",
                "Authorization" : "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                firstName,
                lastName,
                phoneNumber,
                bio,
                skills,
                status,
                company,
                instagram,
                linkedIn,
                gitHub:github,
                facebook,
                twitter,
                youtube,
                experience,
                education
            })
        }).then(res=>res.json())
        .then(result =>{
            if(result.errors){
                history.push('/')
                M.toast({html: result.errors,classes: "#b71c1c red darken-4"})
            }
            else{
                dispatch({
                    type: "PROFILE-UPDATE",
                    payload:{
                        isProfile : true
                    }
                })
                localStorage.setItem("user",JSON.stringify(result.result))
                history.push('/')
                M.toast({html: 'Successfully Posted', classes: "#43a047 green darken-1"})
            }

            
        }).catch(error=>{
            
            console.log(error)
        })
    }
    return (
        <div className="card create-post">
            { 
                !userId ? 
                <h2 className="insta-font">Update CV</h2>
                :             
                <h2 className="insta-font">View CV</h2>

            }
            <label className="labels">Personal Information</label>
            <div className="form-field-group">
                <input type="text" className="form-control input-feild" 
                placeholder="First name*" aria-label="First name"
                value={firstName}
                readOnly = {userId}
                onChange={(e) => {
                    setFirstName(e.target.value)}
                }/>
                &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp;

                <input type="text" className="form-control input-feild form" 
                placeholder="Last name*" aria-label="Last name" 
                value={lastName}
                readOnly = {userId}
                onChange={(e) => {
                    setLastName(e.target.value)}
                }/>
            </div>

            <input type="text" className="form-control input-feild form" 
                placeholder="Bio*" aria-label="Bio" value={bio}
                readOnly = {userId}
                onChange={(e) => {
                    setBio(e.target.value)}
                } />

            <input type="Number" className="form-control input-feild form" 
                placeholder="Phone Number" aria-label="Phone Number"
                value={phoneNumber}
                readOnly = {userId}
                onChange={(e) => {
                    setPhoneNumber(e.target.value)}
                } />

            <input type="text" className="form-control input-feild form" 
                placeholder="Skills*" aria-label="Skills" 
                value={skills}
                readOnly = {userId}
                onChange={(e) => {
                    setSkills(e.target.value)}
                }/>
            
            <div className="form-field-group">
                <input type="text" className="form-control input-feild" 
                placeholder="Current Status*" aria-label="Curreny Status"
                value={status}
                readOnly = {userId}
                onChange={(e) => {
                    setStatus(e.target.value)}
                }/>
                &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp;

                <input type="text" className="form-control input-feild form" 
                placeholder="Current Company/College/University" aria-label="Current Company/College/University" 
                value={company}
                readOnly = {userId}
                onChange={(e) => {
                    setCompany(e.target.value)}
                }/>
            </div>

            <label className="labels">Social-Network Links</label>

            <div className="form-field-group">
                <input type="text" className="form-control input-feild" 
                placeholder="GitHub*" aria-label="GitHub"
                value={github}
                readOnly = {userId}
                onChange={(e) => {
                    setGithub(e.target.value)}
                }/>
                &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp;

                <input type="text" className="form-control input-feild form" 
                placeholder="LinkedIn*" aria-label="LinkedIn" 
                value={linkedIn}
                readOnly = {userId}
                onChange={(e) => {
                    setLinkedIn(e.target.value)}
                }/>
            </div>

            <div className="form-field-group">
                <input type="text" className="form-control input-feild" 
                placeholder="FaceBook" aria-label="FaceBook"
                value={facebook}
                readOnly = {userId}
                onChange={(e) => {
                    setFacebook(e.target.value)}
                }/>
                &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp;

                <input type="text" className="form-control input-feild form" 
                placeholder="Instagram" aria-label="Instagram" 
                value={instagram}
                readOnly = {userId}
                onChange={(e) => {
                    setInstagram(e.target.value)}
                }/>
            </div>

            <div className="form-field-group">
                <input type="text" className="form-control input-feild" 
                placeholder="Twitter" aria-label="Twitter"
                value={twitter}
                readOnly = {userId}
                onChange={(e) => {
                    setTwitter(e.target.value)}
                }/>
                &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp;

                <input type="text" className="form-control input-feild form" 
                placeholder="YouTube" aria-label="YouTube" 
                value={youtube}
                readOnly = {userId}
                onChange={(e) => {
                    setYoutube(e.target.value)}
                }/>
            </div>

            <label className="labels">Experience</label>

            { experience.map((data,index)=>(
                <div key={index}>
                    <div className="form-field-group">
                        <input type="text" className="form-control input-feild" 
                        placeholder="Title*" aria-label="Title"
                        value={data.title} name="title"
                        readOnly = {userId}
                        onChange={e => handleChangeInput(index,e)}
                        />
                        &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp;

                        <input type="text" className="form-control input-feild form" 
                        placeholder="Company*" aria-label="Company"
                        value={data.company} name="company"
                        readOnly = {userId}
                        onChange={e => handleChangeInput(index,e)}
                        />
                    </div>
                    <div className="form-field-group">
                        <input type="text" className="form-control input-feild" 
                        placeholder="From (year)*" aria-label="From"
                        value={data.from} name="from"
                        readOnly = {userId}
                        onChange={e => handleChangeInput(index,e)}
                        />
                        &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp;

                        <input type="text" className="form-control input-feild form" 
                        placeholder="To (year/present) *" aria-label="To"
                        readOnly = {userId}
                        value={data.to} name="to"
                        onChange={e => handleChangeInput(index,e)}
                        />
                    </div>
                    {
                        !userId &&
                        <div className="experience">
                            <button 
                            className="btn waves-effect #00b0ff light-blue accent-3 experience-button"
                            type="submit"
                            onClick={()=>addExperience()} 
                            >
                                Add
                            </button>
                            &nbsp; &nbsp; 
                            { 
                                index!= 0 && 
                                <button 
                                className="btn waves-effect #00b0ff light-blue accent-3 experience-button" 
                                type="submit"
                                onClick={()=>deleteExperience(index)} 

                                >
                                    Delete
                                </button>
                            }
                        
                        </div>
                    }
                    

                    <hr></hr>
                </div>
                

            )
            )}
            <label className="labels">Education</label>

            { education.map((data,index)=>(
                <div key={index}>
                    <div className="form-field-group">
                        <input type="text" className="form-control input-feild" 
                        placeholder="Degree*" aria-label="Degree"
                        value={data.degree} name="degree"
                        readOnly = {userId}
                        onChange={e => handleEducation(index,e)}
                        />
                        &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp;

                        <input type="text" className="form-control input-feild form" 
                        placeholder="School/College/University*" aria-label="School/College/University"
                        value={data.school} name="school"
                        readOnly = {userId}
                        onChange={e => handleEducation(index,e)}
                        />
                    </div>
                    <div className="form-field-group">
                        <input type="number" className="form-control input-feild" 
                        placeholder="From (year)*" aria-label="From"
                        value={data.from} name="from"
                        readOnly = {userId}
                        onChange={e => handleEducation(index,e)}
                        />
                        &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp;

                        <input type="text" className="form-control input-feild form" 
                        placeholder="To (year/present) *" aria-label="To"
                        value={data.to} name="to"
                        readOnly = {userId}
                        onChange={e => handleEducation(index,e)}
                        />
                    </div>
                    {
                        ! userId &&
                        <div className="experience">
                            <button 
                            className="btn waves-effect #00b0ff light-blue accent-3 experience-button"
                            type="submit"
                            onClick={()=>addEducation()} 
                            >
                                Add
                            </button>
                            &nbsp; &nbsp; 
                            { 
                            index!= 0 && 
                                <button 
                                className="btn waves-effect #00b0ff light-blue accent-3 experience-button" 
                                type="submit"
                                onClick={()=>deleteEducation(index)} 

                                >
                                    Delete
                                </button>
                            }
                            
                        </div>

                    }


                    <hr></hr>
                </div>
                

            )
            )}

            {
                ! userId && 
                <button className="btn waves-effect #00b0ff light-blue accent-3 button-customize" 
                type="submit" 
                onClick={()=>updateProfile()}
                >
                    Submit Post
                </button>
            }
            

        </div>
    )
}

export default UpdateCV
