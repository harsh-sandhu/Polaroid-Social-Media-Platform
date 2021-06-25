import classes from "./Resp.module.css";
import { useState, useContext, useEffect } from "react";
import { UserContext } from "../App";
import { Link } from "react-router-dom";
const Post = (props) => {
  const { state, dispatch } = useContext(UserContext);
  const [like, setLike] = useState(props.liked);
  const [numLike, setNumLike] = useState(props.likes);
  const [comments, setComments] = useState(props.comments);
  const likeHander = (id) => {
    if (!like) {
      fetch("/like", {
        method: "put",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("PoloroidJwt"),
        },
        body: JSON.stringify({
          postId: id,
        }),
      })
        .then((res) => res.json())
        .then((result) => {
          setNumLike(result.likes.length);
        });
    } else {
      fetch("/unlike", {
        method: "put",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("PoloroidJwt"),
        },
        body: JSON.stringify({
          postId: id,
        }),
      })
        .then((res) => res.json())
        .then((result) => {
          setNumLike(result.likes.length);
        });
    }
    return setLike(!like);
  };
  const makeComment = (text, name, postId) => {
    fetch("/comment", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("PoloroidJwt"),
      },
      body: JSON.stringify({
        postId: postId,
        text: text,
        name: name,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        setComments(result.comments);
      });
  };
  const deletePost = (postId) => {
    fetch(`/deletePost/${postId}`, {
      method: "delete",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("PoloroidJwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        window.location.reload();
      });
  };

  return (
    <div className={`card ${classes.navbarResp} m-auto`}>
      <div className="card-body">
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Link style={{display:"flex",textDecoration:"none"}} to={`/profile/${props.postedBy!=null?props.postedBy._id:""}`}>
            <img
            src={props.profilepic?props.profilepic:""}
            className="rounded-circle m-1"
            width="35"
            height="35"
            alt="User Profile Pic"
          />
          <h3 style={{color:"black"}} className="ms-3">
            {props.name}
          </h3>
          </Link>
          {props.postedBy._id == state._id ? (
            <button
              onClick={() => deletePost(props.id)}
              type="button"
              className="btn btn-danger mb-2"
            >
              <i className="fas fa-trash-alt"></i>
            </button>
          ) : (
            <div></div>
          )}
        </div>
        <img src={props.photo} className="img-fluid"></img>
        <div>
          <h4 className="mt-1 mx-2">
            {!like ? (
              <i
                onClick={() => {
                  likeHander(props.id);
                }}
                className="far fa-heart"
              ></i>
            ) : (
              <i
                onClick={() => {
                  likeHander(props.id);
                }}
                className="fas fa-heart text-danger"
              ></i>
            )}
            {numLike}
          </h4>
          <h4 className="mt-3 mx-2">{props.title}</h4>
          <h6 className="mt-3 mx-2">{props.caption}</h6>
          <div>
            {comments.map((comment) => {
              console.log(comment);
              return (
                <h6 key={comment.name+comment.text+props.id} style={{ fontWeight: "400" }}>
                  <span style={{ fontWeight: "700" }}>{comment.name}: </span>
                  {comment.text}
                </h6>
              );
            })}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              makeComment(e.target[0].value, props.name, props.id);
              e.target[0].value = "";
            }}
          >
            <input
              type="text"
              className={`px-3 fst-italic mt-3 ${classes.comment}`}
              placeholder="add a comment"
            ></input>
          </form>
        </div>
      </div>
    </div>
  );
};
export default Post;
