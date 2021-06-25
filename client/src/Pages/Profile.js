import classes from "./form.module.css";
import { useEffect, useState, useContext } from "react";
import { UserContext } from "../App";
const Profile = () => {
  const [pic, setPic] = useState([]);
  const [img,setImg]=useState("");
  const [url,setUrl]=useState("");
  const { state, dispatch } = useContext(UserContext);
  useEffect(() => {
    fetch("/mypost", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("PoloroidJwt"),
        user: localStorage.getItem("PoloroidUser"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setPic(result.myposts);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  useEffect(() => {
    if(url){
      localStorage.setItem("PoloroidUser",JSON.stringify({...state,profilepic:url}))
      dispatch({type:"UPDATEPIC",payload:url})
      updatePicAtServer()
    }
  }, [url])
  const updatePicAtServer=()=>{
    fetch('/updatepic',{
      method:'put',
      headers:{
        'Content-Type':"application/json",
        Authorization: "Bearer " + localStorage.getItem("PoloroidJwt"),
      },
      body:JSON.stringify({
        profilepic:url
      })
    }).then(res=>res.json())
    .then(result=>{
      console.log(result)
    }).catch(err=>{
      console.log(err);
    })
  }
  const updateProfilepic=(e)=>{
    e.preventDefault();
      const data= new FormData();
      data.append("file",img)
      data.append("upload_preset","polaroid")
      data.append("cloud_name","Polaroid")
      console.log("before fetching")
      fetch('https://api.cloudinary.com/v1_1/polaroid/image/upload',{
          method:'POST',
          body:data
      })
      .then(res=>res.json())
      .then(data=>{
        console.log("fetched")
        setUrl(data.url)
      }).catch(err=>{
        console.log(err)
      })
  }
  return (
    <div className="container mt-5 d-flex justify-content-center">
      <div className={`${classes.card} p-3`}>
        <div className={`d-flex align-items-center ${classes.flex}`}>
          <div className="image rounded m-2">
            <a
              // className="btn btn-primary"
              data-bs-toggle="collapse"
              href="#collapseExample"
              role="button"
              aria-expanded="false"
              aria-controls="collapseExample"
            >
              <img
                src={state ? state.profilepic : "Loading"}
                className="rounded"
                width="155"
                alt="profile pic"
              />
            </a>
          </div>
          <div className="ml-3 w-100 mt-2">
            <h4 className="mb-0 mt-0 ms-2">{state ? state.name : "loading..."}</h4>
            {console.log(state)}
            <p className={`${classes.mail} ms-2`}>
            {state ? state.email : "loading..."}
            </p>
            <div
              className={`p-2 mt-2 bg-primary d-flex justify-content-between rounded text-white ${classes.stats}`}
            >
              <div className="d-flex flex-column">
                {" "}
                <span className={`${classes.articles}`}>Post</span>{" "}
                <span className={`${classes.number1}`}>{pic.length}</span>{" "}
              </div>
              <div className="d-flex flex-column">
                {" "}
                <span className={`${classes.followers}`}>Followers</span>{" "}
                <span className={`${classes.number2}`}>
                  {state ? state.followers.length : 0}
                </span>{" "}
              </div>
              <div className="d-flex flex-column">
                {" "}
                <span className={`${classes.rating}`}>Following</span>{" "}
                <span className={`${classes.number3}`}>
                  {state ? state.following.length : 0}
                </span>{" "}
              </div>
            </div>
            {/* <div className="button mt-2 d-flex flex-row align-items-center">
              <button className="btn btn-sm btn-outline-primary w-100">Chat</button>{" "}
              <button className="btn btn-sm btn-primary w-100 ml-2">Follow</button>{" "}
            </div> */}
          </div>
        </div>
        <div className="collapse" id="collapseExample">
          <div className="card card-body">
            <div className="card-body">
              <label htmlFor="formFile" className="form-label mx-2">
                Update Profile Photo
              </label>
              <input
                className="form-control"
                name="image"
                type="file"
                id="formFile"
                accept="image/*"
                onChange={(e) => setImg(e.target.files[0])}
              />
            </div>
            <div className="card-body">
              <button
                type="submit"
                className="btn btn-primary w-100"
                onClick={updateProfilepic}
              >
                Upload Profile picture
              </button>
            </div>
          </div>
        </div>
        <hr />
        <div>
          <div className="container m-auto ">
            <div className="row text-center text-lg-left">
              {pic.map((item) => {
                return (
                  <div className="col-lg-8 col-md-10 col-12 m-auto">
                    <a href="#" className="d-block mb-4 h-100">
                      <img
                        key={item._id}
                        className="img-fluid img-thumbnail"
                        src={item.photo}
                        alt={item.title}
                      />
                    </a>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Profile;
