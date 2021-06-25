// import './App.css';
import { useEffect, createContext, useReducer, useContext } from "react";
import NavBar from "./Components/Navbar";
import { Route,Switch, useHistory } from "react-router-dom";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import Profile from "./Pages/Profile";
import Home from "./Pages/Home";
import AllUsers from "./Pages/AllUsers";
import Postphoto from "./Pages/Postphoto";
import UserProfile from "./Pages/UserProfile";
import { reducer,initialState } from "./reducers/userReducer";

export const UserContext= createContext()

const Routing=()=>{
  const history=useHistory();
  const {state,dispatch}=useContext(UserContext)
  useEffect(()=>{
    const user= JSON.parse(localStorage.getItem("PoloroidUser"))
    if(user){
      dispatch({type:"USER",payload:user})
      // history.push('/')
    }else{
      history.push('/login')
    }
  },[])
  return(
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <Route exact path="/allusers">
        <AllUsers/>
      </Route>
      <Route exact path="/signup">
        <Signup />
      </Route>
      <Route exact path="/login">
        <Login />
      </Route>
      <Route exact path="/postPhoto">
        <Postphoto />
      </Route>
      <Route exact path="/profile">
        <Profile/>
      </Route>
      <Route exact path="/profile/:userId">
        <UserProfile/>
      </Route>
    </Switch>
  )
}
function App() {
  const [state,dispatch] = useReducer(reducer,initialState)
  return (
    <UserContext.Provider value={{state,dispatch}}>
      <NavBar />
      <Routing/>
    </UserContext.Provider>
  );
}

export default App;
