import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import { CiStar } from "react-icons/ci";
import { FaStar } from "react-icons/fa";


export default function ResponsiveDatePickers() {
  // Initialize state for the selected date, fetched data, search query, and favorites
  const [selectedDate, setSelectedDate] = useState(dayjs('2022-04-17'));
  const [births, setBirths] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState({});

  // Fetch data from the Wikimedia API whenever the selected date changes
  useEffect(() => {
    const fetchBirths = async () => {
      const MM = selectedDate.format('MM');
      const DD = selectedDate.format('DD');
      const response = await fetch(`https://api.wikimedia.org/feed/v1/wikipedia/en/onthisday/births/${MM}/${DD}`);
      const data = await response.json();
      setBirths(data.births || []);
    };

    fetchBirths();
  }, [selectedDate]);

  // Handle date change
  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
  };

  // Handle search input change
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Toggle favorite status
  const toggleFavorite = (birth) => {
    setFavorites((prevFavorites) => {
      const dateKey = selectedDate.format('YYYY-MM-DD');
      const currentFavorites = prevFavorites[dateKey] || [];
      if (currentFavorites.includes(birth)) {
        return {
          ...prevFavorites,
          [dateKey]: currentFavorites.filter((favorite) => favorite !== birth)
        };
      } else {
        return {
          ...prevFavorites,
          [dateKey]: [...currentFavorites, birth]
        };
      }
    });
  };

  // Filtered births based on search query
  const filteredBirths = births.filter((birth) =>
    birth.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get current favorites for the selected date
  const dateKey = selectedDate.format('YYYY-MM-DD');
  const favoriteBirths = (favorites[dateKey] || []).filter((birth) =>
    birth.text.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const nonFavoriteBirths = filteredBirths.filter((birth) => !favoriteBirths.includes(birth));

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['StaticDatePicker']}>
        <DemoItem label="Select A Date To Find Amazing People Birth Days">
          <StaticDatePicker
            defaultValue={selectedDate}
            onChange={handleDateChange}
          />
        </DemoItem>
      </DemoContainer>
      <div>
        <h2>Notable Births on {selectedDate.format('MMMM D')}</h2>
        <input
          type="text"
          placeholder="Search for a person"
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <h3>Favorites</h3>
        <ul>
          {favoriteBirths.map((birth, index) => (
            <li key={index}>
               {birth.text}
              <button onClick={() => toggleFavorite(birth)}>
                {favorites[dateKey].includes(birth) ? <FaStar color="yellow" /> : <CiStar />}
              </button>
            </li>
          ))}
        </ul>
        <h3>Others</h3>
        <ul>
          {nonFavoriteBirths.map((birth, index) => (
            <li key={index}>
              {birth.text}
              <button onClick={() => toggleFavorite(birth)}>
                {favorites[dateKey] && favorites[dateKey].includes(birth) ? <FaStar color="yellow"/> : <CiStar />}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </LocalizationProvider>
  );
}
