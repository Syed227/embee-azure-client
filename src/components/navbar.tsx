import logo from '../assets/logo.svg'
import Auth from './authControl'





type Props = { isLoggedIn: boolean; setIsLoggedIn: (loggedIn: boolean) => void; };


export default function Nav({isLoggedIn, setIsLoggedIn }: Props){
  
    return(
        <div className='p-3'>
              <div className="navbar flex justify-between">
            <div className=''>
            <img src={logo} width="170" height="170" className="d-inline-block align-top px-3" alt=""/>
            </div>
            <div>
            <Auth isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
            </div>

    
  
  </div>
  <hr/>
        </div>
      
    )
}