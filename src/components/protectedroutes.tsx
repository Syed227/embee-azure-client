import { Navigate, Outlet, Routes, Route } from "react-router-dom";
import Login from "./login";


type Props = { isLoggedIn: boolean;  };

export default function ProtectedRoutes({isLoggedIn}:Props){
    if(!isLoggedIn){
        return( 
        
        <>
        <Navigate to="/login" replace />
        <Routes>
            <Route path="/login" element={<Login/>}/>
        </Routes>
        </>
        )
    }
    return <Outlet />;
}
