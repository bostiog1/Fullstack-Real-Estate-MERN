import { useState, useEffect } from "react";
import "./BookingCalendar.scss";

function BookingCalendar({ postId, onDateSelect, isRentable }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDates, setSelectedDates] = useState({
    checkIn: null,
    checkOut: null,
  });
  const [bookedDates, setBookedDates] = useState([]);
  const [isSelectingCheckOut, setIsSelectingCheckOut] = useState(false);

  useEffect(() => {
    if (isRentable && postId.length >= 24) {
      fetch(`http://localhost:8800/api/bookings/booked-dates/${postId}`)
        .then((res) => res.json())
        .then((data) => setBookedDates(data))
        .catch((err) => console.log(err));
    }
  }, [postId, isRentable]);

  const getDaysInMonth = (date) => {
    const start = new Date(date.getFullYear(), date.getMonth(), 1);
    const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    const days = [];

    const startDay = start.getDay();
    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }

    for (let day = 1; day <= end.getDate(); day++) {
      days.push(new Date(date.getFullYear(), date.getMonth(), day));
    }

    return days;
  };

  const isDateBooked = (date) => {
    if (!date) return false;

    return bookedDates.some((booking) => {
      const checkIn = new Date(booking.checkInDate);
      const checkOut = new Date(booking.checkOutDate);
      return date >= checkIn && date <= checkOut;
    });
  };

  const isDateSelected = (date) => {
    if (!date || (!selectedDates.checkIn && !selectedDates.checkOut))
      return false;

    if (selectedDates.checkIn && selectedDates.checkOut) {
      return date >= selectedDates.checkIn && date <= selectedDates.checkOut;
    }

    return date.getTime() === selectedDates.checkIn?.getTime();
  };

  const isDateInPast = (date) => {
    if (!date) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const handleDateClick = (date) => {
    if (!date || isDateBooked(date) || isDateInPast(date) || !isRentable)
      return;

    if (
      !selectedDates.checkIn ||
      (selectedDates.checkIn && selectedDates.checkOut)
    ) {
      setSelectedDates({ checkIn: date, checkOut: null });
      setIsSelectingCheckOut(true);
    } else if (isSelectingCheckOut) {
      if (date > selectedDates.checkIn) {
        const newSelection = { checkIn: selectedDates.checkIn, checkOut: date };

        const hasBookingBetween = bookedDates.some((booking) => {
          const checkIn = new Date(booking.checkInDate);
          const checkOut = new Date(booking.checkOutDate);
          return (
            (checkIn > selectedDates.checkIn && checkIn < date) ||
            (checkOut > selectedDates.checkIn && checkOut < date)
          );
        });

        if (!hasBookingBetween) {
          setSelectedDates(newSelection);
          setIsSelectingCheckOut(false);
          onDateSelect(newSelection);
        } else {
          alert("Nu puteți rezerva peste o perioadă deja rezervată!");
        }
      } else {
        setSelectedDates({ checkIn: date, checkOut: null });
      }
    }
  };

  const nextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
    );
  };

  const prevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
    );
  };

  const getDayClass = (date) => {
    let classes = ["calendar-day"];

    if (!date) return "calendar-day empty";
    if (isDateInPast(date)) classes.push("past");
    if (isDateBooked(date)) classes.push("booked");
    if (isDateSelected(date)) classes.push("selected");
    if (date.getTime() === selectedDates.checkIn?.getTime())
      classes.push("check-in");
    if (date.getTime() === selectedDates.checkOut?.getTime())
      classes.push("check-out");

    return classes.join(" ");
  };

  if (!isRentable) {
    return (
      <div className="booking-calendar-container">
        <p className="not-rentable">
          Această proprietate nu este disponibilă pentru închiriere.
        </p>
      </div>
    );
  }

  const days = getDaysInMonth(currentMonth);
  const monthNames = [
    "Ianuarie",
    "Februarie",
    "Martie",
    "Aprilie",
    "Mai",
    "Iunie",
    "Iulie",
    "August",
    "Septembrie",
    "Octombrie",
    "Noiembrie",
    "Decembrie",
  ];

  return (
    <div className="booking-calendar-container">
      <div className="calendar-header">
        <button onClick={prevMonth} className="nav-btn">
          ‹
        </button>
        <h3>
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h3>
        <button onClick={nextMonth} className="nav-btn">
          ›
        </button>
      </div>

      <div className="calendar-weekdays">
        {["D", "L", "M", "M", "J", "V", "S"].map((day) => (
          <div key={day} className="weekday">
            {day}
          </div>
        ))}
      </div>

      <div className="calendar-grid">
        {days.map((date, index) => (
          <div
            key={index}
            className={getDayClass(date)}
            onClick={() => handleDateClick(date)}
          >
            {date ? date.getDate() : ""}
          </div>
        ))}
      </div>

      <div className="calendar-legend">
        <div className="legend-item">
          <div className="legend-color booked"></div>
          <span>Rezervat</span>
        </div>
        <div className="legend-item">
          <div className="legend-color selected"></div>
          <span>Selectat</span>
        </div>
        <div className="legend-item">
          <div className="legend-color past"></div>
          <span>Trecut</span>
        </div>
      </div>

      {selectedDates.checkIn && selectedDates.checkOut && (
        <div className="selected-period">
          <p>
            <strong>Check-in:</strong>{" "}
            {selectedDates.checkIn.toLocaleDateString("ro-RO")}
          </p>
          <p>
            <strong>Check-out:</strong>{" "}
            {selectedDates.checkOut.toLocaleDateString("ro-RO")}
          </p>
        </div>
      )}
    </div>
  );
}

export default BookingCalendar;
