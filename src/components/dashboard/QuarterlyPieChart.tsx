import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useState, useEffect } from 'react';
import { QueryData } from '../consolidated/consolidatedCSP';

interface QuarterConsumption {
  region: string;
  consumption: number;
}

type Props = {
  EAdata: QueryData[];
  CSPdata: QueryData[];
  dataname: string; // For the heading, e.g., "EA+CSP"
};

const QuarterlyPieChart = ({ EAdata, CSPdata, dataname }: Props) => {
  const regions = ['North', 'South', 'East', 'West'];
  const quarters = ['Q4', 'Q3', 'Q2', 'Q1']; // List quarters in reverse order for default selection
  const [currentQuarter, setCurrentQuarter] = useState<string>('Q1'); // Start with an arbitrary quarter
  const[outerRadius, setOuterRadius]=useState(55)
  const [innerRadius, setInnerRadius]=useState(35)

  useEffect(() => {
    // Find the most recent non-empty quarter
    const findMostRecentQuarter = () => {
      for (const quarter of quarters) {
        const EAConsumption = aggregateQuarterlyData(EAdata, quarter);
        const CSPConsumption = aggregateQuarterlyData(CSPdata, quarter);
        const combinedData = regions.map(region => (EAConsumption[region] || 0) + (CSPConsumption[region] || 0));
        if (combinedData.some(consumption => consumption > 0)) {
          return quarter;
        }
      }
      return 'Q1'; // Default to Q1 if no data is found in any quarter
    };

    const handleResize = () => {
      const screenWidth = window.innerWidth;
      
      if (screenWidth >= 1600) {
        setOuterRadius(90);  // Large screens
        setInnerRadius(60);   // Large screens
      } else if (screenWidth >= 1280) {
        setOuterRadius(85);  // Standard laptop screens
        setInnerRadius(60);    // Standard laptop screens
      } else {
        setOuterRadius(60);  // Smaller screens
        setInnerRadius(50);    // Smaller screens
      }
    };

    handleResize();  // Set initial size
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };

    const mostRecentQuarter = findMostRecentQuarter();
    setCurrentQuarter(mostRecentQuarter);
  }, [EAdata, CSPdata]);

  const aggregateQuarterlyData = (data: QueryData[], quarter: string): { [region: string]: number } => {
    const consumptionByRegion: { [region: string]: number } = {};

    const addToRegion = (region: string, consumption: number) => {
      if (regions.includes(region)) {
        if (consumptionByRegion[region]) {
          consumptionByRegion[region] += consumption;
        } else {
          consumptionByRegion[region] = consumption;
        }
      }
    };

    data.forEach(item => {
      if (quarter === 'Q1') {
        addToRegion(item.region, item.april + item.may + item.june);
      } else if (quarter === 'Q2') {
        addToRegion(item.region, item.july + item.sep + item.aug);
      } else if (quarter === 'Q3') {
        addToRegion(item.region, item.oct + item.nov + item.dec);
      } else if (quarter === 'Q4') {
        addToRegion(item.region, item.jan + item.feb + item.march);
      }
    });

    return consumptionByRegion;
  };

  const EAConsumption = aggregateQuarterlyData(EAdata, currentQuarter);
  const CSPConsumption = aggregateQuarterlyData(CSPdata, currentQuarter);

  const combinedData: QuarterConsumption[] = regions.map(region => ({
    region,
    consumption: (EAConsumption[region] || 0) + (CSPConsumption[region] || 0),
  }));

  const chartData = combinedData.filter(item => item.consumption > 0);
  const totalConsumption = combinedData.reduce((total, item) => total + item.consumption, 0);

  const COLORS = ['#4A90E2', '#50E3C2', '#F5A623', '#FF66B2'];

  const formatValue = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(2)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(2)}K`;
    }
    return value.toFixed(2);
  };

  const renderCustomizedLabel = ({ cx, cy, midAngle, outerRadius, index, value, name }: any) => {
    const RADIAN = Math.PI / 180;
    const sin = Math.sin(-midAngle * RADIAN);
    const cos = Math.cos(-midAngle * RADIAN);
    const sx = cx + (outerRadius + 5) * cos;
    const sy = cy + (outerRadius + 5) * sin;
    const mx = cx + (outerRadius + 15) * cos;
    const my = cy + (outerRadius + 15) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 15;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';

    return (
      <g>
        <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={COLORS[index % COLORS.length]} fill="none" />
        <circle cx={ex} cy={ey} r={2} fill={COLORS[index % COLORS.length]} stroke="none" />
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333" fontSize="12px">
          {name}
        </text>
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey + 15} textAnchor={textAnchor} fill="#333" fontSize="12px">
          {`₹${formatValue(value)}`}
        </text>
      </g>
    );
  };

  const handlePreviousQuarter = () => {
    setCurrentQuarter(prevQuarter => {
      const prevIndex = (quarters.indexOf(prevQuarter) - 1 + quarters.length) % quarters.length;
      return quarters[prevIndex];
    });
  };

  const handleNextQuarter = () => {
    setCurrentQuarter(prevQuarter => {
      const nextIndex = (quarters.indexOf(prevQuarter) + 1) % quarters.length;
      return quarters[nextIndex];
    });
  };

  return (
    <div className="w-full h-full flex items-center">
      <button
        onClick={handleNextQuarter}
        className="text-blue-500 text-2xl font-bold p-2 h-full flex items-center justify-center hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        aria-label="Previous quarter"
      >
        {'<'}
      </button>

      <div className="flex-grow h-full flex flex-col items-center justify-center">
        {/* Displaying the dataname along with the quarter and total consumption */}
        <h2 className="text-center mb-2 text-[#9C2E2D] font-semibold">
          {`${dataname} - ${currentQuarter} : ₹${formatValue(totalConsumption)}`}
        </h2>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="consumption"
                nameKey="region"
                cx="50%"
                cy="50%"
                outerRadius={outerRadius}
                innerRadius={innerRadius}
                fill="#8884d8"
                labelLine={false}
                label={renderCustomizedLabel}
              >
                {chartData.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number, name: string) => ['₹' + formatValue(value), name]} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-lg">{`No data for ${currentQuarter}`}</p>
          </div>
        )}
      </div>

      <button
        onClick={handlePreviousQuarter}
        className="text-blue-500 text-2xl font-bold p-2 h-full flex items-center justify-center hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        aria-label="Next quarter"
      >
        {'>'}
      </button>
    </div>
  );
};

export default QuarterlyPieChart;
