/* eslint-disable react/prop-types */
import userConversation from "../store/useConversation";
import { useAuth } from "../context/useAuth";
import { TiMessages } from "react-icons/ti";
import { IoArrowBackSharp, IoSend } from "react-icons/io5";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { API_URL } from "../../data/apiPath";
import notify from "../assets/sound/message.mp3";
import { useSocketContext } from "../context/socketContext";

const MessageContainer = ({
  onUserBack,
  profileData,
  setShowProfileModal,
  showProfileModal,
}) => {
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendData, setSendData] = useState("");
  const { authUser } = useAuth();
  const lastMessageRef = useRef();
  const { socket } = useSocketContext();
  const {
    messages,
    selectedConversation,
    setMessages,
    setSelectedConversation,
  } = userConversation();

  useEffect(() => {
    socket?.on("newMessage", (newMessage) => {
      const sound = new Audio(notify);
      sound.play();
      setMessages([...messages, newMessage]);
    });

    return () => socket?.off("newMessage");
  }, [socket, setMessages, messages]);

  useEffect(() => {
    setTimeout(() => {
      lastMessageRef?.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, [messages]);

  useEffect(() => {
    const getMessages = async () => {
      setLoading(true);
      try {
        const getMessage = await axios.get(
          `${API_URL}/message/${selectedConversation?._id}`,
          { withCredentials: true }
        );
        const data = await getMessage.data;
        if (data.success === false) {
          setLoading(false);
          console.log(data.messages);
        }
        setLoading(false);
        setMessages(data);
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    };
    if (selectedConversation?._id) getMessages();
  }, [selectedConversation?._id, setMessages]);
  // console.log(messages);

  const handleMessage = (e) => {
    setSendData(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      const res = await axios.post(
        `${API_URL}/message/send/${selectedConversation?._id}`,
        { message: sendData },
        {
          withCredentials: true,
        }
      );
      const data = await res.data;
      if (data.success === false) {
        setSending(false);
        console.log(data.message);
      }
      setSending(false);
      setSendData("");
      setMessages([...messages, data]);
    } catch (error) {
      setSending(false);
      console.log(error);
    }
  };

  const chatAppData = JSON.parse(localStorage.getItem("chatapp"));
  const createdAt = chatAppData?.createdAt;

  return (
    <div className="md:min-w-[500px] h-[99%] flex flex-col py-2 ">
      {profileData && showProfileModal ? (
        <div className="flex items-center justify-center h-full w-full bg-gray-100">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full text-center">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Username: {profileData.username}
            </h2>
            <p className="text-gray-600 text-lg mb-4">
              <b>Full Name:</b> {profileData.fullname}
            </p>
            <p className="text-gray-600 text-lg mb-4">
              <b>Email:</b> {profileData.email}
            </p>
            <p className="text-gray-600 text-lg mb-6">
              <b>User since </b>
              {createdAt ? new Date(createdAt).toLocaleString() : "N/A"}
            </p>
            <button
              onClick={() => setShowProfileModal(false)}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-full flex items-center justify-center"
            >
              <IoArrowBackSharp size={20} className="mr-2" />
              Back
            </button>
          </div>
        </div>
      ) : (
        <>
          {selectedConversation === null ? (
            <div className="flex items-center justify-center w-full h-full">
              <div className="px-4 text-center text-2xl text-gray-950 font-semibold flex flex-col items-center gap-2">
                <p className="text-2xl">Welcome👋 {authUser.username}</p>
                <p className="text-lg">
                  Search and select a chat to start messaging
                </p>
                <TiMessages className="text-6xl text-center" />
              </div>
            </div>
          ) : (
            <>
              <div className="flex justify-between gap-1 bg-sky-600 md:px-2 rounded-lg h-10 md:h-12">
                <div className="flex gap-2 md:justify-between items-center w-full">
                  <div className="md:hidden ml-1 self-center">
                    <button
                      onClick={() => onUserBack(true)}
                      className="bg-white rounded-full px-2 py-1 self-center"
                    >
                      <IoArrowBackSharp size={25} />
                    </button>
                  </div>
                  <div className="flex justify-between mr-2 gap-2">
                    <div className="self-center">
                      <img
                        className="rounded-full w-6 h-6 md:w-10 md:h-10 cursor-pointer"
                        src={selectedConversation?.profilepic}
                      />
                    </div>
                    <span className="text-gray-950 self-center text-sm md:text-xl font-bold">
                      {selectedConversation?.username}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex-1 overflow-auto">
                {loading && (
                  <div className="flex w-full h-full flex-col items-center justify-center gap-4 bg-transparent">
                    <div className="loading loading-spinner"></div>
                  </div>
                )}
                {!loading && messages?.length === 0 && (
                  <p className="text-center text-black items-center">
                    Send a message to start conversation
                  </p>
                )}
                {!loading &&
                  messages?.length > 0 &&
                  messages?.map((message) => (
                    <div
                      className="text-white"
                      key={message._id}
                      ref={lastMessageRef}
                    >
                      <div
                        className={`chat ${
                          message.senderId === authUser._id
                            ? "chat-end"
                            : "chat-start"
                        } w-full  mb-2`}
                      >
                        <div className="chat-image avatar"></div>

                        <div className="chat-content">
                          <div
                            className={`chat-bubble max-w-[80%] p-2 rounded-xl ${
                              message.senderId === authUser._id
                                ? "bg-sky-600 text-white"
                                : "bg-gray-300 text-black"
                            }`}
                          >
                            {message?.message}
                          </div>

                          <div className="chat-footer text-[10px] opacity-80 text-black mt-1">
                            {new Date(message?.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                hour: "numeric",
                                minute: "numeric",
                              }
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
              <form onSubmit={handleSubmit} className="rounded-full text-black">
                <div className="w-full rounded-full flex items-center bg-white">
                  <input
                    value={sendData}
                    onChange={handleMessage}
                    required
                    id="message"
                    type="text"
                    className="w-full bg-transparent outline-none px-4 rounded-full"
                  />
                  <button type="submit">
                    {sending ? (
                      <div className="loading loading-spinner"></div>
                    ) : (
                      <IoSend
                        size={25}
                        className="text-sky-700 cursor-pointer rounded-full bg-gray-800 w-10 h-auto p-1"
                      />
                    )}
                  </button>
                </div>
              </form>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default MessageContainer;
