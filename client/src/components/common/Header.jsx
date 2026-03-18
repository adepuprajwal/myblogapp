import {useContext} from 'react'
import { Link,useNavigate } from 'react-router-dom'
import { useClerk,useUser } from '@clerk/clerk-react'
import { userAuthorContextObj } from '../../contexts/UserAuthorContext'

function Header() {

  const {signOut} = useClerk(); 
  const {currentUser,setCurrentUser}=useContext(userAuthorContextObj);
  const navigate=useNavigate();
  const {isSignedIn,user}=useUser();

  // function to signout
  async function handleSignout(){
    await signOut();
    setCurrentUser(null);
    navigate('/');
    localStorage.clear();
  }

  return (
    <div>
      <nav className='navbar navbar-expand-lg navbar-light bg-light' >
        <a href="#" className="navbar-brand mx-4">Blog-App</a>

        {/* Toggle button for mobile view */}
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
      </button> 

        <div className='collapse navbar-collapse'id='navbar-text' >
        
        <ul className="navbar-nav ms-auto px-4">
        {
          !isSignedIn ?
          <>
          <li className='nav-item active' >
          <Link className='nav-link fs-5' to='' >Home</Link>
        </li>
        <li className='nav-item active' >
          <Link className='nav-link fs-5'  to='signin'>Signin</Link> 
        </li>
        <li className='nav-item active' >
          <Link className='nav-link fs-5'  to='signup'>Signup</Link>
        </li>
          </>:
          <nav className='navbar navbar-light bg-light' >
            <div style={{position:'relative'}} >
              <img src={user.imageUrl} width="30px" height="30px" className='rounded-circle d-inline-block align-top' alt="profile pic" />
            {/* <p className='role' style={{position:'absolute',top:"0px",right:"-20px"}} >{currentUser.role}</p> */}
            </div>
            <p className="mb-0 user-name">{user.firstName}</p>
            <button className="signout mx-2 text-white" style={{backgroundColor:'#3674B5'}} onClick={handleSignout} >Signout</button>
          </nav>
        }
        </ul>

      </div>
      </nav>
    </div>
  )
}

export default Header