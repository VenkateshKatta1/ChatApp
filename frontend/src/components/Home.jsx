import { useState } from "react";
import { useAuth } from "../context/useAuth";
import MessageContainer from "./MessageContainer";
import SideBar from "./SideBar";

const Home = () => {
  const { authUser } = useAuth();
  const [selectedUser, setSelectedUser] = useState(null);
  const [isSideBarOpen, setIsSideBarOpen] = useState(true);
  console.log(authUser);

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setIsSideBarOpen(false);
  };

  const handleShowSideBar = () => {
    setIsSideBarOpen(true);
    setSelectedUser(null);
  };

  return (
    <div className="flex justify-between min-w-full md:min-w-[550px] md:max-w-[65%] px-2 h-[95%] md:h-full rounded-xl shadow-lg bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0">
      <div className={`w-full py-2 md:flex ${isSideBarOpen ? "" : "hidden"}`}>
        <SideBar onSelectUser={handleUserSelect} />
      </div>
      <div
        className={`divider divider-horizontal px-3 md:flex ${
          isSideBarOpen ? "" : "hidden"
        } ${selectedUser ? "block" : "hidden"}`}
      ></div>
      <div
        className={`flex-auto bg-gray-200 ${
          selectedUser ? "" : "hidden md:flex"
        }`}
      >
        <MessageContainer onUserBack={handleShowSideBar} />
      </div>
    </div>
  );
};

export default Home;
