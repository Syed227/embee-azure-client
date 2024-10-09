import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer, Cell, LabelList } from 'recharts';
import { QueryData } from '../consolidated/consolidatedCSP';

type Props = {
  EAData: QueryData[],
  CSPData: QueryData[]
};

const months = ['april', 'may', 'june', 'july', 'aug', 'sep', 'oct', 'nov', 'dec','jan', 'feb', 'march'] as const;
const regions = ['Select Region', 'North', 'South', 'East', 'West'];

type Month = typeof months[number];

const TopConsumers = ({ EAData, CSPData }: Props) => {
  const [startMonth, setStartMonth] = useState<Month>(months[0]);
  const [endMonth, setEndMonth] = useState<Month>(months[0]);
  const [selectedType, setSelectedType] = useState<string>('EA');
  const [selectedRegion, setSelectedRegion] = useState<string>('Select Region');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Simulate data fetching
    setTimeout(() => setLoading(false), 1000);
  }, []);

  const data = selectedType === 'EA' ? EAData : CSPData;

  useEffect(() => {
   
  }, [EAData, CSPData, selectedType, selectedRegion]);

  const handleStartMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStartMonth(e.target.value as Month);
  };

  const handleEndMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setEndMonth(e.target.value as Month);
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedType(e.target.value);
  };

  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRegion(e.target.value);
  };

  const getTotalConsumption = (item: QueryData, startMonth: Month, endMonth: Month): number => {
    const startIndex = months.indexOf(startMonth);
    const endIndex = months.indexOf(endMonth);
    const monthsRange = months.slice(startIndex, endIndex + 1);
    
    
    const total = monthsRange.reduce((total, month) => {
      const consumption = item[month as keyof QueryData] as number;
      return total + (consumption || 0);
    }, 0);
    
    return total;
  };

  const filteredData = data
    .filter(item => {
      const regionMatch = selectedRegion === 'Select Region' || item.region.trim() === selectedRegion.trim();
      return regionMatch;
    })
    .map(item => {
      const totalConsumption = getTotalConsumption(item, startMonth, endMonth);
      return {
        ...item,
        totalConsumption
      };
    })
    .sort((a, b) => b.totalConsumption - a.totalConsumption)
    .slice(0, 10);


  const handleBarClick = (data: any) => {
    const link = selectedType === 'EA'
      ? `/EA/${data.customer_name}`
      : `/CSP/${data.customer_name}`;
    window.open(link, '_blank');
  };

  const formatYAxisTick = (tick: number) => `${(tick / 1_000_000).toFixed(0)}M`;

  const formatXAxisTick = (tick: string) => {
    const maxLength = 15;
    const words = tick.split(' ');
    if (tick.length > maxLength) {
      return words[0];
    }
    return tick;
  };

  const renderCustomizedLabel = (props: any) => {
    const { x, y, width, value } = props;
    return (
      <text 
        x={x + width / 2} 
        y={y - 10} 
        fill="#666" 
        textAnchor="middle" 
        dominantBaseline="middle"
        fontSize="12"
      >
        {`${(value / 1_000_000).toFixed(2)}M`}
      </text>
    );
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2 className='text-[#9C2E2D] font-bold text-xl' style={{ marginBottom: '20px' }}>Top 10 Consumers</h2>
      <div style={{ marginBottom: '20px' }}>
        <label>
          Start Month:
          <select value={startMonth} onChange={handleStartMonthChange} style={{ margin: '0 10px' }}>
            {months.map(month => (
              <option key={month} value={month}>
                {month.charAt(0).toUpperCase() + month.slice(1)}
              </option>
            ))}
          </select>
        </label>
        <label>
          End Month:
          <select value={endMonth} onChange={handleEndMonthChange} style={{ margin: '0 10px' }}>
            {months.map(month => (
              <option key={month} value={month}>
                {month.charAt(0).toUpperCase() + month.slice(1)}
              </option>
            ))}
          </select>
        </label>
        <label>
          Type:
          <select value={selectedType} onChange={handleTypeChange} style={{ margin: '0 10px' }}>
            <option value="EA">EA</option>
            <option value="CSP">CSP</option>
          </select>
        </label>
        <label>
          Region:
          <select value={selectedRegion} onChange={handleRegionChange} style={{ margin: '0 10px' }}>
            {regions.map(region => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
        </label>
      </div>
      {loading ? (
        <div className="spinner-container">
          <div className="spinner"></div>
          <p>Loading data...</p>
        </div>
      ) : (
        <div style={{ height: '500px' }}>
          <ResponsiveContainer>
            <BarChart data={filteredData} onClick={handleBarClick} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="customer_name" tickFormatter={formatXAxisTick} />
              <YAxis tickFormatter={formatYAxisTick} domain={[0, (dataMax: number) => dataMax + 500000]} />
              <Tooltip formatter={(value: number) => `${(value / 1_000_000).toFixed(2)}M`} />
              <Legend />
              <Bar dataKey="totalConsumption" fill="#3091c9" barSize={70}>
                {filteredData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    cursor="pointer"
                    onClick={() => handleBarClick(entry)}
                  />
                ))}
                <LabelList dataKey="totalConsumption" content={renderCustomizedLabel} position="top" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default TopConsumers;
