import "./BookingSummary.scss";

function BookingSummary({
  selectedDates,
  pricePerNight,
  nights,
  totalPrice,
  onBook,
  isBooking,
}) {
  const formatDate = (date) => {
    return date.toLocaleDateString("ro-RO", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="booking-summary">
      <div className="booking-dates">
        <div className="date-info">
          <label>Check-in</label>
          <span>{formatDate(selectedDates.checkIn)}</span>
        </div>
        <div className="date-info">
          <label>Check-out</label>
          <span>{formatDate(selectedDates.checkOut)}</span>
        </div>
      </div>

      <div className="price-breakdown">
        <div className="price-line">
          <span>
            €{pricePerNight} × {nights} {nights === 1 ? "noapte" : "nopți"}
          </span>
          <span>€{pricePerNight * nights}</span>
        </div>

        <div className="price-line total">
          <span>Total</span>
          <span>€{totalPrice}</span>
        </div>
      </div>

      <button className="book-button" onClick={onBook} disabled={isBooking}>
        {isBooking ? (
          <>
            <span className="spinner"></span>
            Se rezervă...
          </>
        ) : (
          "Rezervă acum"
        )}
      </button>

      <p className="booking-notice">
        Nu vei fi taxat încă. Confirmarea rezervării se face prin contactarea
        proprietarului.
      </p>
    </div>
  );
}

export default BookingSummary;
