

import { Link } from "react-router-dom";
import { useState, useContext } from "react";
import "./card.scss";
import apiRequest from "../../lib/apiRequest";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Card({ item, onDelete, onSave, isInitiallySaved = false }) {
  const isDeletable = onDelete !== undefined;
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [isSaved, setIsSaved] = useState(isInitiallySaved);

  const handleSave = async () => {
    if (!currentUser) {
      return navigate("/login");
    }

    // Update UI optimistic
    const newSavedState = !isSaved;
    setIsSaved(newSavedState);

    try {
      await apiRequest.post("/users/save", { postId: item.id });
      // Notifică componenta părinte despre schimbare
      if (onSave) {
        onSave(item.id, newSavedState);
      }
    } catch (err) {
      console.log(err);
      // Revert dacă a eșuat
      setIsSaved(!newSavedState);
    }
  };

  const handleChat = async () => {
    if (!currentUser) {
      return navigate("/login");
    }

    // Nu permite chat cu propriile postări
    if (item.user && item.user.id === currentUser.id) {
      return;
    }

    try {
      // Încearcă să creezi un chat nou sau să găsești unul existent
      const res = await apiRequest.post("/chats", {
        receiverId: item.userId || item.user?.id,
      });

      // Redirecționează către profil cu chat-ul deschis
      navigate(`/profile?chatId=${res.data.id}`);
    } catch (err) {
      console.log("Error creating chat:", err);
      // Dacă chat-ul există deja, încearcă să-l găsești
      try {
        const chatsRes = await apiRequest.get("/chats");
        const existingChat = chatsRes.data.find((chat) =>
          chat.userIDs.includes(item.userId || item.user?.id)
        );

        if (existingChat) {
          navigate(`/profile?chatId=${existingChat.id}`);
        }
      } catch (findErr) {
        console.log("Error finding existing chat:", findErr);
      }
    }
  };

  const handleConfirmDelete = () => {
    onDelete(item.id);
    setShowModal(false);
  };

  // Verifică dacă este propria postare
  const isOwnPost =
    item.userId === currentUser?.id || item.user?.id === currentUser?.id;

  return (
    <div className="card">
      <Link to={`/${item.id}`} className="imageContainer">
        <img src={item.images[0]} alt="" />
      </Link>
      <div className="textContainer">
        <h2 className="title">
          <Link to={`/${item.id}`}>{item.title}</Link>
        </h2>
        <p className="address">
          <img src="/pin.png" alt="" />
          <span>{item.address}</span>
        </p>
        <p className="price">€ {item.price}</p>
        <div className="bottom">
          <div className="features">
            <div className="feature">
              <img src="/bed.png" alt="" />
              <span>{item.bedroom} camere</span>
            </div>
            <div className="feature">
              <img src="/bath.png" alt="" />
              <span>{item.bathroom} băi</span>
            </div>
          </div>
          <div className="icons">
            <div
              className="icon"
              onClick={handleSave}
              style={{ backgroundColor: isSaved ? "#ffa7a7" : "white" }}
            >
              <img src="/save.png" alt="" />
            </div>
            {isDeletable && (
              <div className="icon" onClick={() => setShowModal(true)}>
                <img src="/delete.png" alt="" />
              </div>
            )}
            {/* Doar afișează butonul de chat dacă nu e propria postare */}
            {!isOwnPost && (
              <div className="icon" onClick={handleChat}>
                <img src="/chat.png" alt="" />
              </div>
            )}
          </div>
        </div>
      </div>
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <p>Ești sigur că vrei să ștergi acest anunț?</p>
            <button className="confirm-btn" onClick={handleConfirmDelete}>
              Da, șterge
            </button>
            <button className="cancel-btn" onClick={() => setShowModal(false)}>
              Anulează
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Card;
