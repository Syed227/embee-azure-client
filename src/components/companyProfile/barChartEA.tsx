// BarChartComp.tsx

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface BarChartEAProps {
  data: Array<{ month: string; consumption: number }>;
  averageData: Array<{ month: string; consumption: number }>;
}

const formatNumber = (num: number): string => {
  return num.toLocaleString('en-IN');
};


const formatYaxis = (num: number): string => {
  if(num>=100000){
    num=num/100000
    return num.toLocaleString('en-IN') + 'L'
  }
  else if(num>=10000){ 
    num=num/10000;
    return num.toLocaleString('en-IN') + 'K'}
  else return num.toLocaleString('en-IN');
};
const BarChartComp: React.FC<BarChartEAProps> = ({ data, averageData }) => {
  // Merge company data and average data
  const chartData = data.map((item, index) => ({
    month: item.month,
    companyConsumption: item.consumption,
    averageConsumption: averageData[index]?.consumption || 0,
  }));

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis tickFormatter={formatYaxis} />
        <Tooltip formatter={(value) => formatNumber(value as number)} />
        <Legend />
        <Bar dataKey="companyConsumption" fill="#8884d8" name="Company Consumption" />
        <Bar dataKey="averageConsumption" fill="#82ca9d" name="Average Consumption" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BarChartComp;
