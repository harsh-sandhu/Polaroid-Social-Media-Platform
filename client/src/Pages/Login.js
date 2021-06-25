import classes from "./form.module.css"
import { useState,useContext } from "react";
import {useHistory} from "react-router-dom"
import { UserContext } from "../App";
import ClipLoader from "react-spinners/ClipLoader";
const Login = () => {
  const {state,dispatch}=useContext(UserContext)
  const history=useHistory();
  const [loading, setLoading] = useState(false);
  const load = () => {
    setInterval(() => {
      setLoading(false);
      return true;
    }, 5000);
    return true;
  };
  const [user,setUser]=useState({
    email:"",password:""
  })
  let name,value;
  const handleInput=(e)=>{
    name=e.target.name;
    value=e.target.value;
    setUser({...user, [name]:value})
  }
  const postData= async(e)=>{
      e.preventDefault();
      setLoading(true);
      load();
      const {email,password} = user;
      const res= await fetch("/login",{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({
          email,password
        })
      });
      const data= await res.json();
      if(res.status===422|| !data){
        window.alert("Login Failed:"+data.error);
      }else{
        localStorage.setItem("PoloroidJwt",data.token)
        localStorage.setItem("PoloroidUser",JSON.stringify(data.user))
        dispatch({type:"USER",payload:data.user})
        window.alert("Login Successful")
        history.push("/")
      }
  }
  return (
    <div className={`${classes.formresp} m-auto card mt-5`}>
      <div>
        <img src="http://mfikri.com/assets/images/2daf41c4936625cbc476cbb338d92172.png" className="img-fluid"></img>
      </div>
      {loading?<div
          className="m-auto mt-5"
          style={{ width: "50vw", marginLeft: "25vw" }}
        >
          <ClipLoader color={"cyan"} loading={loading} size="30vw" />
        </div>:<form>
        <div class="mb-3 card-body">
          <label htmlFor="exampleInputEmail1" class="form-label">
            Email address
          </label>
          <input
            type="email"
            name="email"
            class="form-control"
            id="exampleInputEmail1"
            value={user.name} 
            onChange={handleInput}
            // aria-describedby="emailHelp"
          />
          {/* <div id="emailHelp" class="form-text">
                We'll never share your email with anyone else.
              </div> */}
        </div>
        <div class="mb-3 card-body">
          <label htmlFor="exampleInputPassword1" class="form-label">
            Password
          </label>
          <input
            type="password"
            name="password"
            class="form-control"
            id="exampleInputPassword1"
            value={user.name} 
            onChange={handleInput}
          />
        </div>
        <div className="card-body">
          <button type="submit" class="btn btn-primary w-100" onClick={postData}>
            Log In
          </button>
        </div>
      </form>}
    </div>
  );
};
export default Login;
