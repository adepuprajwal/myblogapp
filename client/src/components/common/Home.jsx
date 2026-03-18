import {useContext, useEffect, useState} from 'react'
import {userAuthorContextObj} from '../../contexts/UserAuthorContext'
import {useUser} from '@clerk/clerk-react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Home() {

  const navigate = useNavigate();
  const [error,setError] = useState("");
  const {currentUser,setCurrentUser} = useContext(userAuthorContextObj);
  const {isSignedIn,user,isLoaded} = useUser();

  console.log("User:",user);

  useEffect(()=>{
    setCurrentUser({
      // Console log the user data and fine these names
      ...currentUser,
      firstName:user?.firstName,
      lastName:user?.lastName,
      email:user?.emailAddresses[0].emailAddress,
      profileImageUrl:user?.imageUrl
    })
  },[isLoaded])

  useEffect(()=>{
    if( currentUser?.role === "user" && error.length ===0 ){
      navigate(`/user-profile/${currentUser.email}`);
    }
    if( currentUser?.role === "author" && error.length === 0 ){
      console.log("first")
      navigate(`/author-profile/${currentUser.email}`);
    }
  },[currentUser])

  // console.log(currentUser);

  async function onSelectRole(e){
    setError('');
    console.log(currentUser);
    const selectedRole = e.target.value ;
    console.log("selected role:"+selectedRole)
    currentUser.role=selectedRole ;
    console.log(currentUser);
    let res = null ;
    try {
      
    if(selectedRole==='author'){
      res=await axios.post('http://localhost:3000/author-api/author',currentUser)
      let {message,payload}=res.data ;
      if(message==='author'){
        setCurrentUser({...currentUser,...payload})
        // set session data
        localStorage.setItem("currentUser",JSON.stringify(payload));
      }else{
        setError(message)
      }
    }
    if(selectedRole==='user'){
      res=await axios.post('http://localhost:3000/user-api/user',currentUser)
      let {message,payload}=res.data ;
      console.log(payload);
      if(message==='user'){
        setCurrentUser({...currentUser,...payload})
        localStorage.setItem("currentUser",JSON.stringify(payload));
      }else{
        setError(message);
      }
    }
    }catch (err){
      setError(err.message);
    }

  }

  return (
    <div>
      {
        isSignedIn===false && <div>
          <h1 className="display-2 text-primary text-center">Blog App</h1>
        </div>
      }
      {
        isSignedIn===true && 
        <div className='card mx-auto my-4 p-3' style={{width:'20rem'}} >
          <img src={user.imageUrl} className='card-img-top rounded-circle' alt="" />
          <div className="card-body">
            <h5 className="card-title">{user.firstName}</h5>
          <p className="card-text">{user.emailAddresses[0].emailAddress}</p>
          <p className="card-text fs-5">Select role</p>
          </div>
        {
          error.length != 0 && (
            <p className="card-text fs-5 text-danger m-auto"
            >
              {error}
            </p>
          )
        }

        <div className="card-body bg-light justify-content-center d-flex">
          <div className="form-check mx-3">
            <input type="radio" name="role" id="author" value="author" className='form-check-input' onChange={onSelectRole} />
            <label htmlFor="author" className='form-check-label' >Author</label>
          </div>
          <div className="form-check mx-3">
            <input type="radio" name="role" id="user" value="user" className="form-check-input" onChange={onSelectRole} />
            <label htmlFor="user" className='form-check-label'>User</label>
          </div>
        </div>
      </div>
      }
    </div>
  )
}

export default Home