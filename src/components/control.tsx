import { Link, Routes, Route } from "react-router-dom"
import Dashboard from "./dashboard"
import UpdateData  from "./update"
import ProtectedRoutes from "./protectedroutes"
import UpdateEA from "./update/updateEA"
import UpdateCSP from "./update/updateCSP"
import ConsolidatedViewEA from "./consolidated/consolidatedEA"
import ConsolidatedViewCSP from "./consolidated/consolidatedCSP"
import ConsolidatedControl from "./consolidatedControl"
import SignIn from "./signin"
import CompanyProfileEA from "./companyProfile/companyProfileEA"
import CompanyProfileCSP from "./companyProfile/companyProfileCSP"
import { useEffect, useState } from "react"

type Props ={
    isLoggedIn:boolean;
    name:string,
    role: string,
    AMs: string[]
}

interface QueryData {
	sno: number;
	region:string;
	account_manager: string;
	customer_name: string;
	enrollment_number:number;
	markup:number;
	april: number;
	may: number;
	june: number;
	july: number;
	aug: number;
	sep: number;
	oct: number;
	nov: number;
	dec: number;
  jan: number;
	feb: number;
	march: number;
	total:number;

  }





export default function Control({isLoggedIn, name, role, AMs}:Props){
const [EAdata, setEAdata]=useState<QueryData[]>([]);
const [CSPdata, setCSPdata]=useState<QueryData[]>([])


async function getManagerDataEA(names:string[]){
    //POST Request
    try {
        const response = await fetch('https://prod-07.centralindia.logic.azure.com:443/workflows/92990b87cb78463d871366c22359a933/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=MnccB35fF9r9ElYW865STfC_oThZwDLgJ3VY4aPQ5rQ', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ names }),
        });
    
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
    
        const data = await response.json();
    
        setEAdata(data);
       
      } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
      }

    
}


async function getManagerDataCSP(names:string[]){
  //POST Request
  try {
      const response = await fetch('https://prod-19.centralindia.logic.azure.com:443/workflows/4ea70e3c173142c8b396c1b9ac7a9fd9/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=lPtVO5PpxQVCy-CAvgf_Vp9kwxBp7wsn5lQ-WMtlv6g', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ names }),
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
      setCSPdata(data);
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
    
}

const logicAppUrl = 'https://prod-10.centralindia.logic.azure.com:443/workflows/2bb26d06efee4ba1beec91b554ec5e86/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=A4DgyAp3j-xtBhyQ6MGqyl0H3t_QXf5Y0WrcFUjzk3E';

async function getAllEA() {
  try {
    const requestData = { GetURL: "http://4.240.47.21:3000/get-all-ea" };
    const response = await fetch(logicAppUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestData)
    });

    if (!response.ok) {
      throw new Error("Network Response was not OK");
    }
    const data = await response.json();
    setEAdata(data);
  } catch (err) {
    console.error("ERROR:", err);
  }
}


async function getAllCSP() {
  try {
    const requestData = { GetURL: "http://4.240.47.21:3000/get-all-csp" };
    const response = await fetch(logicAppUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestData)
    });

    if (!response.ok) {
      throw new Error("Network Response was not OK");
    }
    const data = await response.json();
    setCSPdata(data);
  } catch (err) {
    console.error("ERROR:", err);
  }
}
 async function initialiseDB() {
  try {
    const requestData = { GetURL: "http://4.240.47.21:3000/" };
    const response = await fetch(logicAppUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestData)
    });

    if (!response.ok) {
      throw new Error("Network Response was not OK");
    }
   
  } catch (err) {
    console.error("ERROR INTIALISING DB:", err);
  }
}

async function getAMdataEA(name: string) {
  try {
    const requestData = { GetURL: `http://4.240.47.21:3000/getAMdataEA/${name}` };
    const response = await fetch(logicAppUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestData)
    });

    if (!response.ok) {
      throw new Error("Network Response was not OK");
    }
    const data = await response.json();
    setEAdata(data);
  } catch (err) {
    console.error("ERROR:", err);
  }
}

async function getAMdataCSP(name: string) {
  try {
    const requestData = { GetURL: `http://4.240.47.21:3000/getAMdataCSP/${name}` };
    const response = await fetch(logicAppUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestData)
    });

    if (!response.ok) {
      throw new Error("Network Response was not OK");
    }
    const data = await response.json();
    setCSPdata(data);
  } catch (err) {
    console.error("ERROR:", err);
  }
}

async function EAgetSuperAdminNSE() {
  try {
    const requestData = { GetURL: "http://4.240.47.21:3000/EAgetSuperAdminNSE" };
    const response = await fetch(logicAppUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestData)
    });

    if (!response.ok) {
      throw new Error("Network Response was not OK");
    }
    const data = await response.json();
    setEAdata(data);
  } catch (err) {
    console.error("ERROR:", err);
  }
}

async function CSPgetSuperAdminNSE() {
  try {
    const requestData = { GetURL: "http://4.240.47.21:3000/CSPgetSuperAdminNSE" };
    const response = await fetch(logicAppUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestData)
    });

    if (!response.ok) {
      throw new Error("Network Response was not OK");
    }
    const data = await response.json();
    setCSPdata(data);
  } catch (err) {
    console.error("ERROR:", err);
  }
}

async function EAgetSuperAdminW() {
  try {
    const requestData = { GetURL: "http://4.240.47.21:3000/EAgetSuperAdminW" };
    const response = await fetch(logicAppUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestData)
    });

    if (!response.ok) {
      throw new Error("Network Response was not OK");
    }
    const data = await response.json();
    setEAdata(data);
  } catch (err) {
    console.error("ERROR:", err);
  }
}

async function CSPgetSuperAdminW() {
  try {
    const requestData = { GetURL: "http://4.240.47.21:3000/CSPgetSuperAdminW" };
    const response = await fetch(logicAppUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestData)
    });

    if (!response.ok) {
      throw new Error("Network Response was not OK");
    }
    const data = await response.json();
    setCSPdata(data);
  } catch (err) {
    console.error("ERROR:", err);
  }
}

 

    useEffect(()=>{
        if(isLoggedIn){
          initialiseDB()
            if(role=='Manager'){
              console.log(AMs)
                getManagerDataEA(AMs)
                getManagerDataCSP(AMs)
            }
            else if(role=='Super Admin NSE'){
              EAgetSuperAdminNSE();
              CSPgetSuperAdminNSE();
            }
            else if(role=='Super Admin W'){
              EAgetSuperAdminW();
              CSPgetSuperAdminW();
            }
            else if(role=='Global Admin'){
              getAllEA()
              getAllCSP()
            }
            else{
                getAMdataEA(name)
                getAMdataCSP(name)
            }
        }
        
    }, [isLoggedIn, name, AMs, role])
    return(
        <>
         <div className="flex justify-evenly p-3">
        <Link to="/" className="control text-lg font-semibold route-control-indiv">Dashboard</Link>
        <Link to="/consolidated" className="control text-lg font-semibold route-control-indiv">Consolidated View</Link>
        <Link to="/update" className="control text-lg font-semibold route-control-indiv">Update Data</Link>
         </div>

         <Routes>
            <Route element={<ProtectedRoutes isLoggedIn={isLoggedIn}/>} >
            <Route path="/"  element={<Dashboard EAdata={EAdata} CSPdata={CSPdata} />}/>
            <Route path="/consolidated" element={<ConsolidatedControl />}/>
            <Route path="/update/*" element={<UpdateData role={role}/>} />
            <Route path="/update/updateEA"  element={<UpdateEA/>}/>
            <Route path="/updateCSP" element={<UpdateCSP/>}/>
            <Route path="consolidated/EA" element={<ConsolidatedViewEA data={EAdata}/>}/>
            <Route path="consolidated/CSP" element={<ConsolidatedViewCSP data={CSPdata}/>}/>
            <Route path="/signin" element={<SignIn/>}/>
            <Route path="/EA/:name" element={<CompanyProfileEA/>}/>
            <Route path="/CSP/:name" element={<CompanyProfileCSP/>}/>
            </Route>
            
         </Routes>
    
        </>
       
    )
   
}
