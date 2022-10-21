import { Button } from '@mui/material'
import React from 'react'
import { storage, db } from './firebase';
import firebase from 'firebase';
import './ImageUpload.css'


export default function ImageUpload({username}){

    const [caption, setCaption] = React.useState('');
    const [image, setImage] = React.useState(null);
    const [progress, setProgress] = React.useState(0);

    const handleUpload = () => {
        const uploadTask = storage.ref(`image/${image.name}`).put(image)

        uploadTask.on(
            "state_change",
            (snapshot) => {
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                    setProgress(progress)
                },
            (error) =>{
                console.log(error)
                alert(error.message)
            },
            () => {
                storage
                .ref("images")
                .child(image.name)
                .getDownloadURL()
                .then(url => {
                    db.collection("posts").add({
                        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                        caption: caption,
                        imageUrl: url,
                        avatarImg: null,
                        username: username
                    })
                setProgress(0);
                setCaption("");
                setImage(null);
            })
            }
        )
    }

    const handleChange = (e) => {
        if(e.target.files[0]){
            setImage(e.target.files[0])
        }
    }

    return (
        <div className='imageupload'>
            <progress className='imageupload__progress' value={progress} max="100"/>
            <input type="text" placeholder='Enter a caption...'onChange={event => setCaption(event.target.value)} value={caption}/>
            <input type="file" onChange={handleChange} />
            <Button onClick={handleUpload}>
                Upload
            </Button>
        </div>
    )
}