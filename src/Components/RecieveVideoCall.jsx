import {
  LocalUser,
  RemoteUser,
  useIsConnected,
  useJoin,
  useLocalMicrophoneTrack,
  useLocalCameraTrack,
  usePublish,
  useRemoteUsers,
} from "agora-rtc-react";
import { useState, useEffect } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";
import { CiCamera, CiHeart, CiLocationOn, CiMicrophoneOff, CiMicrophoneOn, CiVideoOn } from "react-icons/ci";
import { LuCameraOff } from "react-icons/lu";
import { IoVideocamOffOutline } from "react-icons/io5";
import { TbGenderDemigirl } from "react-icons/tb";
import { useLocation, useParams } from "react-router-dom";
import coin from "../assets/pic/chat/beans-icon.png";
import likebg from "../assets/pic/phone/bubble-bj.png";
import img3 from "../assets/img3.jpg";
import axios from "axios";


export const RecieveVideoCall = () => {
  const [token, setToken] = useState(null);
  const [calling, setCalling] = useState(false);
  const [micOn, setMic] = useState(true);
  const [cameraOn, setCamera] = useState(true);
  const [cameraDevices, setCameraDevices] = useState([]);
  const [currentCamera, setCurrentCamera] = useState(null);
  const [currentCameraIndex, setCurrentCameraIndex] = useState(0);
  const [currentCallId, setCurrentCallId] = useState(null); // Track if the camera is on or off
  const [currentSlide, setCurrentSlide] = useState(0);

  // const { uid } = useParams();
  const locations = useLocation();
  const getQueryParams = () => new URLSearchParams(locations.search);
  const name = getQueryParams().get('name');
  const rate = getQueryParams().get('rate');
  const age = getQueryParams().get('age');
  const location = getQueryParams().get('location');
  const imagesString = getQueryParams().get('images');
  // const userId = "23";
  const appId = "c03a3f9678414dceb45332ac293e2ec4";
  const channel = "sweetmeet-23";

  const imagesArray = imagesString ? imagesString.split(',') : [];

  const handlePrevClick = () => {
    setCurrentSlide((prev) => (prev === 0 ? imagesArray.length - 1 : prev - 1));
  };

  const handleNextClick = () => {
    setCurrentSlide((prev) => (prev === imagesArray.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === imagesArray.length - 1 ? 0 : prev + 1));
    }, 2000);
    return () => clearInterval(interval);
  }, [imagesArray]);

  const getIndianTime = () => {
    const utcDate = new Date();

    const istOffset = 5.5 * 60 * 60 * 1000;
    const istDate = new Date(utcDate.getTime() + istOffset);

    return istDate.toISOString().slice(0, 19).replace('T', ' ');
  };

  const isConnected = useIsConnected();
  const startCall = async () => {
    try {
      const response = await axios.get("http://sweet_meet_backend.fapjoymall.com/sweetmeet/agora/accesstoken", {
        params: {
          channelName: `sweetmeet-23`,
          uid: 0,
          role: 'publisher',
          expiry: 3600,
        },
      });
  
      if (response?.status === 200) {
        const fetchedToken = response?.data?.agoraToken;
        setToken(fetchedToken);
        setCalling(true);
    
        const callStartResponse = await axios.post('http://sweet_meet_backend.fapjoymall.com/sweetmeet/agora/call/notify', {
          caller_id: 23,
          receiver_id: 73,
          token: fetchedToken, 
          call_type: "video",
          call_start: getIndianTime(),
        });
  
        if (callStartResponse.status === 200) {
          const callId = callStartResponse?.data?.callId;
          console.log('Call started, ID:', callId[0].insertId);
          setCurrentCallId(callId[0].insertId);
          console.log('Call start notification sent successfully');
        } else {
          console.error('Error sending call start notification:', callStartResponse.data.message);
        }
      } else {
        console.error("Failed to fetch token");
      }
    } catch (error) {
      console.error("Error fetching token or sending call start notification:", error);
    }
  };
  
  // console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx", token)
  // console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx", calling)
  // Join the channel
  useJoin({ appid: appId, channel: channel, token: token }, calling && token);

  const { localMicrophoneTrack } = useLocalMicrophoneTrack(micOn);
  const { localCameraTrack } = useLocalCameraTrack(cameraOn, currentCamera);
  usePublish([localMicrophoneTrack, localCameraTrack]);

  const remoteUsers = useRemoteUsers();
  console.log("asdfghhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh", remoteUsers)
  useEffect(() => {
    async function getCameras() {
      const devices = await AgoraRTC.getCameras();
      setCameraDevices(devices);
      setCurrentCamera(devices[0]?.deviceId || null);
    }

    getCameras();
  }, []);

  // Toggle between front and back cameras
  const toggleCamera = () => {
    if (cameraDevices.length > 1) {
      const newIndex = (currentCameraIndex + 1) % cameraDevices.length;
      setCurrentCamera(cameraDevices[newIndex].deviceId);
      setCurrentCameraIndex(newIndex);
    }
  };
  console.log("currentCamera", currentCamera)
  const callEndTimestamp = getIndianTime();

  const endCall = async () => {
    setCalling(!calling);
    try {
      const response = await fetch('http://sweet_meet_backend.fapjoymall.com/sweetmeet/agora/updateCallRecords', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          call_id: currentCallId,
          // receiver_id: uid,
          call_end: callEndTimestamp
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to create call record:', errorText);
        throw new Error({ status: `${response.status}` });
      }

      const result = await response.json();
      if (result.success) {
        console.log('Call record created successfully');
      } else {
        console.error('Failed to create call record:', result.message);
      }
    } catch (error) {
      console.error('Error ending the call:', error);
    }
  };
  return (
    <div className={`flex flex-col justify-center items-center h-screen `}>
      {!isConnected && <div className="mt-5 relative mx-auto max-w-2xl hidden sm:block">
        <div className="relative aspect-w-16 aspect-h-9 overflow-hidden rounded-xl border border-bg1 max-h-screen">
          <div className="relative h-full w-full border border-bg1 rounded-xl overflow-hidden">
            <img className="w-full h-full object-fill object-center max-h-screen" src={img3} alt="Agent" />
            <div className="absolute flex justify-between bottom-0 left-0 right-0 p-3 bg-black/30 text-white">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-1">
                  <img className="w-4 h-4 mt-[6px] object-cover" src={coin} alt="coin" />
                  <p className="font-bold text-lg">{name}</p>
                </div>
                <div className="flex gap-2">
                  <p className="text-xl flex items-center">
                    <CiLocationOn className="text-white bg-pink-500 rounded-full" />
                    {location}
                  </p>
                  <p className="text-xl flex items-center">
                    <TbGenderDemigirl className="text-white bg-pink-500 rounded-full" />
                    {age}
                  </p>
                </div>
              </div>
              <div className="relative flex items-center justify-center rounded-lg">
                <div className="absolute right-0 bottom-0 w-28 h-10">
                  <img src={likebg} className="w-full h-full rounded-full object-cover" alt="Like Background" />
                </div>
                <p className="absolute right-5 bottom-2 text-xl font-bold text-white flex items-center justify-center gap-1 z-10">
                  <CiHeart size={25} />
                </p>
              </div>
            </div>
          </div>
        </div>
        <button type="button" className="absolute top-0 start-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none" onClick={handlePrevClick}>
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-full dark:bg-bg1 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
            <svg className="w-4 h-4 text-white rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 1 1 5l4 4" />
            </svg>
            <span className="sr-only">Previous</span>
          </span>
        </button>
        <button type="button" className="absolute top-0 end-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none" onClick={handleNextClick}>
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-full dark:bg-bg1 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
            <svg className="w-4 h-4 text-white rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
            </svg>
            <span className="sr-only">Next</span>
          </span>
        </button>
      </div>}


      {/* Below SM screen */}
      {!isConnected && <div className=" relative w-full sm:hidden">
        <div className="relative aspect-w-16 aspect-h-9 overflow-hidden">
          <div
            className="relative h-[30rem] xsm:h-[45rem] overflow-hidden"
          >
            <img
              className="w-full h-full object-fill object-center max-h-screen"
              // src={item.img[currentSlide]}
              src={img3}
              alt="Agent"
            />
            <div className="absolute flex justify-between bottom-0 left-0 right-0 bg-black/30 p-3 text-white">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-1">
                  <img className="w-4 h-4 mt-[6px] object-cover" src={coin} alt="coin" />
                  <p className="font-bold text-lg">{name}</p>
                </div>
                <div className="flex gap-2">
                  <p className="text-xl flex items-center">
                    <CiLocationOn className="text-white bg-pink-500 rounded-full" />
                    {location}
                  </p>
                  <p className="text-xl flex items-center">
                    <TbGenderDemigirl className="text-white bg-pink-500 rounded-full" />
                    {age}
                  </p>
                </div>
              </div>
              <div className="relative flex items-center justify-center rounded-lg">
                <div className="absolute right-0 bottom-0 w-24 h-10">
                  <img
                    src={likebg}
                    className="w-full h-full rounded-full object-cover"
                    alt="Like Background"
                  />
                </div>
                <p className="absolute right-4 bottom-2 text-xl font-bold text-white flex items-center justify-center gap-1 z-10">
                  <CiHeart size={25} />
                  {/* {like}k */}
                </p>
              </div>
            </div>
          </div>
        </div>
        <button
          type="button"
          className="absolute top-0 start-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
          onClick={handlePrevClick}
        >
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-full dark:bg-bg1 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
            <svg className="w-4 h-4 text-white rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 1 1 5l4 4" />
            </svg>
            <span className="sr-only">Previous</span>
          </span>
        </button>

        <button
          type="button"
          className="absolute top-0 end-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
          onClick={handleNextClick}
        >
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-full dark:bg-bg1 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
            <svg className="w-4 h-4 text-white rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
            </svg>
            <span className="sr-only">Next</span>
          </span>
        </button>
      </div>}


      <div className={`${isConnected ? "block" : "hidden"}  border border-bg1 m-4 w-[150px] sm:w-[200px] lg:w-[300px] h-[150px] sm:h-[200px] lg:h-[300px] top-0 right-0 absolute rounded-lg  ${remoteUsers ? "z-50" : "z-40"}`}>

        <LocalUser
          audioTrack={localMicrophoneTrack}
          cameraOn={cameraOn}
          micOn={micOn}
          videoTrack={localCameraTrack}
          cover="https://www.agora.io/en/wp-content/uploads/2022/10/3d-spatial-audio-icon.svg"
        >
          <samp className="flex justify-center text-lg font-semibold">You</samp>
        </LocalUser>
      </div>

      {/* Remote Users */}
      {remoteUsers.map((user) => (
        <div className={`absolute w-full h-full ${isConnected ? "block" : "hidden"} aspect-w-16 aspect-h-9`}
          key={user.uid}
        >
          {user.hasVideo ? (
            <RemoteUser
              cover="https://www.agora.io/en/wp-content/uploads/2022/10/3d-spatial-audio-icon.svg"
              user={user}
              videoTrack={user.videoTrack}
            >
              <samp className="user-name text-lg font-semibold">{user.uid}</samp>
            </RemoteUser>
          ) : (
            <div className="text-red-500">No video available for user {user.uid}</div>
          )}
        </div>
      ))}

      {!calling && <div className='flex justify-center mx-auto max-w-2xl mt-5 mb-10'>
        <div className=' w-full rounded-2xl flex items-center justify-center gap-2 text-white'>
          <div className='flex items-center justify-center bg-bg1 w-full rounded-2xl px-5 py-3'>
            <img className="w-4 h-4 object-cover" src={coin} alt="coin not found" />
            <p className="font-bold text-lg">{rate}/min</p>
          </div>
          <button className={`flex items-center justify-center gap-2 text-nowrap px-5 py-3.5 bg-bg1  rounded-2xl  ${!appId || !channel ? "bg-gray-400" : ""}`} onClick={() => startCall()}
          >
            <CiVideoOn className='mt-1' size={20} />
            Video Call
          </button>
        </div>
      </div>}

      {/* Control Panel */}
      {isConnected && (
        <div className="mt-4 flex  items-center justify-between absolute bottom-0 p-5 bg-black/20 w-full z-50">
          <button
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
            onClick={() => setMic((prev) => !prev)}
          >
            {!micOn ? <CiMicrophoneOn className="text-white" size={24} /> : <CiMicrophoneOff className="text-white" size={24} />}
          </button>
          <button
            className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition"
            onClick={() => setCamera((prev) => !prev)}
          >
            {cameraOn ? <LuCameraOff size={22} /> : <CiCamera size={24} />}
          </button>
          <button
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
            onClick={toggleCamera}
          >
            <CiCamera size={24} />
          </button>
          {calling && (
            <button
              className="flex items-center gap-1 bg-red-500 text-white px-6 py-2 rounded-md"
              onClick={() => endCall()}
            >
              End Call <IoVideocamOffOutline size={22} />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default RecieveVideoCall;
