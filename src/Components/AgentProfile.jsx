import { useEffect, useState } from 'react';
import { TbGenderDemigirl } from "react-icons/tb";
import coin from "../assets/pic/chat/beans-icon.png";
import likebg from "../assets/pic/phone/bubble-bj.png";
import img3 from "../assets/img3.jpg";
import { CiHeart, CiLocationOn, CiVideoOn, CiCamera, CiMicrophoneOn, CiMicrophoneOff } from "react-icons/ci";
import { SlCallEnd } from "react-icons/sl";
import { useLocation, useParams } from 'react-router-dom';
import AgoraRTC from "agora-rtc-sdk-ng"; // Agora SDK

function AgentProfile() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isVideoCallActive, setIsVideoCallActive] = useState(false); // Manage video call UI state
    const [agoraClient, setAgoraClient] = useState(null); // Agora client state
    const [localTracks, setLocalTracks] = useState([]); // State to manage local tracks (audio/video)
    const [cameraFacing, setCameraFacing] = useState('user'); // Track camera facing direction
    const [isCameraOn, setIsCameraOn] = useState(true); // Track if the camera is on or off

    const { uid } = useParams();
    const locations = useLocation();
    const getQueryParams = () => new URLSearchParams(locations.search);
    const name = getQueryParams().get('name');
    const rate = getQueryParams().get('rate');
    const age = getQueryParams().get('age');
    const location = getQueryParams().get('location');
    const imagesString = getQueryParams().get('images');
    const userId = 1234;

    const handlePrevClick = () => {
        setCurrentSlide((prev) => (prev === 0 ? imagesString.length - 1 : prev - 1));
    };

    const handleNextClick = () => {
        setCurrentSlide((prev) => (prev === imagesString.length - 1 ? 0 : prev + 1));
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev === imagesString.length - 1 ? 0 : prev + 1));
        }, 2000);

        return () => clearInterval(interval);
    }, [imagesString]);

    const startVideoCall = async () => {
        try {
            const response = await fetch('http://localhost:3000/sweetmeet/agora/accesstoken?channelName=kd&uid=1234&role=publisher&expireTime=3600');
            const data = await response.json();

            if (response.ok) {
                const { agoraToken, channelName } = data;
                const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
                setAgoraClient(client);

                await client.join('c03a3f9678414dceb45332ac293e2ec4', channelName, agoraToken, userId);

                const screenWidth = window.innerWidth;
                let resolution;

                if (screenWidth <= 640) {
                    resolution = { width: 640, height: 360 };
                } else {
                    resolution = { width: 1280, height: 720 };
                }

                // Create microphone and camera tracks
                const [microphoneTrack, cameraTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();
                setLocalTracks([microphoneTrack, cameraTrack]);

                // Adjust video encoder configuration based on screen size
                cameraTrack.setEncoderConfiguration({
                    resolution: resolution,
                    frameRate: 30,
                    bitrate: screenWidth <= 640 ? 500 : 1000,
                    orientationMode: 'adaptive',
                });

                cameraTrack.play('local-player');

                await client.publish([microphoneTrack, cameraTrack]);
                setIsVideoCallActive(true);
            }
        } catch (err) {
            console.error("Error in video call:", err);
        }
    };


    const handleMicToggle = () => {
        if (localTracks[0]) {
            const micTrack = localTracks[0];
            micTrack.setMuted(!micTrack.muted);
        }
    };

    const handleCameraToggle = async () => {
        try {
            if (isCameraOn) {
                // If camera is currently on, turn it off
                const cameraTrack = localTracks[1];
                cameraTrack.stop();
                cameraTrack.close();
    
                // Remove the camera track from local tracks
                setLocalTracks([localTracks[0]]);
                
                // Notify Agora client to unpublish the camera track
                await agoraClient.unpublish(cameraTrack);
                
                setIsCameraOn(false); // Update state to reflect camera is off
            } else {
                // If camera is currently off, turn it on
                const cameraId = cameraFacing === 'user' ? 'environment' : 'user';
                const newCameraTrack = await AgoraRTC.createCameraVideoTrack({ cameraId });
                setCameraFacing(cameraFacing === 'user' ? 'environment' : 'user');
    
                // Add the new camera track to local tracks
                const updatedLocalTracks = [localTracks[0], newCameraTrack];
                setLocalTracks(updatedLocalTracks);
    
                // Publish the new camera track
                await agoraClient.publish([newCameraTrack]);
                
                // Play the new camera track
                newCameraTrack.play('local-player');
    
                setIsCameraOn(true); // Update state to reflect camera is on
            }
        } catch (error) {
            console.error("Error toggling camera:", error);
            alert("Failed to toggle camera. Please check camera permissions and try again.");
        }
    };
    

    const endCall = async () => {
        try {
            if (agoraClient) {
                // Leave the channel
                await agoraClient.leave();
                console.log('Left the channel');
            }

            if (localTracks) {
                // Stop and close all tracks
                localTracks.forEach(track => track.stop());
                localTracks.forEach(track => track.close());
            }

            setIsVideoCallActive(false); // Hide video call UI
        } catch (error) {
            console.error('Error ending the call:', error);
        }
    };

    return (
        <>
            {/* After SM screen */}
            {!isVideoCallActive && <div className="mt-5 relative mx-auto max-w-2xl hidden sm:block">
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
            {!isVideoCallActive && <div className=" relative w-full sm:hidden">
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
            {!isVideoCallActive && <div className='flex justify-center mx-auto max-w-2xl mt-5 mb-10'>
                <div className=' w-full rounded-2xl h-14 flex items-center justify-center gap-2 p-5 text-white'>
                    <div className='flex items-center justify-center bg-bg1 w-full rounded-2xl h-14'>
                        <img className="w-4 h-4 mt-[6px] object-cover" src={coin} alt="coin not found" />
                        <p className="font-bold text-lg">{rate}/min</p>
                    </div>
                    <button className='flex items-center justify-center gap-2 bg-bg1 w-full rounded-2xl h-14' onClick={startVideoCall}>
                        <CiVideoOn className='mt-1' size={20} />
                        Video Call
                    </button>
                </div>
            </div>}

            {/* Video call UI */}
            {isVideoCallActive && (
                <div className="absolute z-50 bottom-0 left-0 right-0 bg-black/80 p-4 flex justify-around items-center">
                    {localTracks[0]?.muted ? <button onClick={handleMicToggle} className="text-white">
                        <CiMicrophoneOff size={24} />
                    </button> :
                        <button onClick={handleMicToggle}>
                            <CiMicrophoneOn size={24} className="text-white" />
                        </button>}
                    <button onClick={handleCameraToggle} className="text-white">
                        <CiCamera size={24} />
                    </button>
                    <button onClick={endCall} className="text-red-600">
                        <SlCallEnd size={24} />
                    </button>
                </div>
            )}
            {console.log(isVideoCallActive)}
            <div id="local-player" className={`absolute  w-full ${isVideoCallActive ? "h-full" : "h-0"}  aspect-w-16 aspect-h-9`}></div>


        </>
    );
}

export default AgentProfile;
