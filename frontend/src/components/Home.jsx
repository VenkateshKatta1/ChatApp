import { useState } from "react";
import { useAuth } from "../context/useAuth";
import MessageContainer from "./MessageContainer";
import SideBar from "./SideBar";

const Home = () => {
  const { authUser } = useAuth();
  const [selectedUser, setSelectedUser] = useState(null);
  const [isSideBarOpen, setIsSideBarOpen] = useState(true);
  const [profileData, setProfileData] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);

  // console.log(authUser);

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setIsSideBarOpen(false);
  };

  const handleShowSideBar = () => {
    setIsSideBarOpen(true);
    setSelectedUser(null);
  };

  const handleProfileClick = (data) => {
    setProfileData(data);
  };

  return (
    <div className="flex justify-between min-w-full md:min-w-[550px] md:max-w-[65%] px-2 h-[95%] md:h-full rounded-xl shadow-lg bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0">
      <div className={`w-full py-2 md:flex ${isSideBarOpen ? "" : "hidden"}`}>
        <SideBar
          onSelectUser={handleUserSelect}
          onProfileClick={handleProfileClick}
          setShowProfileModal={setShowProfileModal}
          showProfileModal={showProfileModal}
          setIsSideBarOpen={setIsSideBarOpen}
        />
      </div>
      <div
        className={`divider divider-horizontal px-3 md:flex ${
          isSideBarOpen ? "" : "hidden"
        } ${selectedUser || showProfileModal ? "block" : "hidden"}`}
      ></div>
      <div
        className={`flex-auto bg-gray-200 ${
          selectedUser || showProfileModal ? "" : "hidden md:flex"
        }`}
      >
        <MessageContainer
          onUserBack={handleShowSideBar}
          profileData={profileData}
          setShowProfileModal={setShowProfileModal}
          showProfileModal={showProfileModal}
        />
      </div>
    </div>
  );
};

export default Home;
