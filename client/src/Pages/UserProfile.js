import classes from "./form.module.css";
import { useEffect,useState,useContext } from "react";
import { UserContext } from "../App";
import { useParams } from "react-router-dom";
import Profile from "./Profile";
const UserProfile = () => {
  const [profile,setProfile]= useState(null)
  const {state,dispatch}=useContext(UserContext)
  const {userId}=useParams()
  const [follow,setFollow]=useState(state?!state.following.includes(userId):true)
  useEffect(() => {
    fetch(`/user/${userId}`,{
      headers:{
          'Authorization':"Bearer "+localStorage.getItem("PoloroidJwt"),
          'user':localStorage.getItem("PoloroidUser")
      }
    }).then(res=>res.json())
    .then(result=>{
        
        setProfile(result)
    }).catch(err=>{
        console.log(err)
    })
  }, [])
  const followUser=()=>{
    fetch("/follow", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("PoloroidJwt"),
      },
      body: JSON.stringify({
        followId: userId,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result)
        dispatch({type:"UPDATE",payload:{following:result.following,followers:result.followers}})
        localStorage.setItem('PoloroidUser',JSON.stringify(result))
        setProfile((prevState)=>{
          return{
            ...prevState,
            user:{
              ...prevState.user,
              followers:[...prevState.user.followers,result._id]
            }
          }
        })
        setFollow(false);
      })
  }
  const unfollowUser=()=>{
    fetch("/unfollow", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("PoloroidJwt"),
      },
      body: JSON.stringify({
        unfollowId: userId,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result)
        dispatch({type:"UPDATE",payload:{following:result.following,followers:result.followers}})
        localStorage.setItem('PoloroidUser',JSON.stringify(result))
        setProfile((prevState)=>{
          const newList=prevState.user.followers.filter(follower=>follower!=result._id)
          return{
            ...prevState,
            user:{
              ...prevState.user,
              followers:newList
            }
          }
        })
        setFollow(true);
      })
  }
  return (
    <>{profile?
    <div class="container mt-5 d-flex justify-content-center">
      <div class={`${classes.card} p-3`}>
        <div class={`d-flex align-items-center ${classes.flex}`}>
          <div class="image rounded m-2">
            <img
              src={profile.user?profile.user.profilepic:"loading"}
              class="rounded"
              width="155"
              alt="User Profile Pic"
            />
          </div>
          <div class="ml-3 w-100 mt-2">
            <h4 class="mb-0 mt-0 ms-2">{profile.user?profile.user.name:"loading..."}</h4>
            <p class={`${classes.mail} ms-2`}>
            {profile.user?profile.user.email:"loading..."}
            </p>
            <div
              class={`p-2 mt-2 bg-primary d-flex justify-content-between rounded text-white ${classes.stats}`}
            >
              <div class="d-flex flex-column">
                {" "}
                <span class={`${classes.articles}`}>Post</span>{" "}
                <span class={`${classes.number1}`}>{profile.user?profile.posts.length:"??"}</span>{" "}
              </div>
              <div class="d-flex flex-column">
                {" "}
                <span class={`${classes.followers}`}>Followers</span>{" "}
                <span class={`${classes.number2}`}>{profile.user.followers.length}</span>{" "}
              </div>
              <div class="d-flex flex-column">
                {" "}
                <span class={`${classes.rating}`}>Following</span>{" "}
                <span class={`${classes.number3}`}>{profile.user.following.length}</span>{" "}
              </div>
            </div>
            <div class="button mt-2 d-flex flex-row align-items-center">
              {!follow?<button class="btn btn-sm btn-outline-primary w-100" onClick={()=>unfollowUser()}>Unfollow</button>:
              <button class="btn btn-sm btn-primary w-100 ml-2" onClick={()=>followUser()}>Follow</button>}
            </div>
          </div>
        </div>
        <hr />
        {/* posts */}
        <div>
          <div class="container m-auto ">
            <div class="row text-center text-lg-left">
              {profile.posts?
                profile.posts.map((item)=>{
                  return(<div class="col-lg-8 col-md-10 col-12 m-auto">
                    <a href="#" class="d-block mb-4 h-100">
                        <img
                        key={item._id}
                        class="img-fluid img-thumbnail"
                        src={item.photo}
                        alt={item.title}
                      />
                    </a>
                  </div>)
                }):"No post"
              }
            </div>
          </div>
        </div>
      </div>
    </div>
    :<h1>Loading....</h1>}
    </>
  );
};
export default UserProfile;
