import classes from "./form.module.css";
import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
const Signup = () => {
  const history = useHistory();
  const [img, setImg] = useState(undefined);
  const [url, setUrl] = useState(undefined);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cpassword, setCpassword] = useState("");
  const [loading, setLoading] = useState(false);
  const load = () => {
    setInterval(() => {
      setLoading(false);
      return true;
    }, 5000);
    return true;
  };
  useEffect(() => {
    if (url) {
      registerUser();
    }
  }, [url]);
  const uploadpic = () => {
    const data = new FormData();
    data.append("file", img);
    data.append("upload_preset", "polaroid");
    data.append("cloud_name", "Polaroid");
    fetch("https://api.cloudinary.com/v1_1/polaroid/image/upload", {
      method: "POST",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        setUrl(data.url);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const registerUser = async () => {
    const res = await fetch("/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
        cpassword,
        profilepic: url,
      }),
    });
    const data = await res.json();
    console.log(data);
    if (res.status === 422 || !data) {
      window.alert("Registeration Failed:" + data.error);
    } else {
      window.alert("Registeration Successful");
      history.push("/login");
    }
  };
  const postData = async (e) => {
    setLoading(true);
    load();
    e.preventDefault();
    if (img) {
      uploadpic();
    } else {
      registerUser();
    }
  };
  return (
    <div className={`${classes.formresp} m-auto card mt-3`}>
      {loading?<div
          className="m-auto mt-5"
          style={{ width: "50vw", marginLeft: "25vw" }}
        >
          <ClipLoader color={"cyan"} loading={loading} size="30vw" />
        </div>:<form method="POST">
        <div class=" card-body">
          <label htmlFor="exampleInputEmail1" class="form-label">
            Profile Name
          </label>
          <input
            type="text"
            name="name"
            class="form-control"
            id="userName"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div class=" card-body">
          <label htmlFor="exampleInputEmail1" class="form-label">
            Email address
          </label>
          <input
            type="email"
            name="email"
            class="form-control"
            id="exampleInputEmail1"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            // aria-describedby="emailHelp"
          />
          {/* <div id="emailHelp" class="form-text">
            We'll never share your email with anyone else.
          </div> */}
        </div>
        <div class=" card-body">
          <label htmlFor="exampleInputPassword1" class="form-label">
            Password
          </label>
          <input
            type="password"
            name="password"
            class="form-control"
            id="exampleInputPassword1"
            aria-describedby="passwordHelpBlock"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div id="passwordHelpBlock" class="form-text">
            write a strong password
          </div>
        </div>
        <div class=" card-body">
          <label htmlFor="exampleInputPassword2" class="form-label">
            Confirm Password
          </label>
          <input
            type="password"
            name="cpassword"
            class="form-control"
            id="exampleInputPassword2"
            value={cpassword}
            onChange={(e) => setCpassword(e.target.value)}
          />
        </div>
        <div class=" card-body">
          <label htmlFor="formFile" class="form-label mx-2">
            Add your Profile Image
          </label>
          <input
            class="form-control"
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
            class="btn btn-primary w-100"
            onClick={postData}
          >
            Submit
          </button>
        </div>
      </form>}
    </div>
  );
};
export default Signup;
