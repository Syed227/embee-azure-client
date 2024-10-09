// BarChartComponent.tsx
import { BarChart, Bar, Tooltip, Legend, CartesianGrid, XAxis, YAxis, LabelList } from 'recharts';
import { QueryData } from '../consolidated/consolidatedCSP';

type Props = {
  EAdata: QueryData[];
  CSPdata: QueryData[];
  dataname: string;
};

interface MonthlyTotal {
  month: string;
  [key: string]: number | string;
}

const BarChartComponent = ({ EAdata, CSPdata, dataname }: Props) => {
  const aggregateMonthWiseData = (data: QueryData[], label: string): MonthlyTotal[] => {
    const months = ['april', 'may', 'June', 'july', 'aug', 'sep', 'oct', 'nov', 'dec', 'jan', 'feb', 'march'];
    
    // Initialize an array to hold month-wise totals
    const monthlyTotals: MonthlyTotal[] = months.map((month) => ({
      month,
      [label]: 0
    }));

    // Aggregate expenses month-wise
    data.forEach(item => {
      months.forEach((month) => {
        const expense = item[month.toLowerCase() as keyof QueryData] as number;
        if (!isNaN(expense)) {
          // Find the corresponding month entry and add to total
          const entry = monthlyTotals.find((entry) => entry.month === month);
          if (entry) {
            entry[label] = (entry[label] as number) + expense;
          }
        }
      });
    });

    return monthlyTotals;
  };

  const EAChartData = aggregateMonthWiseData(EAdata, 'EA');
  const CSPChartData = aggregateMonthWiseData(CSPdata, 'CSP');

  // Merge EA and CSP data by month
  const mergeChartData = (EAData: MonthlyTotal[], CSPData: MonthlyTotal[]) => {
    const mergedData = EAData.map((item, index) => ({
      month: item.month,
      EA: item.EA as number,
      CSP: CSPData[index]?.CSP as number || 0 // Use 0 if CSP data is missing
    }));
    return mergedData;
  };

  const chartData = mergeChartData(EAChartData, CSPChartData);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip bg-white p-2 border border-gray-300 rounded shadow-lg">
          <p className="label">{`${label} :`}</p>
          <p className="label">{`EA: ₹${formatNumber(payload[0].value)}`}</p>
          <p className="label">{`CSP: ₹${formatNumber(payload[1].value)}`}</p>
        </div>
      );
    }

    return null;
  };

  const formatNumber = (num: number) => {
    return (num / 1_000_000).toFixed(1) + 'M'; // Format number in millions
  };

  return (
    <div className="bg-white p-4 m-4 flex justify-center items-center"> {/* Centering container */}
      <div className="flex flex-col items-center"> {/* Center content */}
        <h2 className="text-center mb-4 text-[#9C2E2D] font-semibold text-lg">{dataname}</h2> {/* Updated text size */}
        <BarChart width={1000} height={500} data={chartData}> {/* Increased dimensions */}
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis tickFormatter={(value) => formatNumber(value)} /> {/* Format Y-axis */}
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar dataKey="EA" fill="#77c9ae" barSize={20} name="EA Data">
            <LabelList
              dataKey="EA"
              content={({ x, y, value }: any) => (
                value > 0 ? (
                  <text
                    x={x + 10} // Adjusted to move text to the right
                    y={y - 10}
                    fill="#77c9ae"
                    textAnchor="middle"
                    fontSize={10}
                  >
                    {formatNumber(value as number)}
                  </text>
                ) : null
              )}
            />
          </Bar>
          <Bar dataKey="CSP" fill="#8884d8" barSize={20} name="CSP Data">
            <LabelList
              dataKey="CSP"
              content={({ x, y, value }: any) => (
                value > 0 ? (
                  <text
                    x={x + 10} // Adjusted to move text to the right
                    y={y - 10}
                    fill="#8884d8"
                    textAnchor="middle"
                    fontSize={12}
                  >
                    {formatNumber(value as number)}
                  </text>
                ) : null
              )}
            />
          </Bar>
        </BarChart>
      </div>
    </div>
  );
};

export default BarChartComponent;
