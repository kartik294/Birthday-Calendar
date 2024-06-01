import React, { useState, useEffect } from "react";
import dayjs, { Dayjs } from 'dayjs';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faStar as solidStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as regularStar } from '@fortawesome/free-regular-svg-icons';
library.add(solidStar, regularStar);

interface Birthday {
  name: string;
  date: Dayjs;
}

function Calendar() {
  const [value, setValue] = useState(dayjs());
  const [birthdays, setBirthdays] = useState<Birthday[]>([]);
  const [favourites, setFavourites] = useState<Birthday[]>([]);
  const [searchTerm, setSearchTerm] = useState('');


  useEffect(() => {
    handleDateChange(dayjs());
  }, []);

  
  function handleFavouriteToggle(birthday: Birthday) {
    if (favourites.includes(birthday)) {
      setFavourites(favourites.filter(favouriteItem => favouriteItem !== birthday));
    } else {
      setFavourites([...favourites, birthday]);
    }
  }


  function getIcon(birthday: Birthday) {
    return favourites.includes(birthday) ? solidStar : regularStar;
  }

 
  function getIconString(birthday: Birthday) {
    return favourites.includes(birthday) ? "solid-star" : "regular-star";
  }

  function handleDateChange(date: dayjs.Dayjs): void {
    const month = date.month() + 1; 
    const day = date.date();

 
    setBirthdays([]);

 
    global.fetch(`https://api.wikimedia.org/feed/v1/wikipedia/en/onthisday/births/${month}/${day}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.births !== undefined) {
          const birthdays = data.births.map((person: any) => {
            return {
              name: person.text,
              date: date
            };
          });
          setBirthdays(birthdays);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  
  function handleSearchChange(event: React.ChangeEvent<HTMLInputElement>) {
    setSearchTerm(event.target.value);
  }

  
  const filteredBirthdays = birthdays.filter(birthday =>
    birthday.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <h3>Birthday Calendar</h3>
      <StaticDatePicker
        displayStaticWrapperAs="desktop"
        openTo="day"
        value={value}
        onChange={(newValue: Dayjs | null) => {
          if (newValue) {
            setValue(newValue);
            handleDateChange(newValue);
          }
        }}
        renderInput={(params: JSX.IntrinsicAttributes) => <TextField {...params} inputProps={{ 'data-testid': 'calendar-input' }} />}
      />
      <div>
        {favourites.length > 0 &&
          <div>
            <h4>Birthdays on {value.format('MMMM D')}:</h4>
            <ul className="fa-ul">
              {favourites.map((favourite, index) => (
                <li key={index}>
                  <span className="fa-li">
                    <FontAwesomeIcon icon={getIcon(favourite)} data-testid={getIconString(favourite)} onClick={() => handleFavouriteToggle(favourite)} />
                  </span>
                  {favourite.name} ({favourite.date.format('MMMM D')})
                </li>
              ))}
            </ul>
          </div>
        }
      </div>

      <div>
        {birthdays.length > 0 &&
          <div>
            <h4>Famous birthdays on this date:</h4>
            <TextField
              label="Search Birthdays"
              variant="outlined"
              size="small"  
              sx={{ width: '300px' }}  
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <ul className="fa-ul">
              {filteredBirthdays.map((birthday, index) => (
                <li key={index}>
                  <span className="fa-li">
                    <FontAwesomeIcon icon={getIcon(birthday)} data-testid={getIconString(birthday)} onClick={() => handleFavouriteToggle(birthday)} />
                  </span>
                  {birthday.name}
                </li>
              ))}
            </ul>
          </div>
        }
      </div>
    </LocalizationProvider>
  );
}

export default Calendar;
