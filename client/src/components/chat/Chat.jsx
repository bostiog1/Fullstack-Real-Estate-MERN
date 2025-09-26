import { useContext, useEffect, useRef, useState } from "react";
import "./chat.scss";
import { AuthContext } from "../../context/AuthContext";
import apiRequest from "../../lib/apiRequest";
import { format } from "timeago.js";
import { SocketContext } from "../../context/SocketContext";
import { useNotificationStore } from "../../lib/notificationStore";

function Chat({ chats, initialChatId }) {
  const [chat, setChat] = useState(null);
  const { currentUser } = useContext(AuthContext);
  const { socket } = useContext(SocketContext);
  const messageEndRef = useRef();

  const { decrease, fetch: fetchNotifications } = useNotificationStore(
    (state) => ({
      decrease: state.decrease,
      fetch: state.fetch,
    })
  );

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  // Deschide chat-ul inițial dacă există initialChatId
  useEffect(() => {
    if (initialChatId && chats && chats.length > 0) {
      const initialChat = chats.find((c) => c.id === initialChatId);
      if (initialChat) {
        handleOpenChat(initialChatId, initialChat.receiver);
      }
    }
  }, [initialChatId, chats]);

  const handleOpenChat = async (id, receiver) => {
    try {
      const res = await apiRequest("/chats/" + id);

      // Dacă chat-ul nu era văzut, scade numărul de notificări
      if (!res.data.seenBy.includes(currentUser.id)) {
        decrease();
      }

      setChat({ ...res.data, receiver });
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const text = formData.get("text");

    if (!text || !text.trim()) return;

    try {
      const res = await apiRequest.post("/messages/" + chat.id, {
        text: text.trim(),
      });
      setChat((prev) => ({ ...prev, messages: [...prev.messages, res.data] }));
      e.target.reset();

      // Trimite mesajul prin socket
      if (socket) {
        socket.emit("sendMessage", {
          receiverId: chat.receiver.id,
          data: res.data,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  // Gestionează mesajele primite prin socket
  useEffect(() => {
    if (!socket) return;

    const handleGetMessage = (data) => {
      // Dacă chat-ul este deschis și mesajul aparține chat-ului curent
      if (chat && chat.id === data.chatId) {
        setChat((prev) => ({
          ...prev,
          messages: [...prev.messages, data],
          lastMessage: data.text,
        }));

        // Marchează chat-ul ca citit automat dacă este deschis
        const markAsRead = async () => {
          try {
            await apiRequest.put("/chats/read/" + chat.id);
          } catch (err) {
            console.log(err);
          }
        };
        markAsRead();
      }
      // Nu mai gestionăm notificările aici - o face hook-ul global
    };

    socket.on("getMessage", handleGetMessage);

    return () => {
      socket.off("getMessage");
    };
  }, [socket, chat]);

  // Actualizează notificările când componenta se încarcă
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return (
    <div className="chat">
      <div className="messages">
        <h1>Messages</h1>
        {chats?.map((c) => (
          <div
            className="message"
            key={c.id}
            style={{
              backgroundColor:
                c.seenBy.includes(currentUser.id) || chat?.id === c.id
                  ? "white"
                  : "#fecd514e",
            }}
            onClick={() => handleOpenChat(c.id, c.receiver)}
          >
            <img src={c.receiver?.avatar || "/noavatar.jpg"} alt="" />
            <span>{c.receiver?.username}</span>
            <p>{c.lastMessage || "Începe o conversație..."}</p>
          </div>
        ))}
      </div>
      {chat && (
        <div className="chatBox">
          <div className="top">
            <div className="user">
              <img src={chat.receiver?.avatar || "/noavatar.jpg"} alt="" />
              {chat.receiver?.username}
            </div>
            <span className="close" onClick={() => setChat(null)}>
              ✕
            </span>
          </div>
          <div className="center">
            {chat.messages && chat.messages.length > 0 ? (
              chat.messages.map((message) => (
                <div
                  className="chatMessage"
                  style={{
                    alignSelf:
                      message.userId === currentUser.id
                        ? "flex-end"
                        : "flex-start",
                    textAlign:
                      message.userId === currentUser.id ? "right" : "left",
                  }}
                  key={message.id}
                >
                  <p>{message.text}</p>
                  <span>{format(message.createdAt)}</span>
                </div>
              ))
            ) : (
              <div className="no-messages">
                <p>Nu există mesaje încă. Începe conversația!</p>
              </div>
            )}
            <div ref={messageEndRef}></div>
          </div>
          <form onSubmit={handleSubmit} className="bottom">
            <textarea name="text" placeholder="Scrie un mesaj..." rows="1" />
            <button type="submit">Send</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Chat;
