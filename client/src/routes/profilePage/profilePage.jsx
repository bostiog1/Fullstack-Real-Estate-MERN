import Chat from "../../components/chat/Chat";
import List from "../../components/list/List";
import "./profilePage.scss";
import apiRequest from "../../lib/apiRequest";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNotificationStore } from "../../lib/notificationStore";
import { Await, useLoaderData } from "react-router-dom";
import { Suspense } from "react";

function ProfilePage() {
  const data = useLoaderData();
  const [userPosts, setUserPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const [chats, setChats] = useState([]);
  const { updateUser, currentUser } = useContext(AuthContext);
  const { fetch, number, decrease } = useNotificationStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const chatIdFromUrl = searchParams.get("chatId");

  useEffect(() => {
    // Fetch notification number la încărcarea paginii
    fetch();
  }, [fetch]);

  const handleDeletePost = async (id) => {
    try {
      await apiRequest.delete("/posts/" + id);
      setUserPosts((prev) => prev.filter((post) => post.id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  const handleSavePost = async (postId, isNowSaved) => {
    if (!currentUser) {
      return navigate("/login");
    }

    // Update UI instant, fără să așteptăm server-ul
    if (isNowSaved) {
      // Post-ul a fost adăugat la saved
      const postToAdd =
        userPosts.find((p) => p.id === postId) ||
        savedPosts.find((p) => p.id === postId);
      if (postToAdd && !savedPosts.find((p) => p.id === postId)) {
        setSavedPosts((prev) => [...prev, postToAdd]);
      }
    } else {
      // Post-ul a fost eliminat din saved
      setSavedPosts((prev) => prev.filter((post) => post.id !== postId));
    }
  };

  const handleLogout = async () => {
    try {
      await apiRequest.post("/auth/logout");
      updateUser(null);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  // Creează array cu ID-urile post-urilor salvate pentru verificare
  const savedPostIds = savedPosts.map((post) => post.id);

  return (
    <div className="profilePage">
      <div className="details">
        <div className="wrapper">
          <div className="title">
            <h1>Informații despre utilizator</h1>
            <Link to="/profile/update">
              <button>Actualizarea profilului</button>
            </Link>
          </div>
          <div className="info">
            <span>
              Avatar:
              <img src={currentUser.avatar || "noavatar.jpg"} alt="" />
            </span>
            <span>
              Nume: <b>{currentUser.username}</b>
            </span>
            <span>
              E-mail: <b>{currentUser.email}</b>
            </span>
            <button onClick={handleLogout}>Logout</button>
          </div>
          <div className="title">
            <h1>Lista mea</h1>
            <Link to="/add">
              <button>Creați o postare nouă</button>
            </Link>
          </div>
          <Suspense fallback={<p>Loading...</p>}>
            <Await resolve={data.postResponse}>
              {(postResponse) => {
                setUserPosts(postResponse.data.userPosts);
                setSavedPosts(postResponse.data.savedPosts);
                return (
                  <>
                    <List
                      posts={postResponse.data.userPosts}
                      onDelete={handleDeletePost}
                      onSave={handleSavePost}
                      savedPostIds={savedPostIds}
                    />
                    <div className="title">
                      <h1>Favorite</h1>
                    </div>
                    <List
                      posts={postResponse.data.savedPosts}
                      onSave={handleSavePost}
                      savedPostIds={savedPostIds}
                    />
                  </>
                );
              }}
            </Await>
          </Suspense>
        </div>
      </div>
      <div className="chatContainer">
        <div className="wrapper">
          <Suspense fallback={<p>Loading...</p>}>
            <Await resolve={data.chatResponse}>
              {(chatResponse) => {
                setChats(chatResponse.data);
                return (
                  <Chat
                    chats={chatResponse.data}
                    initialChatId={chatIdFromUrl}
                  />
                );
              }}
            </Await>
          </Suspense>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
