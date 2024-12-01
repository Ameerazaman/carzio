import { useState } from "react";
import { FaSearch } from "react-icons/fa"; // Import the search icon
import { Filter } from "../../../Interface/FilterInterface";
import { applyFilters, searchCar } from "../../../Api/User";
import { CarDataInterface } from "../../../Interface/CarInterface";


interface CarFilterProps {
  filteredData: (data: CarDataInterface[]) => void; // Define the type of filteredData
}

function CarFilter({ filteredData }: CarFilterProps) {
  const [filters, setFilters] = useState({
    engineType: [] as string[],
    fuelType: [] as string[],
    sortPrice: "",
    searchQuery: "",
  });

  const handleSearchCar = (async () => {
    try {
      const response = await searchCar(filters.searchQuery);
     
      filteredData(response?.data); // Pass data to the parent
    } catch (error) {
    
    }
  })
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, category: 'engineType' | 'fuelType') => {
    const { value, checked } = e.target;
    setFilters((prevFilters) => {
      const selectedTypes = prevFilters[category] as string[];
      return {
        ...prevFilters,
        [category]: checked
          ? [...selectedTypes, value]
          : selectedTypes.filter((type) => type !== value),
      };
    });
  };

  const handleSortPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      sortPrice: value
    }));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      searchQuery: value
    }));
  };

  const fetchFilteredCars = async (filters: Filter) => {
    try {
      const response = await applyFilters(filters);

      filteredData(response?.data); // Pass data to the parent
    } catch (error) {
     
    }
  };

  return (
    <div className="p-8 bg-gray-800 rounded-lg shadow-lg text-gray-100">
      <h2 className="text-2xl font-bold mb-6 text-center text-red-500">Filter Cars</h2>

      {/* Search Bar */}
      <div className="mb-6 flex justify-center"> {/* Center the flex container */}
        <div className="flex flex-col sm:flex-row items-center">
          <input
            type="text"
            placeholder="Search for cars..."
            value={filters.searchQuery}
            onChange={handleSearchChange}
            className="flex-grow p-3 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-700 text-gray-100 mb-2 sm:mb-0 sm:mr-0"
          />
          <button onClick={handleSearchCar} className="bg-red-500 text-gray-100 rounded-lg p-3 hover:bg-red-400 transition-all duration-200 flex items-center justify-center">
            <FaSearch className="w-5 h-5" />
          </button>
        </div>
      </div>



      <div className="space-y-6">
        {/* Sort Price Options */}
        <div>
          <label className="block font-semibold mb-2 text-red-500">Sort by Price</label>
          <div className="flex flex-col sm:flex-row sm:space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                value="lowToHigh"
                checked={filters.sortPrice === "lowToHigh"}
                onChange={handleSortPriceChange}
                className="text-red-500 focus:ring-red-500"
              />
              <span>Low to High</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                value="highToLow"
                checked={filters.sortPrice === "highToLow"}
                onChange={handleSortPriceChange}
                className="text-red-500 focus:ring-red-500"
              />
              <span>High to Low</span>
            </label>
          </div>
        </div>

        {/* Engine Type Checkbox Group */}
        <div>
          <label className="block font-semibold mb-2 text-red-500">Engine Type</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {["Electric", "Manual", "Automatic"].map((type) => (
              <label key={type} className="flex items-center space-x-2 bg-gray-700 rounded-lg p-2 cursor-pointer hover:bg-gray-600 transition-colors duration-200">
                <input
                  type="checkbox"
                  value={type}
                  checked={filters.engineType.includes(type)}
                  onChange={(e) => handleCheckboxChange(e, "engineType")}
                  className="text-red-500 focus:ring-red-500"
                />
                <span>{type}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Fuel Type Checkbox Group */}
        <div>
          <label className="block font-semibold mb-2 text-red-500">Fuel Type</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {["Petrol", "Diesel", "Electric", "Hybrid"].map((type) => (
              <label key={type} className="flex items-center space-x-2 bg-gray-700 rounded-lg p-2 cursor-pointer hover:bg-gray-600 transition-colors duration-200">
                <input
                  type="checkbox"
                  value={type}
                  checked={filters.fuelType.includes(type)}
                  onChange={(e) => handleCheckboxChange(e, "fuelType")}
                  className="text-red-500 focus:ring-red-500"
                />
                <span>{type}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={() => fetchFilteredCars(filters)} // Wrap in arrow function to pass `filters` directly
        className="mt-8 w-full py-3 bg-red-500 text-gray-100 font-semibold rounded-lg hover:bg-red-400 transition-all duration-200"
      >
        Apply Filters
      </button>
    </div>

  );
}

export default CarFilter;
