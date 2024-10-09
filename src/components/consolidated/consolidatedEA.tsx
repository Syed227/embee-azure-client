import  { useState, useEffect } from "react";
import { Link } from "react-router-dom";
interface QueryData {
  sno: number;
  region: string;
  account_manager: string;
  customer_name: string;
  enrollment_number: number;
  markup: number;
  jan: number;
  feb: number;
  march: number;
  april: number;
  may: number;
  june: number;
  july: number;
  aug: number;
  sep: number;
  oct: number;
  nov: number;
  dec: number;
  total: number;
}

type Props = {
  data: QueryData[];
};

export default function ConsolidatedViewEA({ data }: Props) {
  const [companiesData, setCompaniesData] = useState<QueryData[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<QueryData[]>([]);
  const [accountManagers, setAccountManagers] = useState<string[]>([]);
  const [regions, setRegions] = useState<string[]>([]);
  const [selectedAccountManager, setSelectedAccountManager] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSortCriteria, setSelectedSortCriteria] = useState("selectSorting");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    setCompaniesData(data);
    extractFilters(data); // Extract unique account managers and regions
  }, [data]);

  // Function to extract unique account managers and regions
  const extractFilters = (data: QueryData[]) => {
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

  const getPreviousMonthData = (company: QueryData) => {
    if (currentMonth === 0) return null; // No previous month if current month is January

    const prevMonth = monthNames[currentMonth - 1];
    const prevPrevMonth = monthNames[currentMonth - 2];
    
    const prevMonthValue = (company[prevMonth as keyof QueryData] ?? 0) as number;
    const prevPrevMonthValue = (company[prevPrevMonth as keyof QueryData] ?? 0) as number;
    
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

  // Function to get the color class based on the value
  const getColorClass = (value: number) => {
    return value > 0 ? 'text-green-500' : value < 0 ? 'text-red-500' : 'text-black';
  };

  return (
    <div className="p-4">
    <h1  className="text-3xl font-extrabold p-3 my-6 heading">Consolidated View (EA) </h1>

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
          <li key={index} className="p-4 border rounded shadow-sm bg-white">
            <Link to={`/EA/${company.customer_name}`} className="block">
              <div className="font-bold text-xl mb-2">{company.customer_name}</div>
              <p>Account Manager: {company.account_manager}</p>
              <p>Region: {company.region}</p>
              <p>Total: {formatNumber(company.total)}</p>
              {prevMonthData && (
                <>
                  <p>{prevMonthData.month}: {formatNumber(prevMonthData.prevMonthValue)}</p>
                  <p>
                    Change: <span className={getColorClass(prevMonthData.difference)}>{formatNumber(prevMonthData.difference)} ({prevMonthData.percentageChange.toFixed(2)}%)</span>
                  </p>
                </>
              )}
            </Link>
          </li>
        );
      })}
    </ul>
      {/* Pagination Controls */}
      <div className="mt-4 flex justify-center space-x-4">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
          <button
            key={page}
            className={`px-4 py-2 border rounded ${currentPage === page ? 'bg-gray-200' : ''}`}
            onClick={() => setCurrentPage(page)}
          >
            {page}
          </button>
        ))}
      </div>
    </div>
  );
}
