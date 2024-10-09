import React, { useState } from 'react';
import * as XLSX from 'xlsx';

const ExcelViewer: React.FC = () => {
  const [data, setData] = useState<any[][]>([]);
  const [originalData, setOriginalData] = useState<any[][]>([]);
  const [errorCount, setErrorCount] = useState<number>(0);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event: ProgressEvent<FileReader>) => {
      const arrayBuffer = event.target?.result;
      if (arrayBuffer) {
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        let jsonData: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });
        jsonData = jsonData.filter(row => row.some(cell => cell !== 0 && cell !== null && cell !== undefined && cell !== ''));

        setOriginalData(jsonData);

        // Fill empty values with zero and replace empty cells in column 3 with "NULL_NUM"
        const filledData = jsonData.map(row =>
          row.map((cell, index) => {
            if (index === 3 && (cell === '' || cell === null || cell === undefined)) {
              return 404;
            }
            return cell === '' ? 0 : cell;
          })
        );
        setData(filledData);
        countErrors(filledData);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const isNumeric = (value: any) => {
    return !isNaN(Number(value)) && value !== '';
  };

  const containsSpecialChars = (value: string) => {
    const regex = /[^a-zA-Z0-9]/;
    return regex.test(value);
  };

  const countErrors = (data: any[][]) => {
    let count = 0;
    data.slice(1).forEach(row => {
      // Check for numeric values in the cells starting from index 6
      row.slice(6).forEach(cell => {
        if (!isNumeric(cell) && cell !== 0) {
          count++;
        }
      });

      // Check for special characters in column index 3
      // const columnIndex = 3;
      // if (containsSpecialChars(row[columnIndex])) {
      //   count++;
      // }

      // Check for empty spaces in column index 1
      const columnIndex1 = 1;
      const valueInColumn1 = row[columnIndex1];
      if (typeof valueInColumn1 === 'string' && (valueInColumn1.trim() !== valueInColumn1)) {
        count++;
      }
    });

    setErrorCount(count);
    if (count > 0) {
      alert(`Please make sure data is in correct format. Errors: ${count}. Remove unnecessary spaces and special characters.`);
    }
  };

  const sendDataToBackend = async () => {
    try {
    const renderURL = `https://azure-embee-server.onrender.com/excel-data-csp`;
    // const renderURL = `http://4.240.47.21:3000/excel-data-csp`;
      const body = {
        GetURL: 'http://4.240.47.21:3000/excel-data-csp',
        data: originalData,
      };

      const response = await fetch(renderURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        console.log(response.status);
        alert("Data sent to backend. Please refresh dashboard for update. Response Status: " + response.status);
      } else {
        alert("Failed to send data to backend " + response.statusText + " Response Code: " + response.status);
      }
    } catch (error: any) {
      alert('Error in sending data to backend');
      console.error('Error in sendDataToBackend:', error);

      if (error instanceof TypeError) {
        alert(`Network error: ${error.message}`);
      } else {
        alert(`Error: ${error.message}`);
      }

      throw error;
    }
  };

  const formatNumber = (value: any, columnIndex: number) => {
    // Skip formatting for enrollment number (assumed column index 0) and "NULL_NUM" in column 3
    if (columnIndex === 0 || (columnIndex === 3 && value === 404)) return value;
    if (!isNumeric(value) && value !== 0) return value;
    const number = Number(value);
    return new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2
    }).format(number);
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl">Update CSP Data</h1>
      <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} className="mb-4" />
      <button onClick={sendDataToBackend} className="bg-[#ab2026] hover:bg-[#1D4568] text-white px-4 py-2 rounded shadow-sm">
        Send Data to Backend
      </button>
      <div className="overflow-auto">
        {data.length > 0 && (
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                {data[0].map((col, index) => (
                  <th key={index} className="border border-gray-300 px-4 py-2 bg-gray-200 text-left">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.slice(1).map((row, rowIndex) => (
                <tr key={rowIndex} className="even:bg-gray-100">
                  {row.map((cell, cellIndex) => (
                    <td
                      key={cellIndex}
                      className={`border border-gray-300 px-4 py-2 ${
                        cellIndex === 1 && (typeof cell === 'string' && (cell.trim() !== cell)) ? 'bg-red-500 text-white' : ''
                      }  ${
                        cellIndex > 5 && !isNumeric(cell) && cell !== 0 ? 'bg-red-500 text-white' : ''
                      }`}
                    >
                      {formatNumber(cell, cellIndex)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ExcelViewer;
