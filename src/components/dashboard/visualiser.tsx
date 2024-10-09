import { useState } from 'react';
import { QueryData } from '../consolidated/consolidatedCSP';
import QuarterlyPieChart from './QuarterlyPieChart';
import PieComponent from './pieChartComponent';

type Props = {
  EAdata: QueryData[];
  CSPdata: QueryData[];
};

const Visualiser = ({ EAdata, CSPdata }: Props) => {
  return (
    <div className="flex justify-between w-full">
      <div className="flex justify-center items-center bg-white w-1/3 shadow-lg h-96 p-3 m-1">
          <PieComponent data={EAdata} dataname="EA Region-wise Consumption" />
      </div>
      <div className="flex justify-center items-center bg-white w-1/3 shadow-lg h-96 p-3 m-1">
          <PieComponent data={CSPdata} dataname="CSP Region-wise Consumption" />
      </div>

      <div className="flex justify-center items-center bg-white w-1/3 shadow-lg h-96 p-3 m-1">
          <QuarterlyPieChart EAdata={EAdata} CSPdata={CSPdata} dataname='EA+CSP Consumption'/>
      </div>
      
      
    </div>
  );
};


export default Visualiser;