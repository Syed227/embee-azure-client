import  { useState, useEffect } from 'react';
import Visualiser from './dashboard/visualiser';
import TopConsumers from './dashboard/topConsumers';
import { QueryData } from './consolidated/consolidatedCSP';
import BarChartComponent from './dashboard/barChartComponent';

interface Props {
  EAdata: QueryData[];
  CSPdata: QueryData[];
}

function Dashboard({ EAdata, CSPdata }: Props) {

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (EAdata.length > 0 && CSPdata.length > 0) {
      setLoading(false);
    }
  }, [EAdata, CSPdata]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="spinner"></div>
      </div>
    );
  }

 

  return (
    <div className='p-3'>
      <h1 className="text-3xl font-extrabold p-3 my-6 heading">
        Dashboard
      </h1>
      <Visualiser EAdata={EAdata} CSPdata={CSPdata} />
      <BarChartComponent EAdata={EAdata} CSPdata={CSPdata} dataname='EA & CSP Consumption per month'/>
      <div className='bg-white shadow-sm m-2 p-1'>
        <TopConsumers EAData={EAdata} CSPData={CSPdata} />
      </div>
    </div>
  );
}

export default Dashboard;
