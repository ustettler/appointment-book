import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import styles from './Calendar.module.css'; // Importiere das CSS-Modul

const Calendar = () => {
  const [selectedDateTime, setSelectedDateTime] = useState(null);
  const [availability, setAvailability] = useState({});

  useEffect(() => {
    const cachedAvailability = localStorage.getItem('availability');
    if (cachedAvailability) {
      setAvailability(JSON.parse(cachedAvailability));
    } else {
      const initialAvailability = generateInitialAvailability();
      setAvailability(initialAvailability);
      localStorage.setItem('availability', JSON.stringify(initialAvailability));
    }
  }, []);

  const generateInitialAvailability = () => {
    const initialAvailability = {};
    const currentDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 30); // 30 Tage ab dem aktuellen Datum
    while (currentDate < endDate) {
      initialAvailability[currentDate.toISOString()] = Math.random() < 0.8; // Zufällige Verfügbarkeit
      currentDate.setDate(currentDate.getDate() + 1); // Nächster Tag
    }
    return initialAvailability;
  };

  const bookAppointment = () => {
    if (!selectedDateTime) {
      alert("Bitte wählen Sie ein Datum und eine Uhrzeit aus.");
      return;
    }
    const selectedDateTimeString = selectedDateTime.toISOString();
    if (availability[selectedDateTimeString]) {
      const updatedAvailability = { ...availability, [selectedDateTimeString]: false };
      setAvailability(updatedAvailability);
      localStorage.setItem('availability', JSON.stringify(updatedAvailability));
      alert(`Termin am ${selectedDateTimeString} erfolgreich gebucht!`);
    } else {
      alert(`Der Termin am ${selectedDateTimeString} ist bereits gebucht.`);
    }
  };

  return (
    <div className={styles.calendar}>
      <h2>Kalender</h2>
      <div className={styles.datePickerContainer}>
        <DatePicker
          selected={selectedDateTime}
          onChange={date => setSelectedDateTime(date)}
          showTimeSelect
          timeFormat="HH:mm"
          timeIntervals={15}
          timeCaption="Uhrzeit"
          dateFormat="yyyy-MM-dd HH:mm"
          className={styles.datePicker}
        />
        <button onClick={bookAppointment} className={styles.bookButton}>Buchen</button>
      </div>
      <ul className={styles.dateList}>
        {Object.keys(availability).map(dateTimeString => (
          <li key={dateTimeString} className={styles.dateItem}>
            <span className={availability[dateTimeString] ? styles.available : styles.booked}>{dateTimeString}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Calendar;

