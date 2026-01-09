import { useEffect, useState } from "react";
import CloseIcon from "../icons/CloseIcon";
import PlusIcon from "../icons/PlusIcon";
import ShareIcon from "../icons/ShareIcon";
import TwitterIcon from "../icons/TwitterIcon";
import YoutubeIcon from "../icons/YoutubeIcon";
import Button from "./Button";
import SidebarItems from "./SidebarItems";
import axios from "axios";
import { useFilter } from "../../contexts/FilterContext";
const apiUrl = import.meta.env.VITE_API_URL;

interface SidebarType {
  setMenuOpen: () => void;
  setModal?: () => void;
  menuOpen: boolean;
}

const Sidebar = (props: SidebarType) => {
  const { setFilter } = useFilter(); 
  let isPublicValue: boolean = false;
  let [username, setUsername] = useState("");
  const [isPublic, setIsPublic] = useState(isPublicValue);

  const [hasMounted, setHasMounted] = useState(false);

  const token = localStorage.getItem("token");

  const handleSidebarItemClick = (filter: string) => {
    setFilter(filter); // Update filter in context
  };



  const shareBrain = () => {
    if(token){
      setIsPublic(!isPublic);
    }
    else{
      alert("Please login to share your brain.");
    }
  };

  interface responseType {
    message: string;
    userInfo?: {
      isPublic?: boolean;
      username?: string;
    };
  }

  const getUserInfo = async () => {
    const response = await axios.get<responseType>(`${apiUrl }/getuserinfo`, {
      headers: {
        Authorization: token,
      },
    });

    if (response.data.userInfo?.isPublic) {
      isPublicValue = response.data.userInfo.isPublic;
      setIsPublic(isPublicValue);
    }

    if (response.data.userInfo?.username) {
      setUsername(response.data.userInfo.username);
    }
    
  };


  const shareUrl = `https://brainly-pas5.vercel.app/${username}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      alert("Link copied to clipboard!");
    }).catch(() => {
      alert("Failed to copy the link.");
    });
  };

  useEffect(() => {
    if(token) {
      getUserInfo();
    }
  }, []);

  const sendRequest = async () => {
    if(token){
      await axios.post<responseType>(
        `${apiUrl}/brain/share`,
        {
          share: isPublic,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );

      // console.log("response: " + response.data?.message);
    }

    
  };

  useEffect(() => {
    if (hasMounted) {
      sendRequest();
      // console.log("request sent for share value: " + isPublic);
    } else {
      setHasMounted(true);
    }
  }, [isPublic]);


  

  return (
    <div
      className={`transition-all duration-500 ease-in-out  ${
        props.menuOpen
          ? "transform translate-x-0 opacity-100"
          : "transform -translate-x-full opacity-0"
      } w-80 md:w-96 h-screen bg-white px-6 py-4 fixed top-0 left-0 border-3 border-r rounded-lg `}>
      <div className="flex justify-between">
        <div className="flex gap-2 justify-start items-center mb-6">
          <img className="w-[2rem]" src="/images/logo.png" alt="logo" />
          <h1 className="text-2xl font-bold text-primary">Brainly</h1>
        </div>
        <div
          className="cursor-pointer"
          onClick={() => {
            props.setMenuOpen();
          }}>
          <CloseIcon />
        </div>
      </div>

      <SidebarItems startIcon={<TwitterIcon />} text="Tweets" onClickFn={()=>{handleSidebarItemClick("tweet")}}/>
      <SidebarItems startIcon={<YoutubeIcon />} text="Youtube" onClickFn={() => handleSidebarItemClick("youtube")}/>

      <div className="py-2 flex gap-9 justify-center">
        <Button
          variant="primary"
          size="sm"
          text="Add New"
          startIcon={<PlusIcon />}
          extraClasses=" max-sm:text-xs "
          OnClickFn={props.setModal}
        />
        {/* <Button
          variant="secondary"
          size="sm"
          text="Share Brain"
          startIcon={<ShareIcon />}
        /> */}

        <button
          onClick={shareBrain}
          className="bg-secondary text-primary hover:bg-purple-600 hover:outline outline-1 hover:text-white transition duration-300 ease-in-out py-2 px-3 text-sm rounded-lg w-fit flex items-center gap-2 ">
          <ShareIcon /> {isPublic ? "Hide Brain" : "Share Brain"}
        </button>
      </div>
      {isPublic && (
        <div className="text-center text-sm text-primary bg-gray-200 py-2 px-1 flex items-center justify-center">
          <span className="truncate">{shareUrl}</span>
          <button
            onClick={handleCopy}
            className="ml-2 text-blue-500 hover:text-blue-700 max-sm:text-xs"
            title="Copy Link"
          >
            📋 {/* Use an icon like this or replace with a proper icon library */}
          </button>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
