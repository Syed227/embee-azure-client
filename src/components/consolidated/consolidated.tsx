import { useState, useEffect } from "react";

interface CompanyData {
  account_manager: string;
  customer_name: string;
  region: string;
  total: number;
  jan: number | null;
  feb: number | null;
  march: number | null;
  april: number | null;
  may: number | null;
  june: number | null;
  july: number | null;
  aug: number | null;
  sep: number | null;
  oct: number | null;
  nov: number | null;
  dec: number | null;
}

export default function ConsolidatedViewEA() {
  const [companiesData, setCompaniesData] = useState<CompanyData[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<CompanyData[]>([]);
  const [accountManagers, setAccountManagers] = useState<string[]>([]);
  const [regions, setRegions] = useState<string[]>([]);
  const [selectedAccountManager, setSelectedAccountManager] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSortCriteria, setSelectedSortCriteria] = useState("selectSorting");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetch('http://10.1.0.4:3000/get-all-ea')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setCompaniesData(data);
        setFilteredCompanies(data); // Initialize filtered data with all companies
        extractFilters(data); // Extract unique account managers and regions
        console.log("Data received");
      })
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
      });
  }, []);

  // Function to extract unique account managers and regions
  const extractFilters = (data: CompanyData[]) => {
    const uniqueAccountManagers = Array.from(new Set(data.map(company => company.account_manager)));
    const uniqueRegions = Array.from(new Set(data.map(company => company.region)));
    setAccountManagers(uniqueAccountManagers);
    setRegions(uniqueRegions);
  };

  // Update filteredCompanies when filters, searchTerm, or companiesData change
  useEffect(() => {
    const filtered = companiesData.filter(company =>
      (selectedAccountManager === "" || company.account_manager === selectedAccountManager) &&
      (selectedRegion === "" || company.region === selectedRegion) &&
      company.customer_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCompanies(filtered);
  }, [selectedAccountManager, selectedRegion, searchTerm, companiesData]);

  const currentMonth = new Date().getMonth(); // 0 for January, 1 for February, etc.
  const monthNames = ["jan", "feb", "march", "april", "may", "june", "july", "aug", "sep", "oct", "nov", "dec"];

  const getPreviousMonthData = (company: CompanyData) => {
    if (currentMonth === 0) return null; // No previous month if current month is January

    const prevMonth = monthNames[currentMonth - 1];
    const prevPrevMonth = monthNames[currentMonth - 2];
    
    const prevMonthValue = (company[prevMonth as keyof CompanyData] ?? 0) as number;
    const prevPrevMonthValue = (company[prevPrevMonth as keyof CompanyData] ?? 0) as number;
    
    const difference = prevMonthValue - prevPrevMonthValue;
    const percentageChange = prevPrevMonthValue !== 0 ? (difference / prevPrevMonthValue) * 100 : 0;

    return { prevMonthValue, difference, percentageChange, month: prevMonth.charAt(0).toUpperCase() + prevMonth.slice(1) };
  };

  // Handle sorting function based on selected criteria
  const handleSort = (criteria: string) => {
    if (criteria === "selectSorting") {
      setFilteredCompanies(companiesData); // Reset to original order
    } else {
      let sortedCompanies = [...filteredCompanies];
      switch (criteria) {
        case 'total':
          sortedCompanies.sort((a, b) => b.total - a.total);
          break;
        case 'previousMonth':
          sortedCompanies.sort((a, b) => {
            const aPrevMonth = getPreviousMonthData(a)?.prevMonthValue ?? 0;
            const bPrevMonth = getPreviousMonthData(b)?.prevMonthValue ?? 0;
            return bPrevMonth - aPrevMonth;
          });
          break;
        case 'change':
          sortedCompanies.sort((a, b) => {
            const aChange = getPreviousMonthData(a)?.difference ?? 0;
            const bChange = getPreviousMonthData(b)?.difference ?? 0;
            return bChange - aChange;
          });
          break;
        default:
          break;
      }
      setFilteredCompanies(sortedCompanies);
    }
    setSelectedSortCriteria(criteria); // Update selected sort criteria
  };

  // Calculate the paginated data based on filtered companies
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = filteredCompanies.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredCompanies.length / itemsPerPage);

  // Function to format numbers with Indian convention (rupee symbol and commas)
  const formatNumber = (num: number | null) => {
    if (num === null || isNaN(num)) return '-';
    return num.toLocaleString('en-IN', { style: 'currency', currency: 'INR' }).slice(0, -3); // Remove decimal part and currency symbol
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl mb-4">Consolidated View</h1>
      <div className="mb-4 flex space-x-4">
        {/* Account Manager Filter */}
        <select
          className="border px-3 py-2 rounded"
          value={selectedAccountManager}
          onChange={(e) => setSelectedAccountManager(e.target.value)}
        >
          <option value="">Select Account Manager</option>
          {accountManagers.map((manager, index) => (
            <option key={index} value={manager}>{manager}</option>
          ))}
        </select>
        {/* Region Filter */}
        <select
          className="border px-3 py-2 rounded"
          value={selectedRegion}
          onChange={(e) => setSelectedRegion(e.target.value)}
        >
          <option value="">Select Region</option>
          {regions.map((region, index) => (
            <option key={index} value={region}>{region}</option>
          ))}
        </select>
        {/* Search Input */}
        <input
          type="text"
          placeholder="Search by company name"
          className="border px-3 py-2 rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {/* Sort By Dropdown */}
        <select
          className="border px-3 py-2 rounded"
          value={selectedSortCriteria}
          onChange={(e) => {
            setSelectedSortCriteria(e.target.value);
            handleSort(e.target.value);
          }}
        >
          <option value="selectSorting">Select Sorting</option>
          <option value="total">Sort by Total</option>
          <option value="previousMonth">Sort by Previous Month Spending</option>
          <option value="change">Sort by Change from Previous Month</option>
        </select>
      </div>
      <ul className="space-y-4">
        {currentData.map((company, index) => {
          const prevMonthData = getPreviousMonthData(company);
          return (
            <li 
              key={index} 
              className="p-4 border rounded shadow-sm bg-white"
            >
              <div className="font-bold text-xl mb-2">{company.customer_name}</div>
              <div className="text-gray-700">
                <p><strong>Account Manager:</strong> {company.account_manager}</p>
                <p><strong>Region:</strong> {company.region}</p>
                <p><strong>Total:</strong> {formatNumber(company.total)}</p>
                {prevMonthData && (
                  <div className="mt-2">
                    <p><strong>{prevMonthData.month}:</strong> {formatNumber(prevMonthData.prevMonthValue)}</p>
                    <p>
                      <strong>Change from previous month:</strong> 
                      <span className={prevMonthData.difference >= 0 ? 'text-green-500' : 'text-red-500'}>
                        {formatNumber(prevMonthData.difference)} ({prevMonthData.percentageChange.toFixed(2)}%)
                      </span>
                    </p>
                  </div>
                )}
              </div>
            </li>
          );    {/** bg-[#ab2026] */}
        })}
      </ul>
      <div className="mt-4 flex justify-center space-x-2">
        <button
          className="px-3 py-1 border rounded bg-[#ab2026] "
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            className={`px-3 py-1 border rounded ${currentPage === index + 1 ? 'bg-[#1D4568] text-white' : 'bg-gray-200'}`}
            onClick={() => setCurrentPage(index + 1)}
          >
            {index + 1}
          </button>
        ))}
        <button
          className="px-3 py-1 border rounded bg-gray-200"
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}
