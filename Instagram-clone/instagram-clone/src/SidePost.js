import React from "react";
import './SidePost.css'
import {Avatar} from "@mui/material";

export default function SidePost(props){
    return(
        <div className="side_post">
            <div className="sidePost__header">
            <Avatar className="sidepost__avatar" src={props.avatar}/>
            <h3 className="sidePost__username">{props.username}</h3>
            </div>
            
            <img className="sidePost__image" src={props.image} alt={props.key}/>
            
            <h4 className="caption">{props.caption}</h4>
        </div>
    )
}