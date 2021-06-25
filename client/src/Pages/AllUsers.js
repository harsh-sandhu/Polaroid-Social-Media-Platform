import Post from "../Components/Post";
import { useState, useEffect, useContext } from "react";
import { UserContext } from "../App";
import ClipLoader from "react-spinners/ClipLoader";
const AllUsers = () => {
  const [data, setData] = useState([]);
  const {state,dispatch}=useContext(UserContext);
  const [loading,setLoading]=useState(true)
  const load=()=>{
      setInterval(() => {
          setLoading(false);
          return true;
      }, 5000);
      return true;
  }
  useEffect(() => {
    fetch("/allpost", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("PoloroidJwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        setData(result.posts);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  return (
    <div>
      {load()&&data.length>0?data.map((item) => {
        return (
          <Post
            key={item._id}
            id={item._id}
            likes={item.likes.length}
            liked={item.likes.includes(state._id)}
            comments={item.comments}
            photo={item.photo}
            title={item.title}
            caption={item.caption}
            postedBy={item.postedBy?item.postedBy:""}
            name={item.postedBy?item.postedBy.name:""}
            profilepic={item.postedBy?item.postedBy.profilepic:""}
          />
        );
      }):loading?<div className="m-auto mt-5" style={{width:'50vw',marginLeft:'25vw'}}><ClipLoader color={"cyan"} loading={loading} size='50vw' /></div>:<div style={{textAlign:'center',marginTop:'20vh'}}><h1>No Posts found..</h1><h3>Some Error occured :( ...</h3></div>}
    </div>
  );
};
export default AllUsers;
