import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { QueryData } from '../consolidated/consolidatedCSP';

import ToggleChart from './toggleChart';

interface PositionData {
  position: number;
}

const CompanyProfileCSP: React.FC = () => {
  const { name } = useParams<{ name: string }>();
  const [companyData, setCompanyData] = useState<QueryData | null>(null);
  const [currentRank, setCurrentRank] = useState<PositionData | null>(null);
  const [previousRank, setPreviousRank] = useState<PositionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [averageData, setAverageData] = useState<{ month: string; consumption: number }[]>([]);

  const formatNumber = (num: number): string => {
    return num.toLocaleString('en-IN');
  };
  
  // Define a type for month abbreviations
  type MonthAbbreviation =  'april' | 'may' | 'june' | 'july' | 'aug' | 'sep' | 'oct' | 'nov' | 'dec' | 'jan' | 'feb' | 'march' ;
  
  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        setLoading(true);
        
        const fetchData = async (url: string) => {
          const logicAppUrl = `https://prod-10.centralindia.logic.azure.com:443/workflows/2bb26d06efee4ba1beec91b554ec5e86/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=A4DgyAp3j-xtBhyQ6MGqyl0H3t_QXf5Y0WrcFUjzk3E`;
          const response = await fetch(logicAppUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ GetURL: url }),
          });
  
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
  
          return await response.json();
        };
  
        const [data, rankData, avgData] = await Promise.all([
          fetchData(`http://4.240.47.21:3000/getCompanyDataCSP/${name}`),
          fetchData(`http://4.240.47.21:3000/getRankCSP/${name}`),
          fetchData(`http://4.240.47.21:3000/getAverageCSP`),
        ]);
  
        if (Array.isArray(rankData) && rankData.every(item => Array.isArray(item))) {
          const rankFlattened = rankData.flat();
          setCurrentRank(rankFlattened[0] || null);
          setPreviousRank(rankFlattened[1] || null);
        } else {
          console.error('Unexpected rank data format:', rankData);
        }
  
        setCompanyData(data[0]);
  
        // Corrected month name extraction
        const formattedAvgData = Object.keys(avgData[0]).map(key => {
          const match = key.match(/`(.+?)`/);
          const monthAbbreviation = match ? match[1] as MonthAbbreviation : null; // Extract and assert type
        
          // Reordered monthNames to start from April and end at March
          const monthNames: Record<MonthAbbreviation, string> = {
            april: "April",
            may: "May",
            june: "June",
            july: "July",
            aug: "August",
            sep: "September",
            oct: "October",
            nov: "November",
            dec: "December",
            jan: "January",
            feb: "February",
            march: "March"
          };
        
          const consumption = avgData[0][key] === null ? 0 : parseFloat(avgData[0][key]);
        
          return {
            month: monthAbbreviation ? monthNames[monthAbbreviation] : '',
            consumption: isNaN(consumption) ? 0 : consumption
          };
        });
        
        // Sort the formattedAvgData array based on the fiscal year order
        const sortedAvgData = formattedAvgData.sort((a, b) => {
          const fiscalOrder = ["April", "May", "June", "July", "August", "September", "October", "November", "December", "January", "February", "March"];
          return fiscalOrder.indexOf(a.month) - fiscalOrder.indexOf(b.month);
        });
        
        setAverageData(sortedAvgData);
        console.log(averageData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchCompanyData();
  }, [name]);
  
  

  

  const monthNames = [
    'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December', 'January', 'February', 'March'
  ];





// const insights = findLargestRiseAndFall();

// Example usage of insights

  
  const getRankChangeMessage = () => {
    if (!currentRank || !previousRank || !companyData) return '';

    const today = new Date();
    const previousMonthIndex = today.getMonth() - 1;
    const monthBeforePreviousIndex = previousMonthIndex - 1;

    const previousMonth = monthNames[previousMonthIndex];
    const monthBeforePrevious = monthNames[monthBeforePreviousIndex];

    let currentConsumption = 0;
    let previousConsumption = 0;

    switch (previousMonthIndex) {
      case 0: currentConsumption = companyData.jan; break;
      case 1: currentConsumption = companyData.feb; break;
      case 2: currentConsumption = companyData.march; break;
      case 3: currentConsumption = companyData.april; break;
      case 4: currentConsumption = companyData.may; break;
      case 5: currentConsumption = companyData.june; break;
      case 6: currentConsumption = companyData.july; break;
      case 7: currentConsumption = companyData.aug; break;
      case 8: currentConsumption = companyData.sep; break;
      case 9: currentConsumption = companyData.oct; break;
      case 10: currentConsumption = companyData.nov; break;
      case 11: currentConsumption = companyData.dec; break;
      default: currentConsumption = 0; break;
    }

    switch (monthBeforePreviousIndex) {
      case 0: previousConsumption = companyData.jan; break;
      case 1: previousConsumption = companyData.feb; break;
      case 2: previousConsumption = companyData.march; break;
      case 3: previousConsumption = companyData.april; break;
      case 4: previousConsumption = companyData.may; break;
      case 5: previousConsumption = companyData.june; break;
      case 6: previousConsumption = companyData.july; break;
      case 7: previousConsumption = companyData.aug; break;
      case 8: previousConsumption = companyData.sep; break;
      case 9: previousConsumption = companyData.oct; break;
      case 10: previousConsumption = companyData.nov; break;
      case 11: previousConsumption = companyData.dec; break;
      default: previousConsumption = 0; break;
    }

    const consumptionChange = currentConsumption - previousConsumption;

    if (currentRank.position > previousRank.position) {
      return `Previously, ${name} ranked at number ${previousRank.position} in all companies for their CSP consumption in the month of ${monthBeforePrevious}, but has now fallen to rank ${currentRank.position} in the month of ${previousMonth}. Its consumption has decreased by ₹${formatNumber(Math.abs(consumptionChange))}.`;
    } else if (currentRank.position < previousRank.position) {
      return `Previously, ${name} ranked at number ${previousRank.position} in all companies for their CSP consumption in the month of ${monthBeforePrevious}, but has now improved to rank ${currentRank.position} in the month of ${previousMonth}. Its consumption has increased by ₹${formatNumber(Math.abs(consumptionChange))}.`;
    } else {
      return `Previously, ${name} ranked at ${previousRank.position} in the month of ${monthBeforePrevious}, and remains at the same rank in the month of ${previousMonth}. Its consumption has not changed.`;
    }
  };

  if (loading) {
    return (
      <div className="p-3">
        <h1 className="text-3xl font-extrabold my-6 heading">
          Company Profile: {name}
        </h1>
        <div className="flex justify-center items-center h-40">
          <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-32 w-32"></div>
        </div>
      </div>
    );
  }

  const consumptionData = companyData ? [
    { month: 'April', consumption: companyData.april },
    { month: 'May', consumption: companyData.may },
    { month: 'June', consumption: companyData.june },
    { month: 'July', consumption: companyData.july },
    { month: 'August', consumption: companyData.aug },
    { month: 'September', consumption: companyData.sep },
    { month: 'October', consumption: companyData.oct },
    { month: 'November', consumption: companyData.nov },
    { month: 'December', consumption: companyData.dec },
    { month: 'January', consumption: companyData.jan },
    { month: 'February', consumption: companyData.feb },
    { month: 'March', consumption: companyData.march },
  ] : [];

  const today = new Date();
  const previousMonthIndex = today.getMonth() - 1;
  const monthBeforePreviousIndex = previousMonthIndex - 1;

  let currentConsumption = 0;
  let previousConsumption = 0;

  switch (previousMonthIndex) {
    case 0: currentConsumption = companyData?.jan || 0; break;
    case 1: currentConsumption = companyData?.feb || 0; break;
    case 2: currentConsumption = companyData?.march || 0; break;
    case 3: currentConsumption = companyData?.april || 0; break;
    case 4: currentConsumption = companyData?.may || 0; break;
    case 5: currentConsumption = companyData?.june || 0; break;
    case 6: currentConsumption = companyData?.july || 0; break;
    case 7: currentConsumption = companyData?.aug || 0; break;
    case 8: currentConsumption = companyData?.sep || 0; break;
    case 9: currentConsumption = companyData?.oct || 0; break;
    case 10: currentConsumption = companyData?.nov || 0; break;
    case 11: currentConsumption = companyData?.dec || 0; break;
    default: currentConsumption = 0; break;
  }

  switch (monthBeforePreviousIndex) {
    case 0: previousConsumption = companyData?.jan || 0; break;
    case 1: previousConsumption = companyData?.feb || 0; break;
    case 2: previousConsumption = companyData?.march || 0; break;
    case 3: previousConsumption = companyData?.april || 0; break;
    case 4: previousConsumption = companyData?.may || 0; break;
    case 5: previousConsumption = companyData?.june || 0; break;
    case 6: previousConsumption = companyData?.july || 0; break;
    case 7: previousConsumption = companyData?.aug || 0; break;
    case 8: previousConsumption = companyData?.sep || 0; break;
    case 9: previousConsumption = companyData?.oct || 0; break;
    case 10: previousConsumption = companyData?.nov || 0; break;
    case 11: previousConsumption = companyData?.dec || 0; break;
    default: previousConsumption = 0; break;
  }
  interface monthInsights {
    largestRiseMonth: string;
    largestRiseValue: number;
    largestFallMonth: string;
    largestFallValue: number;
    largestRiseChange: number; // Change in current month compared to previous month
    largestFallChange: number; // Change in current month compared to previous month
  }
  
  const findLargestRiseAndFall = (): monthInsights => {
    let largestRiseMonth = '';
    let largestRiseValue = 0;
    let largestFallMonth = '';
    let largestFallValue = 0;
    let largestRiseChange = 0;
    let largestFallChange = 0;
  
    // Filter out months with invalid data (e.g., null or future months)
    const validData = consumptionData.filter((data) => data.consumption !== null);
  
    validData.forEach((data, index) => {
      if (index > 0) {
        const currentMonthConsumption = data.consumption;
        const previousMonthConsumption = validData[index - 1].consumption;
        const change = currentMonthConsumption - previousMonthConsumption;
  
        if (change > 0 && (change > largestRiseChange || largestRiseChange === 0)) {
          largestRiseChange = change;
          largestRiseValue = currentMonthConsumption;
          largestRiseMonth = data.month;
        }
  
        if (change < 0 && (change < largestFallChange || largestFallChange === 0)) {
          largestFallChange = change;
          largestFallValue = currentMonthConsumption;
          largestFallMonth = data.month;
        }
      }
    });
  
    return {
      largestRiseMonth,
      largestRiseValue,
      largestFallMonth,
      largestFallValue,
      largestRiseChange,
      largestFallChange,
    };
  };

  
  

  const insights = findLargestRiseAndFall();

  

  const chartColor = currentConsumption >= previousConsumption ? 'green' : '#9C2E2D';

  return (
    <div className="p-3">
      <h1 className="text-3xl font-extrabold my-6 heading">
        Company Profile: {name}
      </h1>
      <h1 className="text-xl font-extrabold my-6 text-[#9C2E2D]">
        Region: {companyData?.region}
      </h1>
      <div className='flex justify-between w-full'>
        <div className='w-1/3 bg-white p-4 rounded-lg shadow-md'>
          <h2 className="text-lg font-bold">Rank Information</h2>
          {currentRank ? (
            <div className='text-[#1D4568]'>Current Rank: {currentRank.position}</div>
          ) : (
            <div>No current rank data available</div>
          )}
          {previousRank ? (
            <div className='text-[#1D4568]'>Previous Rank: {previousRank.position}</div>
          ) : (
            <div className='text-[#1D4568]'>No previous rank data available</div>
          )}
          <h2 className="mt-4">
            {getRankChangeMessage()}
          </h2>

          {insights.largestRiseChange !== 0 ? (
  <div>
    <h2 className="text-lg font-bold">Insights</h2>
    {insights.largestRiseChange > 0 ? (
      <div>
        <p>Month with greatest rise: {insights.largestRiseMonth}</p>
        <p>Value of greatest rise: ₹{formatNumber(insights.largestRiseChange)}</p>
      </div>
    ) : (
      <p>No month saw an increase in consumption</p>
    )}
    {insights.largestFallChange !== 0 ? (
      <div>
        {insights.largestFallChange < 0 ? (
          <div>
            <p>Month with greatest fall: {insights.largestFallMonth}</p>
            <p>Value of greatest fall: ₹{formatNumber(insights.largestFallChange)}</p>
          </div>
        ) : (
          <p>No month saw a decrease in consumption</p>
        )}
      </div>
    ) : (
      <p>No data available for greatest fall</p>
    )}
  </div>
) : (
  <p>No data available for insights</p>
)}

        </div>
        <div className='w-2/3 bg-white p-4 m-3rounded-lg shadow-md'>
          <ToggleChart consumptionData={consumptionData} averageData={averageData} chartColor={chartColor}/>
        </div>
      </div>
    </div>
  );
};


export default CompanyProfileCSP;
