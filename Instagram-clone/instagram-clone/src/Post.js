import React from "react";
import "./Post.css"
import {Avatar} from "@mui/material";
import { db } from "./firebase";
import firebase from "firebase";

export default function Post(props){
    const [comments, setComments] = React.useState([])
    const [comment, setComent] = React.useState('')

    React.useEffect(() => {
        let unsubscribe;
        if (props.postId) {
            unsubscribe = db
            .collection("posts")
            .doc(props.postId)
            .collection("comments")
            .orderBy('timestamp', 'asc')
            .onSnapshot((snapshoot) => {
                setComments(snapshoot.docs.map((doc) => doc.data()));
            });
        }
        return () => {
            unsubscribe();
        };
    
    }, [props.postId])

   const postComent = (event) => {
        event.preventDefault();

        db.collection("posts").doc(props.postId).collection("comments").add({
            text: comment,
            username: props.user.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        })
        setComent('');
   }

    return (
        <div className="post">
            <div className="post__header">
            <Avatar className="post__avatar" src={props.avatarImg}/>
            <h3 className="post__username">{props.username}</h3>
            </div>
            <img className="post__image" src={props.image} alt={props.key}/>
            <h4 className="post__text"> <strong>{props.username}:</strong> {props.caption}</h4>

            {
                <div className="post_coments">
                    {comments.map((comment) => (
                    <p>
                        <strong>{comment.username}</strong> {comment.text}
                    </p>
                    ))}
                </div>
            }

            <form className="post_comentBox">
                <input
                className="post_input"
                type="text"
                placeholder="Add comment..."
                value={comment}
                onChange={(e) => setComent(e.target.value)}
                />
                
                <button
                className="post_button"
                disabled={!comment}
                type="submit"
                onClick={postComent}>
                    Post
                </button>
                </form>
        </div>
    )
}