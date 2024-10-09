import React, { useState } from 'react';
import LineChartEA from './lineChartEA';
import BarChartComp from './barChartEA';

interface ToggleChartProps {
  consumptionData: Array<{ month: string; consumption: number }>;
  averageData: Array<{ month: string; consumption: number }>;
  chartColor: string;
}

const ToggleChart: React.FC<ToggleChartProps> = ({ consumptionData, averageData, chartColor }) => {
  const [showLineChart, setShowLineChart] = useState(true);

  const toggleChart = () => {
    setShowLineChart(prevState => !prevState);
  };

  return (
    <div onClick={toggleChart}>
      {showLineChart ? (
        <LineChartEA data={consumptionData} color={chartColor} />
      ) : (
        <BarChartComp data={consumptionData} averageData={averageData} />
      )}
    </div>
  );
};

export default ToggleChart;
