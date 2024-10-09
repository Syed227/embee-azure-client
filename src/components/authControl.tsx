import { useEffect, useState } from 'react';
import pfp from '../assets/pfp.jpg';
import { useMsal } from '@azure/msal-react';

type Props = { 
  isLoggedIn: boolean; 
  setIsLoggedIn: (loggedIn: boolean) => void; 
};

export default function Auth({ isLoggedIn, setIsLoggedIn }: Props) {
  const [dropdown, setDropdown] = useState(false);
  const [lastLogin, setLastLogin] = useState<string | null>(null);
  const { instance, accounts } = useMsal();

  useEffect(() => {
    // Fetch last login time from local storage on component mount
    const storedLastLogin = window.localStorage.getItem('Last Login');
    console.log(`Stored last login time on mount: ${storedLastLogin}`); // Debugging log
    if (storedLastLogin) {
      setLastLogin(storedLastLogin);
    }
  }, []);

  function controlDropdown() {
    setDropdown(!dropdown);
  }

  function signOut() {
    instance.logoutRedirect().then(() => {
      setIsLoggedIn(false);
    });
  }

  function signIn() {
    const currentTime = new Date();
    const hoursIST = currentTime.getHours();
    const minutesIST = currentTime.getMinutes().toString().padStart(2, '0'); // Ensure minutes are two digits
    const formattedTime = `${hoursIST}:${minutesIST}`;
    console.log(`Calculated login time: ${formattedTime}`); // Debugging log
    window.localStorage.setItem('Last Login', formattedTime);
    setLastLogin(formattedTime);
    
    instance.loginRedirect({
      scopes: ['openid', 'profile', 'User.Read', 'User.Read.All'],
    }).then(() => {
      instance.acquireTokenSilent({
        scopes: ['User.Read', 'User.Read.All']
      }).then((response) => {
        const token = response.accessToken;
        window.localStorage.setItem('Bearer Token', token);

        // Verify the value is set correctly in local storage
        const storedLastLogin = window.localStorage.getItem('Last Login');
        console.log(`Stored last login time after setting: ${storedLastLogin}`); // Debugging log
        
        setIsLoggedIn(true);
      }).catch((error) => {
        console.error('Token acquisition failed', error);
        // Handle token acquisition failure
      });
    }).catch((error) => {
      console.error('Login failed', error);
      // Handle login failure
    });
  }

  if (!isLoggedIn) {
    return <h1 className="font-mono text-gray-600 cursor-pointer" onClick={signIn}>Sign in</h1>;
  } else {
    const userName = accounts[0]?.name || 'Name';
    
    return (
      <div className="flex auth" onClick={controlDropdown}>
        <div className="text-sm">
          <p className="font-mono text-gray-600">{userName}</p>
          <div className="flex">
            <p className="text-gray-600 font-mono">Last login:</p>
            <p className="text-gray-600 font-semibold mx-1">{lastLogin || 'Unknown'}</p>
          </div>
        </div>
        <img className="avatar mx-2" src={pfp} alt="Profile" />
        {dropdown && (
          <div className="dropdown-menu">
            <a href="#" onClick={signOut}>Sign Out</a>
          </div>
        )}
      </div>
    );
  }
}
