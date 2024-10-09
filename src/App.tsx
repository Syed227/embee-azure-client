import './App.css';
import Nav from './components/navbar';
import Control from './components/control';
import { useState, useEffect } from 'react';
import Login from './components/login';
import { useMsal, useIsAuthenticated } from '@azure/msal-react';

function App() {
  const { instance, accounts } = useMsal();
  const isAuthenticated = useIsAuthenticated();

  const [AMs, setAMs] = useState<string[]>([]);
  const [role, setRole] = useState('');
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true); // Loading state

  const handleLogin = async () => {
    try {
      await instance.loginRedirect({
        scopes: ['openid', 'profile', 'User.Read', 'User.Read.All'],
      });
    } catch (error) {
      console.error(error);
    }
  };

  const globalAdmins: Set<string> = new Set(['Utsav Kothari', 'Sudhir Kothari']);
  const SuperAdminsNSE: Set<string> = new Set(['Syed Hasan Ahmad', 'Sanjay Kuchroo', 'Ankush Chouhan', 'hamadan']);
  const SuperAdminsW: Set<string> = new Set(['Iqbal Baliwal', 'Aman Singhal']);

  useEffect(() => {
    if (isAuthenticated) {
      const user_name = accounts[0]?.name || '';
      setUserName(user_name);

      // Set loading timer
      const timer = setTimeout(() => {
        if (loading) {
          alert('Backend has crashed');
        }
      }, 15000); // 15 seconds

      // Check if the user_name exists in any of the predefined sets
      if (globalAdmins.has(user_name)) {
        setRole("Global Admin");
        setLoading(false); // Stop loading
      } else if (SuperAdminsNSE.has(user_name)) {
        setRole("Super Admin NSE");
        setLoading(false); // Stop loading
      } else if (SuperAdminsW.has(user_name)) {
        setRole("Super Admin W");
        setLoading(false); // Stop loading
      } else {
        const logicAppUrl = 'https://prod-10.centralindia.logic.azure.com:443/workflows/2bb26d06efee4ba1beec91b554ec5e86/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=A4DgyAp3j-xtBhyQ6MGqyl0H3t_QXf5Y0WrcFUjzk3E';
        const requestData = {
          GetURL: `http://4.240.47.21:3000/get-users-by-manager/${user_name}/`
        };

        fetch(logicAppUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData)
        })
          .then(response => {
            if (!response.ok) {
              throw new Error("Response not OK");
            }
            return response.json();
          })
          .then((data: any[]) => {
            const displayNames = data.map(user => user.displayName);
            displayNames.push(user_name);
            setAMs(displayNames);

            // Decide the role based on the results
            if (displayNames.length === 1) {
              setRole("Account Manager");
            } else {
              setRole("Manager");
            }
            setLoading(false); // Stop loading
          })
          .catch(err => {
            console.log("ERROR:", err);
            setLoading(false); // Stop loading on error
          });
      }

      // Clear timer on cleanup
      return () => {
        clearTimeout(timer);
      };
    } else {
      console.log("User not authenticated");
    }
  }, [isAuthenticated, accounts, loading]);

  const handleLogout = async () => {
    try {
      await instance.logoutRedirect();
    } catch (error) {
      console.error(error);
    }
  };

  if (!isAuthenticated) {
    return (
      <div>
        <Nav isLoggedIn={isAuthenticated} setIsLoggedIn={handleLogin} />
        <Login />
      </div>
    );
  }

  return (
    <div>
      <Nav isLoggedIn={isAuthenticated} setIsLoggedIn={handleLogout} />
      {loading ? (
        <div>Loading...</div> // You can replace this with a spinner if desired
      ) : (
        <Control isLoggedIn={isAuthenticated} name={userName} role={role} AMs={AMs} />
      )}
    </div>
  );
}

export default App;
