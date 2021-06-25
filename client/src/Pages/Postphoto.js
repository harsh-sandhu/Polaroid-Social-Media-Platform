import classes from "./form.module.css";
import { useState ,useEffect } from "react";
import {useHistory} from "react-router-dom"
import ClipLoader from "react-spinners/ClipLoader";
const Postphoto = () => {
  const history=useHistory();
  const [title,setTitle]=useState("");
  const [caption,setCaption]=useState("");
  const [img,setImg]=useState("");
  const [url,setUrl]=useState("");
  const [loading, setLoading] = useState(false);
  const load = () => {
    setInterval(() => {
      setLoading(false);
      return true;
    }, 15000);
    return true;
  };
  useEffect(()=>{
    if(url){
      fetch('/addPost',{
        method:"POST",
        headers:{
          "Content-Type":"application/json",
          "Authorization":"Bearer "+localStorage.getItem("PoloroidJwt")
        },
        body:JSON.stringify({
          title,caption,photo:url
        })
      }).then(res=>res.json())
      .then(data=>{
        if(data.error){
          window.alert(data.error)
        }else{
          setLoading(false)
          window.alert("Upload Successful")
        }
        console.log(data)
      }).catch(err=>{
        console.log(err)
      })
    }
  },[url])
  const postData= (e)=>{
      e.preventDefault();
      setLoading(true);
      load();
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
    <div className={`${classes.formresp} m-auto card mt-5`}>
      {loading?<div
          className="m-auto mt-5"
          style={{ width: "50vw", marginLeft: "25vw" }}
        >
          <ClipLoader color={"cyan"} loading={loading} size="30vw" />
        </div>:<form>
        <h3 className="card-body">Add a Post</h3>
        <div class="mb-3 card-body">
          <label htmlFor="exampleInputTitle1" class="form-label">
            Title
          </label>
          <input
            type="text"
            name="title"
            class="form-control"
            id="exampleInputTitle1"
            value={title} 
            onChange={(e)=>setTitle(e.target.value)}
            // aria-describedby="emailHelp"
          />
          {/* <div id="emailHelp" class="form-text">
                We'll never share your email with anyone else.
              </div> */}
        </div>
        <div class="mb-3 card-body">
          <label htmlFor="exampleInputCaption1" class="form-label">
            Caption
          </label>
          <input
            type="text"
            name="caption"
            class="form-control"
            id="exampleInputCaption1"
            value={caption} 
            onChange={(e)=>setCaption(e.target.value)}
            // aria-describedby="emailHelp"
          />
          {/* <div id="emailHelp" class="form-text">
                We'll never share your email with anyone else.
              </div> */}
        </div>
        <div class="mb-3 card-body">
          <label htmlFor="formFile" class="form-label mx-2">
            Add your Image file
          </label>
          <input class="form-control" name="image" type="file" id="formFile" accept="image/*"
            onChange={(e)=>setImg(e.target.files[0])} />
        </div>
        <div className="card-body">
          <button type="submit" class="btn btn-primary w-100" onClick={postData}>
            Upload Post
          </button>
        </div>
      </form>}
    </div>
  );
};
export default Postphoto;
