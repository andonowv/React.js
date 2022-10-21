import React from "react";
import { useState} from "react";
import './App.css';
import Post from "./Post";
import {auth, db} from "./firebase"
import {Box, Button, Modal, Typography} from "@mui/material";
import ImageUpload from "./ImageUpload";
import SidePost from "./SidePost";


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    backgroundColor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

function App() {

    const [posts, setPosts] = useState([])
    
    const [sidePosts, setSidePosts] = useState([])
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [email, setEmail] = React.useState(false);
    const [username, setUsername] = React.useState(false);
    const [password, setPassword] = React.useState(false);
    const [user, setUser] = React.useState(null);
    const [openSignIn, setOpenSignIn] = React.useState(false);

    React.useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((authUser) => {
            if(authUser){
                console.log(authUser);
                setUser(authUser);
            
            }else{
                setUser(null);
            }
        })
        return () => {
            unsubscribe();
        }
    }, [user, username]);


    // The posts were conected with firebase
     React.useEffect(() => {
         db.collection("posts").onSnapshot(snapshot => {
             setPosts(snapshot.docs.map(doc => ({
                 id: doc.id,
                 post : doc.data()
             })))
         })}, [posts])

     React.useEffect(() => {
         db.collection("SidePost").onSnapshot(snapshot => {
            setSidePosts(snapshot.docs.map(doc => ({
                id: doc.id,
                 post : doc.data()
             })))
             })}, [sidePosts])

        const signUp = (event) => {
                event.preventDefault();

                auth.createUserWithEmailAndPassword(email,password)
                .then((authUser) => {
                    return authUser.user.updateProfile({
                        displayName:username,
                    })
                })
                .catch((error) => alert(error.message))

                setOpen(false)
        }
        
        const signIn = (event) => {
            event.preventDefault();

            auth.signInWithEmailAndPassword(email, password)

            .catch((error) => alert(error.message))

            setOpenSignIn(false)
    }

  return (
      <div className="app">

    
      <div className="app__header">
        <img className="app__headerImage" src={"./logo.png"} alt="logo"/>

        {user ? (
                    <Button onClick={() => auth.signOut()}>Logout</Button>
                ): (
                    <div className="app__loginContainer">
                    <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
                    <Button onClick={() => setOpen(true)}>Sign Up</Button>
                    </div>
                )}
      </div>

          <Modal
              open={open}
              onClose={handleClose}
          >
              <Box sx={style}>
        
                  <center>
                  <form className="app__signup">
                  <img className="headerImage"
                  src="logo.png" alt="logo"/>
                <h4 className="app_register_caption">Регистрирайте се, за да виждате <br/> снимки и видеоклипове от ваши <br/> приятели.</h4>
                <img className="app__facebook" src= {"./Screenshot_1.png"} alt="facebook"/>
                <h4 className="app__or">ИЛИ</h4>
                <input 
                className="app__username"
                placeholder="Потребителско име"
                type="text"
                value={username}
                onChange={ (e) => setUsername(e.target.value)}
                />
                <input 
                className="app_name"
                placeholder="Пълнo име"
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                />

                <input 
                className="app_email"
                placeholder="Мобилен номер или имейл"
                type="text"
                value={email}
                onChange={ (e) => setEmail(e.target.value)}
                />

                <input 
                className="app_pass"
                placeholder="Парола"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                />
            
                  
                  <h3 className="text_bottom-signup">Хората, които използват нашата услуга, може да са качили      информацията ви за контакт в Instagram. Научете повече. <br/> <br/>

                    Когато се регистрирате, вие се съгласявате с нашите Условия. Научете как събираме, използваме и споделяме данните ви в нашата Политика за поверителност, както и как използваме бисквитките и сходни технологии в нашата Политика за бисквитки.
                    <br/><br/>
                    </h3>
                    <Button className="app_button_foward" type="submit" onClick={signUp}>Напред</Button>
                  </form>
                  </center>
                
              </Box>
          </Modal>

          <Modal
              open={openSignIn}
              onClose={() => setOpenSignIn(false)}
          >
              <Box sx={style}>
                  <center>
                  <form className="app__signup">
                  <img className="app_headerImage_signIn"
                  src="logo.png" alt="logo"/>
            
                <input 
                className="app_email"
                placeholder="Мобилен номер или имейл"
                type="text"
                value={email}
                onChange={ (e) => setEmail(e.target.value)}
                />

                <input 
                className="app_pass"
                placeholder="Парола"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                />
                <button className="app_signInButton" type="submit" onClick={signIn}>Вход</button>
                  </form>
                  </center>
              </Box>
          </Modal>
        <div className="posts">
        <div className="left_side_post">
          {posts.map(({id, post}) => (
                <Post key = {id} postId={id} user = {user} avatarImg = {post.avatarImg} username={post.username} image={post.image} caption={post.caption}/>
            ))}
            </div>

            <div className="right_side__posts">
          {sidePosts.map(({id, post}) => (
                <SidePost key = {id} avatar = {post.avatar} username={post.username} image={post.image} caption={post.caption}/>
            ))}
            </div>
            </div>

        
            
{user?.displayName ? (
            <ImageUpload username = {user.displayName}/>
        ) : (
            <h3></h3>
        )} 
    </div>
  );
}
export default App;
