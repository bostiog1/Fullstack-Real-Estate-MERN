import { useState, useEffect } from "react";
import apiRequest from "../../lib/apiRequest";
import "./BookingManagement.scss";

function BookingManagement() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await apiRequest.get("/bookings/user-bookings");
      setBookings(res.data);
    } catch (err) {
      console.error("Failed to fetch bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("Ești sigur că vrei să anulezi această rezervare?")) {
      return;
    }

    setCancelling(bookingId);
    try {
      await apiRequest.delete(`/bookings/${bookingId}`);
      setBookings(bookings.filter((booking) => booking.id !== bookingId));
      alert("Rezervarea a fost anulată cu succes!");
    } catch (err) {
      const message =
        err.response?.data?.message || "Eșec la anularea rezervării.";
      alert(message);
    } finally {
      setCancelling(null);
    }
  };

  const canCancelBooking = (checkInDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(checkInDate) > today;
  };

  const getBookingStatus = (booking) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkIn = new Date(booking.checkInDate);
    const checkOut = new Date(booking.checkOutDate);

    if (checkOut < today) {
      return { status: "completed", label: "Completată", color: "#28a745" };
    } else if (checkIn <= today && checkOut >= today) {
      return { status: "active", label: "În curs", color: "#ffc107" };
    } else {
      return { status: "upcoming", label: "Viitoare", color: "#007bff" };
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("ro-RO", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="booking-management">
        <div className="loading">Se încarcă rezervările...</div>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="booking-management">
        <div className="empty-state">
          <h3>Nu ai rezervări</h3>
          <p>Când vei face o rezervare, aceasta va apărea aici.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-management">
      <h2>Rezervările mele</h2>

      <div className="bookings-list">
        {bookings.map((booking) => {
          const bookingStatus = getBookingStatus(booking);

          return (
            <div key={booking.id} className="booking-card">
              <div className="booking-image">
                <img
                  src={booking.post.images[0] || "/default-property.jpg"}
                  alt={booking.post.title}
                />
                <div
                  className="status-badge"
                  style={{ backgroundColor: bookingStatus.color }}
                >
                  {bookingStatus.label}
                </div>
              </div>

              <div className="booking-info">
                <h3>{booking.post.title}</h3>
                <p className="address">{booking.post.address}</p>

                <div className="booking-dates">
                  <div className="date-range">
                    <span className="date-label">Check-in:</span>
                    <span className="date-value">
                      {formatDate(booking.checkInDate)}
                    </span>
                  </div>
                  <div className="date-range">
                    <span className="date-label">Check-out:</span>
                    <span className="date-value">
                      {formatDate(booking.checkOutDate)}
                    </span>
                  </div>
                </div>

                <div className="booking-price">
                  <span className="total">
                    Total plătit: €{booking.totalPrice}
                  </span>
                </div>

                <div className="booking-meta">
                  <span className="booking-date">
                    Rezervat pe {formatDate(booking.createdAt)}
                  </span>
                </div>
              </div>

              <div className="booking-actions">
                {canCancelBooking(booking.checkInDate) && (
                  <button
                    className="cancel-btn"
                    onClick={() => handleCancelBooking(booking.id)}
                    disabled={cancelling === booking.id}
                  >
                    {cancelling === booking.id ? "Se anulează..." : "Anulează"}
                  </button>
                )}

                <button
                  className="view-btn"
                  onClick={() =>
                    window.open(`/properties/${booking.post.id}`, "_blank")
                  }
                >
                  Vezi proprietatea
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default BookingManagement;
