import { useEffect, useState } from 'react';
import { TbGenderDemigirl } from "react-icons/tb";
import coin from "../assets/pic/chat/beans-icon.png";
import likebg from "../assets/pic/phone/bubble-bj.png";
import img3 from "../assets/img3.jpg";
import { CiHeart, CiLocationOn, CiVideoOn, CiCamera, CiMicrophoneOn, CiMicrophoneOff } from "react-icons/ci";
import { SlCallEnd } from "react-icons/sl";
import { LuCameraOff } from 'react-icons/lu';
import { MdOutlineFlipCameraIos } from 'react-icons/md';
import { useLocation, useParams } from 'react-router-dom';
import AgoraRTC from "agora-rtc-sdk-ng"; // Agora SDK
import axios from 'axios';

function AgentProfile() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isVideoCallActive, setIsVideoCallActive] = useState(false); // Manage video call UI state
    const [agoraClient, setAgoraClient] = useState(null); // Agora client state
    const [localTracks, setLocalTracks] = useState([]); // State to manage local tracks (audio/video)
    const [remoteTracks, setRemoteTracks] = useState([]); // State to manage remote tracks
    const [isFrontCamera, setIsFrontCamera] = useState(true); // State for front/back camera
    const [availableCameras, setAvailableCameras] = useState([]); // List of video devices (cameras)
    const [isCameraOn, setIsCameraOn] = useState(true); // Track if the camera is on or off
    const [currentCallId, setCurrentCallId] = useState(null); // Track if the camera is on or off
    const [isMicMuted, setIsMicMuted] = useState(localTracks[0]?.muted || false); // Initialize state

    const { uid } = useParams();
    const locations = useLocation();
    const getQueryParams = () => new URLSearchParams(locations.search);
    const name = getQueryParams().get('name');
    const rate = getQueryParams().get('rate');
    const age = getQueryParams().get('age');
    const location = getQueryParams().get('location');
    const imagesString = getQueryParams().get('images');
    const userId = 23;
    const appID = "c03a3f9678414dceb45332ac293e2ec4";

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

    //started call process
    const startVideoCall = async () => {
        if (isVideoCallActive) return;
        try {
            // const callStartResponse = await axios.post('http://localhost:3000/sweetmeet/agora/call/notify', {
            const callStartResponse = await axios.post('http://sweet_meet_backend.fapjoymall.com/sweetmeet/agora/call/notify', {
                caller_id: userId,
                receiver_id: uid,
                call_start: getIndianTime()
            });

            if (callStartResponse.data) {
                const callId = callStartResponse?.data.callId;
                console.log('Call started, ID:', callId[0].insertId);
                setCurrentCallId(callId[0].insertId);

                console.log('Call start notification sent successfully');

                // const response = await axios.get(http://localhost:3000/sweetmeet/agora/accesstoken, {
                const response = await axios.get("http://sweet_meet_backend.fapjoymall.com/sweetmeet/agora/accesstoken", {
                    params: {
                        channelName: ` sweetmeet-${userId}`,
                        uid: userId,
                        userRole: 'user',
                        expireTime: 3600
                    }
                });

                const data = response.data;
                const { agoraToken, channelName } = data;
                if (!channelName || !agoraToken) {
                    console.log("channelName ,agoraToken not found")
                }
                if (channelName && agoraToken) {
                    console.log("channelName", channelName)
                    console.log("agoraToken", agoraToken)
                    const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
                    setAgoraClient(client);

                    await client.join(appID, channelName, agoraToken, userId)
                        .then(() => {
                            console.log("Successfully joined the channel");
                        })
                        .catch((error) => {
                            console.error("Error in joining channel:", error);
                        });
                    const cameras = await AgoraRTC.getCameras();
                    setAvailableCameras(cameras);

                    const resolution = window.innerWidth <= 640 ? { width: 640, height: 360 } : { width: 1280, height: 720 };

                    const [microphoneTrack, cameraTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();
                    setLocalTracks([microphoneTrack, cameraTrack]);

                    cameraTrack.setEncoderConfiguration({
                        resolution,
                        frameRate: 30,
                        bitrate: window.innerWidth <= 640 ? 500 : 1000,
                        orientationMode: 'adaptive'
                    });

                    cameraTrack.play('local-player');
                    await client.publish([microphoneTrack, cameraTrack]);

                    client.on('user-published', async (user, mediaType) => {
                        await client.subscribe(user, mediaType);
                        if (mediaType === 'video') {
                            const remoteVideoTrack = user.videoTrack;
                            remoteVideoTrack.play('remote-player');
                            setRemoteTracks(prev => [...prev, remoteVideoTrack]);
                        }
                        if (mediaType === 'audio') {
                            user.audioTrack.play();
                        }
                    });

                    client.on('user-unpublished', (user) => {
                        console.log(user)
                        const remoteTracksToRemove = remoteTracks.filter(track => track.getId() === user.uid);
                        remoteTracksToRemove.forEach(track => track.stop());
                        setRemoteTracks(prev => prev.filter(track => track.getId() !== user.uid));
                    });

                    setIsVideoCallActive(true);
                } else {
                    console.error("Invalid channelName or agoraToken");
                }
            } else {
                console.error('Error sending call start notification:', callStartResponse.data.message);
            }
        } catch (err) {
            console.error("Error in video call:", err.response ? err.response.data : err.message);
        }
    };

    const handleMicToggle = () => {
        if (localTracks[0]) {
            const micTrack = localTracks[0];
            micTrack.setMuted(!micTrack.muted);
            setIsMicMuted(!micTrack.muted); // Update the state to trigger a re-render
        }
    };
    console.log(isMicMuted)
    // Switch between front and back cameras
    const switchCamera = async () => {
        if (!localTracks[1] || availableCameras.length <= 1) return;

        try {
            // Toggle between front and back cameras
            const newCameraDeviceId = isFrontCamera ? availableCameras[1].deviceId : availableCameras[0].deviceId;
            await localTracks[1].setDevice(newCameraDeviceId);

            setIsFrontCamera(!isFrontCamera);
        } catch (error) {
            console.error("Error switching camera:", error);
        }
    };

    const handleCameraToggle = async () => {
        try {
            if (localTracks[1]) {
                if (isCameraOn) {
                    await localTracks[1].setEnabled(false);
                } else {
                    await localTracks[1].setEnabled(true);
                }
                setIsCameraOn(!isCameraOn);
            }
        } catch (error) {
            console.error("Error toggling camera:", error);
        }
    };

    // Function to convert UTC to IST in frontend
    const getIndianTime = () => {
        const utcDate = new Date();

        // IST offset is UTC + 5 hours 30 minutes (5.5 hours)
        const istOffset = 5.5 * 60 * 60 * 1000; // IST offset in milliseconds
        const istDate = new Date(utcDate.getTime() + istOffset); // Convert to IST

        // Format the date to 'YYYY-MM-DD HH:MM:SS' for sending to the backend
        return istDate.toISOString().slice(0, 19).replace('T', ' ');
    };

    const endCall = async () => {
        console.log("currentCallId", currentCallId)
        try {
            if (agoraClient) {
                await agoraClient.leave();
                console.log('Left the channel');
            }

            if (localTracks) {
                localTracks.forEach(track => track.stop());
                localTracks.forEach(track => track.close());
            }

            setIsVideoCallActive(false);

            // Get current timestamp in IST
            const callEndTimestamp = getIndianTime();

            // const response = await fetch('http://localhost:3000/sweetmeet/agora/updateCallRecords', {
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
                <div className="absolute z-50 top-0 left-0 right-0 bg-black/30 p-4 flex justify-around items-center">
                    <div className='text-white font-bold'>{name}/{age} years old</div>
                </div>
            )}
            {isVideoCallActive && (
                <div className="absolute z-50 bottom-0 left-0 right-0 bg-black/30 p-4 flex justify-around items-center">
                    {isMicMuted ? <button onClick={handleMicToggle} className="text-white">
                        <CiMicrophoneOn className='text-white' size={24} />
                    </button> :
                        <button onClick={handleMicToggle}>
                            <CiMicrophoneOff size={24} className="text-white" />
                        </button>}
                    <button onClick={handleCameraToggle} className="text-white">
                        {isCameraOn ? <LuCameraOff size={22} />
                            : <CiCamera size={24} />}
                    </button>
                    <button onClick={switchCamera}>
                        {isFrontCamera ? <MdOutlineFlipCameraIos size={24} className="text-white" />
                            : <MdOutlineFlipCameraIos size={24} className="text-white" />
                        }
                    </button>
                    <button onClick={endCall} className="text-red-600">
                        <SlCallEnd size={24} />
                    </button>
                </div>
            )}
            {console.log(isVideoCallActive)}
            <div className="flex flex-1">
                <div id="remote-player" className={`absolute w-full ${isVideoCallActive ? "h-full" : "h-0"}`}></div>
                <div id="local-player" className={`absolute  w-full ${isVideoCallActive ? "h-full" : "h-0"}  aspect-w-16 aspect-h-9`}></div>
            </div>


        </>
    );
}

export default AgentProfile;
