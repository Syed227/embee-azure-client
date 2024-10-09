import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface LineChartEAProps {
  data: Array<{ month: string; consumption: number }>;
  color: string;
}

const LineChartEA: React.FC<LineChartEAProps> = ({ data, color }) => {

  const formatNumber = (num: number): string => {
    return num.toLocaleString('en-IN');
  };

  const yAxisFormat = (num: number): string => {
    if (num >= 100000) {
      return (num / 100000) + 'L';
    } else if (num >= 1000) {
      return (num / 1000) + 'k';
    } else {
      return num.toString();
    }
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const currentData = payload[0].payload;
      const index = data.findIndex(item => item.month === currentData.month);

      if (index > 0) {
        const previousData = data[index - 1];
        const percentageChange = ((currentData.consumption - previousData.consumption) / previousData.consumption) * 100;
        const changeColor = percentageChange >= 0 ? 'green' : '#9C2E2D';

        return (
          <div className="custom-tooltip" style={{
            backgroundColor: 'white',
            padding: '10px',
            borderRadius: '5px',
            boxShadow: '0 0 5px rgba(0, 0, 0, 0.3)',
          }}>
            <p>{`${currentData.month}`}</p>
            <p>{`Consumption: ₹${formatNumber(currentData.consumption)}`}</p>
            <p style={{ color: changeColor }}>{`Change: ${percentageChange.toFixed(2)}%`}</p>
          </div>
        );
      }

      return (
        <div className="custom-tooltip" style={{
          backgroundColor: 'white',
          padding: '10px',
          borderRadius: '5px',
          boxShadow: '0 0 5px rgba(0, 0, 0, 0.3)',
        }}>
          <p>{`${currentData.month}`}</p>
          <p>{`Consumption: ₹${formatNumber(currentData.consumption)}`}</p>
          <p style={{ color: 'gray' }}>{`Change: N/A`}</p>
        </div>
      );
    }

    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis tickFormatter={yAxisFormat} />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Line type="monotone" dataKey="consumption" stroke={color} strokeWidth={1.5} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default LineChartEA;
