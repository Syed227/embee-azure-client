import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useState, useEffect } from 'react';
import { QueryData } from '../consolidated/consolidatedCSP';

type Props = {
  data: QueryData[];
  dataname: string;
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
const months = ['april', 'may', 'june', 'july', 'aug', 'sep', 'oct', 'nov', 'dec', 'jan', 'feb', 'march'];

const PieComponent = ({ data, dataname }: Props) => {
  const [index, setIndex] = useState(0);
  const [outerRadius, setOuterRadius] = useState(150); // Default outer radius

  // Find the most recent non-empty month
  const findMostRecentMonthWithData = () => {
    for (let i = months.length - 1; i >= 0; i--) {
      const month = months[i];
      const hasData = data.some((entry) => entry[month as keyof QueryData] > 0);
      if (hasData) {
        return i; // Return the index of the most recent month with data
      }
    }
    return 0; // Fallback to the first month if no data is found
  };

  useEffect(() => {
    // Set initial index to the most recent month with data
    setIndex(findMostRecentMonthWithData());
    
    const handleResize = () => {
      const screenWidth = window.innerWidth;
      
      if (screenWidth >= 1600) {
        setOuterRadius(180);  // Large screens
      } else if (screenWidth >= 1280) {
        setOuterRadius(160);  // Standard laptop screens
      } else {
        setOuterRadius(90);  // Smaller screens
      }
    };

    handleResize();  // Set initial size
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [data]);

  const sumMonthlyExpenses = (data: QueryData[], month: string) => {
    return data.reduce((acc, curr) => {
      const region = curr.region;
      const expense = curr[month as keyof QueryData] as number;
      if (!acc[region]) {
        acc[region] = 0;
      }
      acc[region] += expense;
      return acc;
    }, {} as { [region: string]: number });
  };

  const formatNumber = (num: number) => {
    if (num >= 1_000_000) {
      return (num / 1_000_000).toFixed(2) + 'M';
    } else if (num >= 1_000) {
      return (num / 1_000).toFixed(2) + 'K';
    }
    return num.toFixed(2);
  };

  const selectedMonth = months[index];
  const expenses = sumMonthlyExpenses(data, selectedMonth);
  const totalConsumption = Object.values(expenses).reduce((acc, value) => acc + value, 0);

  const formatChartData = (data: { [region: string]: number }) => {
    return Object.entries(data).map(([region, value]) => ({
      name: region,
      value,
    }));
  };

  const chartData = formatChartData(expenses);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip bg-white p-2 border border-gray-300 rounded shadow-lg">
          <p className="label">{`${payload[0].name} : ₹${formatNumber(payload[0].value)}`}</p>
        </div>
      );
    }
    return null;
  };

  const renderCustomLabel = ({ cx, cy, midAngle, outerRadius, name, value, index }: any) => {
    const RADIAN = Math.PI / 180;
    const sin = Math.sin(-midAngle * RADIAN);
    const cos = Math.cos(-midAngle * RADIAN);
    const sx = cx + (outerRadius + 8) * cos;
    const sy = cy + (outerRadius + 8) * sin;
    const mx = cx + (outerRadius + 18) * cos; // Reduced midpoint
    const my = cy + (outerRadius + 18) * sin; // Reduced midpoint
    const ex = mx + (cos >= 0 ? 1 : -1) * 12; // Reduced endpoint
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';
  
    return (
      <g>
        <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={COLORS[index % COLORS.length]} fill="none" />
        <circle cx={ex} cy={ey} r={2} fill={COLORS[index % COLORS.length]} stroke="none" />
        <text x={ex + (cos >= 0 ? 1 : -1) * 8} y={ey} textAnchor={textAnchor} fill="#333" fontSize="12px">
          {name}
        </text>
        <text x={ex + (cos >= 0 ? 1 : -1) * 8} y={ey + 15} textAnchor={textAnchor} fill="#333" fontSize="12px">
          {`₹${formatNumber(value)}`}
        </text>
      </g>
    );
  };

  const handlePrevious = () => {
    setIndex((prevIndex) => (prevIndex - 1 + months.length) % months.length);
  };

  const handleNext = () => {
    setIndex((prevIndex) => (prevIndex + 1) % months.length);
  };

  return (
    <div className="w-full h-full flex items-center">
      <button 
        onClick={handlePrevious}
        className="text-blue-500 text-2xl font-bold p-2 h-full flex items-center justify-center hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        aria-label="Previous month"
      >
        {'<'}
      </button>
      <div className="flex-grow h-full flex flex-col items-center justify-center">
        <h2 className="text-center mb-2 text-[#9C2E2D] font-semibold">
          {dataname} ({selectedMonth.toLocaleUpperCase()}) - ₹{formatNumber(totalConsumption)}
        </h2>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomLabel}
              outerRadius={Math.min(outerRadius, 85)} // Apply max limit of 65
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((_entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <button 
        onClick={handleNext}
        className="text-blue-500 text-2xl font-bold p-2 h-full flex items-center justify-center hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        aria-label="Next month"
      >
        {'>'}
      </button>
    </div>
  );
};

export default PieComponent;
