//packages
import {BrowserRouter,Route, Switch,useHistory} from "react-router-dom"
import {createContext,useReducer,useEffect,useContext} from 'react'

//styling
import './App.css';

//components
import MyPosts from './components/screens/MyPosts'
import ResetPassword from './components/screens/ResetPassword'
import NewPassword from './components/screens/NewPassword'
import NavBar from './components/NavBar';
import Profile from './components/screens/Profile'
import SignUp from './components/screens/SignUp'
import SignIn from './components/screens/SignIn'
import Home from './components/screens/Home'
import CreatePost from './components/screens/CreatePost'
import UpdateCV from './components/screens/UpdateCV'
import {initialState,reducer} from './reducers/UserReducer'
import User from "./components/screens/User"
import SubscriberPosts from "./components/screens/SubscribedUserPosts"
import React from 'react'
export const UserContext = createContext()


const Routing = () => {
  const history = useHistory()
  const {dispatch} = useContext(UserContext)

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"))
    if(user){
      dispatch({type: "USER", payload:user})
    }
    else{
      if(!history.location.pathname.startsWith('/resetPassword') && !history.location.pathname.startsWith('/reset')){
        history.push('/signIn')
      }
    }
  }, [])
  return (
    <Switch>
      <Route exact path='/'>
          <Home></Home>
        </Route>
        <Route exact path='/profile'>
          <Profile/>
        </Route>
        <Route path='/signIn'>
          <SignIn/>
        </Route>
        <Route path='/signUp'>
          <SignUp/>
        </Route>
        <Route path='/createPost'>
          <CreatePost/>
        </Route>
        <Route path='/viewCV/:userId'>
          <UpdateCV />
        </Route>
        <Route path='/updateCV'>
          <UpdateCV />
        </Route>
        <Route path='/userProfile/:userId'>
          <User />
        </Route>
        <Route path="/subscriberPosts">
          <SubscriberPosts/>
        </Route>
        <Route path='/resetPassword'>
          <ResetPassword/>
        </Route>
        <Route exact path='/reset/:token'>
          <NewPassword />
        </Route>
        <Route path='/myPosts'>
          <MyPosts/>
        </Route>

    </Switch>
  )
}



function App() {
  const [state,dispatch] = useReducer(reducer, initialState)
  return (

    <UserContext.Provider value = {{state,dispatch}}>
      <BrowserRouter>
        <div className="App">
          <NavBar/>
          <Routing/>

        </div>
      </BrowserRouter>
    </UserContext.Provider>
    
  );
}

export default App;
