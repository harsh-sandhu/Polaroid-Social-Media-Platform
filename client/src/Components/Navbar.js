import classes from './Resp.module.css'
import {Link, useHistory} from 'react-router-dom'
import { useContext } from 'react'
import { UserContext } from '../App'
const NavBar=()=>{
  const {state,dispatch}= useContext(UserContext)
  const history=useHistory()
  const renderList=()=>{
    if(state){
      return[
        <li key="1" className={`nav-item ${classes.litem}`}>
            <Link className={`nav-link ${classes.link}`} to="/"><i className="fas fa-home"></i></Link>
          </li>,
          <li key="5" className={`nav-item ${classes.litem}`}>
          <Link className={`nav-link ${classes.link}`} to="/allusers"><i className="fas fa-globe-asia"></i></Link>
        </li>,
          <li key="2" className={`nav-item ${classes.litem}`}>
            <Link className={`nav-link ${classes.link}`} to="/profile"><i className="fas fa-user-circle"></i></Link>
          </li>,
          <li key="3" className={`nav-item ${classes.litem}`}>
          <Link className={`nav-link ${classes.link}`} to="/postPhoto"><i className="fas fa-plus-circle"></i></Link>
        </li>,
        <li key="4" className={`nav-item ${classes.litem}`}>
        <button className={`btn btn-light nav-link ${classes.link}`} style={{fontSize:'100%',marginTop:'-5px'}} onClick={()=>{
          localStorage.clear();
          history.push('/login')
          dispatch({type:'CLEAR'})
        }}><i className="fas fa-power-off"></i></button>
      </li>
      ]
    }else{
      return[
        <li key="5" className={`nav-item ${classes.litem}`}>
            <Link className={`nav-link ${classes.link}`} to="/login"><i className="fas fa-sign-in-alt"></i><h6>LogIn</h6></Link>
          </li>,
          <li key="6" className={`nav-item ${classes.litem}`}>
            <Link className={`nav-link ${classes.link}`} to="/signup"><i className="fas fa-user-plus"></i><h6>SignUp</h6></Link>
          </li>
      ]
    }
  }
    return(<nav className="navbar navbar-expand-lg navbar-light bg-light">
    <div className={`container h4 p-0 ${classes.navbarResp}`}>
      <a className="navbar-brand" href="#"><div className="h2">Polaroid</div></a>
      <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNavDropdown">
        <ul className={`navbar-nav ms-auto ${classes.ul}`}>
          {renderList()}
        </ul>
      </div>
    </div>
  </nav>)
}
export default NavBar;