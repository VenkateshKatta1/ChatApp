/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import axios from "axios";
import { API_URL } from "../../data/apiPath";
import { toast } from "react-toastify";
import { useAuth } from "../context/useAuth";
import { useNavigate } from "react-router-dom";
import { IoArrowBackSharp } from "react-icons/io5";
import { BiLogOut } from "react-icons/bi";
import userConversation from "../store/useConversation";
import { useSocketContext } from "../context/socketContext";

const SideBar = ({
  onSelectUser,
  onProfileClick,
  setShowProfileModal,
  showProfileModal,
}) => {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [newMessageUsers, setNewMessageUsers] = useState(" ");
  const [searchUser, setSearchUser] = useState([]);
  const [chatUser, setChatUser] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const { authUser, setAuthUser } = useAuth();
  const {
    messages,
    setMessages,
    selectedConversation,
    setSelectedConversation,
  } = userConversation();
  const { onlineUser, socket } = useSocketContext();

  const nowOnline = chatUser.map((user) => user._id);
  // User online?
  const isOnline = nowOnline.map((userId) => onlineUser.includes(userId));

  const handleProfileClick = () => {
    setShowProfileModal(true);
    setSelectedUserId(null);
    if (showProfileModal) {
      setShowProfileModal(false);
    }
    onProfileClick(authUser);
  };

  useEffect(() => {
    socket?.on("newMessage", (newMessage) => {
      setNewMessageUsers(newMessage);
    });

    return () => socket?.off("newMessage");
  }, [socket, messages]);

  // Shows users with you chatted.
  useEffect(() => {
    const chatUserHandler = async () => {
      setLoading(true);
      try {
        const chatters = await axios.get(`${API_URL}/user/currentchatters`, {
          withCredentials: true,
        });
        const data = chatters.data;
        if (data.success === false) {
          setLoading(false);
          console.log(data.message);
        }
        setLoading(false);
        setChatUser(data);
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    };
    chatUserHandler();
  }, []);

  // Shows users from search result.
  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const search = await axios.get(
        `${API_URL}/user/search?search=${searchInput}`,
        {
          withCredentials: true,
        }
      );
      const data = search.data;
      if (data.success === false) {
        setLoading(false);
        console.log(data.message);
      }
      setLoading(false);
      if (data.length === 0) {
        toast.info("User not found");
      } else {
        setSearchUser(data);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  // Highlights the selected user.
  const handleUserClick = (user) => {
    onSelectUser(user);
    setSelectedConversation(user);
    setSelectedUserId(user._id);
    setNewMessageUsers("");
    setShowProfileModal(false);
  };

  // Back from search result.
  const handleSearchBack = () => {
    setSearchUser([]);
    setSearchInput("");
  };

  // Logout.
  const handleLogout = async () => {
    const confirmation = confirm("Are you sure, you want to Logout?");
    if (!confirmation) return;
    setLoading(true);
    try {
      const logout = await axios.post(
        `${API_URL}/auth/logout`,
        {},
        {
          withCredentials: true,
        }
      );
      const data = logout.data;
      if (data.success === false) {
        setLoading(false);
        console.log(data.message);
      }
      toast.info(data.message);
      document.cookie = "jwt=; Max-Age=0; path=/;";
      localStorage.removeItem("chatapp");
      setAuthUser(null);
      setLoading(false);
      navigate("/login");
      window.location.reload();
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  return (
    <div className="h-full w-auto px-1">
      <div className="flex justify-between gap-2">
        <form
          onSubmit={handleSearchSubmit}
          className="w-auto flex items-center justify-between bg-white rounded-full"
        >
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            type="text"
            placeholder="Search user"
            className="px-4 w-auto bg-transparent outline-none rounded-full"
          />
          <button className="btn btn-circle  bg-sky-700 hover:bg-gray-950">
            <FaSearch />
          </button>
        </form>
        <img
          onClick={handleProfileClick}
          src={authUser?.profilepic}
          className="self-center h-12 w-12 hover:scale-110 cursor-pointer"
        />
      </div>

      <div className="divider px-3"></div>

      {searchUser?.length > 0 ? (
        <>
          <div className="min-h-[70%] max-h-[80%] overflow-y-auto scrollbar">
            <div className="w-auto">
              {searchUser.map((user, index) => (
                <div key={user._id}>
                  <div
                    onClick={() => handleUserClick(user)}
                    className={`flex gap-3 items-center rounded p-2 py-1 cursor-pointer ${
                      selectedUserId === user._id ? "bg-sky-500 " : ""
                    }`}
                  >
                    {/*Socket is Online */}
                    <div
                      className={`avatar ${isOnline[index] ? "online" : ""}`}
                    >
                      <div className="w-12 h-10 rounded-full">
                        <img src={user.profilepic} alt="user.img" />
                      </div>
                    </div>
                    <div className="flex flex-col flex-1 justify-center">
                      <p className="font-bold text-gray-950 ">
                        {user.username}
                      </p>
                    </div>
                  </div>
                  <div className="divider divide-solid px-3 h-[1px]"></div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-auto px-1 py-1 flex">
            <button
              onClick={handleSearchBack}
              className="bg-white rounded-full px-2 py-1 self-center"
            >
              <IoArrowBackSharp size={25} />
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="min-h-[70%] max-h-[80%] overflow-y-auto scrollbar">
            <div className="w-auto">
              {chatUser.length === 0 ? (
                <div className="font-bold items-center flex flex-col text-xl text-yellow-500">
                  <h1>Why are you Alone!!🤔</h1>
                  <h1>Search username to chat</h1>
                </div>
              ) : (
                chatUser.map((user, index) => (
                  <div key={user._id}>
                    <div
                      onClick={() => handleUserClick(user)}
                      className={`flex gap-3 items-center rounded p-2 py-1 cursor-pointer ${
                        selectedUserId === user._id ? "bg-sky-500 " : ""
                      }`}
                    >
                      {/*Socket is Online*/}
                      <div
                        className={`avatar ${isOnline[index] ? "online" : ""}`}
                      >
                        <div className="w-12 h-10 rounded-full">
                          <img src={user.profilepic} alt="user.img" />
                        </div>
                      </div>
                      <div className="flex flex-col flex-1 justify-center">
                        <p className="font-bold text-gray-950 ">
                          {user.username}
                        </p>
                      </div>
                      <div>
                        {newMessageUsers.receiverId === authUser._id &&
                        newMessageUsers.senderId === user._id ? (
                          <div className="rounded-full bg-green-700 text-sm text-white px-[4px]">
                            +1{" "}
                          </div>
                        ) : (
                          <div></div>
                        )}
                      </div>
                    </div>
                    <div className="divider divide-solid px-3 h-[1px]"></div>
                  </div>
                ))
              )}
            </div>
          </div>
          <div className="mt-auto px-1 py-1 flex">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 hover:bg-red-600 px-3 py-2 cursor-pointer hover:text-white rounded-lg"
            >
              <BiLogOut size={25} />
              <span className="text-lg text-black font-bold">Logout</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default SideBar;
