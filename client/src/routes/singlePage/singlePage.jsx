import { useState, useEffect, useContext } from "react";
import { useNavigate, useLoaderData } from "react-router-dom";
import DOMPurify from "dompurify";
import { AuthContext } from "../../context/AuthContext";
import apiRequest from "../../lib/apiRequest";
import Slider from "../../components/slider/Slider";
import Map from "../../components/map/Map";
import BookingCalendar from "../../components/calendar/BookingCalendar";
import BookingSummary from "../../components/booking/BookingSummary";
import PropertyFeatures from "../../components/property/PropertyFeatures";
import "./singlePage.scss";

function SinglePage() {
  const post = useLoaderData();
  const [saved, setSaved] = useState(post.isSaved);
  const [selectedDates, setSelectedDates] = useState(null);
  const [isBooking, setIsBooking] = useState(false);
  const [showContactInfo, setShowContactInfo] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSave = async () => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    setSaved((prev) => !prev);
    try {
      await apiRequest.post("/users/save", { postId: post.id });
    } catch (err) {
      console.log(err);
      setSaved((prev) => !prev);
    }
  };

  const handleDateSelect = (dates) => {
    setSelectedDates(dates);
  };

  const calculateTotalPrice = () => {
    if (!selectedDates?.checkIn || !selectedDates?.checkOut) return 0;

    const oneDay = 24 * 60 * 60 * 1000;
    const days = Math.ceil(
      (selectedDates.checkOut - selectedDates.checkIn) / oneDay
    );
    return days * post.price;
  };

  const calculateNights = () => {
    if (!selectedDates?.checkIn || !selectedDates?.checkOut) return 0;

    const oneDay = 24 * 60 * 60 * 1000;
    return Math.ceil((selectedDates.checkOut - selectedDates.checkIn) / oneDay);
  };

  const handleBooking = async () => {
    if (!currentUser) {
      return navigate("/login");
    }

    if (!selectedDates?.checkIn || !selectedDates?.checkOut) {
      return alert("Te rugăm să selectezi datele de check-in și check-out.");
    }

    setIsBooking(true);

    try {
      const res = await apiRequest.post("/bookings", {
        postId: post.id,
        checkInDate: selectedDates.checkIn.toISOString(),
        checkOutDate: selectedDates.checkOut.toISOString(),
      });

      alert(`Rezervare reușită! Total: €${res.data.totalPrice}`);
      setSelectedDates(null);
      window.location.reload();
    } catch (err) {
      const message = err.response?.data?.message || "Rezervarea a eșuat!";
      alert(message);
    } finally {
      setIsBooking(false);
    }
  };

  // const handleContact = () => {
  //   if (!currentUser) {
  //     return navigate("/login");
  //   }
  //   setShowContactInfo(true);
  // };

  const handleContact = async () => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    try {
      // Încearcă să creezi un chat nou sau să găsești unul existent
      const res = await apiRequest.post("/chats", {
        receiverId: post.user?.id || post.userId,
      });

      // Redirecționează către profil cu chat-ul deschis
      navigate(`/profile?chatId=${res.data.id}`);
    } catch (err) {
      console.log("Error creating chat:", err);

      // Dacă chat-ul există deja, încearcă să-l găsești
      try {
        const chatsRes = await apiRequest.get("/chats");
        const existingChat = chatsRes.data.find((chat) =>
          chat.userIDs.includes(post.user?.id || post.userId)
        );

        if (existingChat) {
          navigate(`/profile?chatId=${existingChat.id}`);
        } else {
          console.log("Could not create or find chat");
        }
      } catch (findErr) {
        console.log("Error finding existing chat:", findErr);
      }
    }
  };

  const isOwnProperty =
    currentUser?.id === post.user.id || currentUser?.id === post.userId;

  return (
    <div className="single-page">
      {/* Header Section */}
      <div className="property-header">
        <div className="property-title-section">
          <h1>{post.title}</h1>
          <div className="property-location">
            <img src="/pin.png" alt="Location" />
            <span>{post.address}</span>
          </div>
          <div className="property-price">
            €{post.price}
            {post.isRentable ? "/noapte" : ""}
          </div>
        </div>

        <div className="property-actions">
          <button
            className={`save-btn ${saved ? "saved" : ""}`}
            onClick={handleSave}
          >
            <img src="/save.png" alt="Save" />
            {saved ? "Salvat" : "Salvează"}
          </button>

          {!isOwnProperty && (
            <button className="contact-btn" onClick={handleContact}>
              <img src="/chat.png" alt="Contact" />
              Contactează
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="property-content">
        {/* Left Column */}
        <div className="content-main">
          <div className="image-section">
            <Slider images={post.images} />
          </div>

          {/* Property Details */}
          <div className="property-details">
            <div className="owner-info">
              <img
                src={post.user?.avatar || "/default-avatar.png"}
                alt="Owner"
                className="owner-avatar"
              />
              <div className="owner-details">
                <h3>{post.user?.username}</h3>
                <span>Proprietar</span>
              </div>
              {showContactInfo && (
                <div className="contact-info">
                  <p>Email: {post.user?.email || "Contact prin mesaje"}</p>
                </div>
              )}
            </div>

            <div className="property-specs">
              <div className="spec-item">
                <img src="/bed.png" alt="Bedrooms" />
                <span>{post.bedroom} dormitoare</span>
              </div>
              <div className="spec-item">
                <img src="/bath.png" alt="Bathrooms" />
                <span>{post.bathroom} băi</span>
              </div>
              <div className="spec-item">
                <img src="/size.png" alt="Size" />
                <span>{post.postDetail?.size || "N/A"} mp</span>
              </div>
            </div>

            <div className="property-description">
              <h3>Descriere</h3>
              <div
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(
                    post.postDetail?.desc || "Nu există descriere disponibilă."
                  ),
                }}
              />
            </div>

            <div className="property-info-grid">
              <div className="info-section">
                <h3>Detalii proprietate</h3>
                <div className="info-items">
                  <div className="info-item">
                    <span className="label">Tip tranzacție:</span>
                    <span className="value">
                      {post.type === "cumpara" ? "De vânzare" : "De închiriat"}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="label">Tip proprietate:</span>
                    <span className="value">
                      {post.property === "apartment" ? "Apartament" : "Casă"}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="label">Suprafața:</span>
                    <span className="value">
                      {post.postDetail?.size || "N/A"} mp
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="label">Publicat pe:</span>
                    <span className="value">
                      {new Date(post.createdAt).toLocaleDateString("ro-RO")}
                    </span>
                  </div>
                  {post.isRentable && (
                    <div className="info-item">
                      <span className="label">
                        Disponibil pentru închiriere:
                      </span>
                      <span className="value available">Da</span>
                    </div>
                  )}
                </div>
              </div>

              <PropertyFeatures
                utilities={post.postDetail?.utilities}
                pet={post.postDetail?.pet}
                income={post.postDetail?.income}
              />
            </div>
          </div>

          {/* Map Section */}
          <div className="map-section">
            <h3>Localizare</h3>
            <div className="map-container">
              <Map items={[post]} />
            </div>
          </div>
        </div>

        {/* Right Column - Booking */}
        <div className="booking-sidebar">
          {post.isRentable && !isOwnProperty ? (
            <div className="booking-card">
              <div className="booking-header">
                <h3>Rezervă această proprietate</h3>
                <div className="price-display">
                  €{post.price} <span>/noapte</span>
                </div>
              </div>

              <BookingCalendar
                postId={post.id}
                onDateSelect={handleDateSelect}
                isRentable={post.isRentable}
              />

              {selectedDates?.checkIn && selectedDates?.checkOut && (
                <BookingSummary
                  selectedDates={selectedDates}
                  pricePerNight={post.price}
                  nights={calculateNights()}
                  totalPrice={calculateTotalPrice()}
                  onBook={handleBooking}
                  isBooking={isBooking}
                />
              )}
            </div>
          ) : post.isRentable && isOwnProperty ? (
            <div className="owner-info-card">
              <h3>Aceasta este proprietatea ta</h3>
              <p>Nu poți rezerva propria proprietate.</p>
              <button
                className="manage-btn"
                onClick={() => navigate(`/profile`)}
              >
                Gestionează rezervările
              </button>
            </div>
          ) : (
            <div className="not-rentable-card">
              <h3>Nu este disponibil pentru închiriere</h3>
              <p>Această proprietate este doar pentru vânzare.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SinglePage;
