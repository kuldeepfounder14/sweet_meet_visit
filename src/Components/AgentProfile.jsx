import { useEffect, useState } from 'react';
import { TbGenderDemigirl } from "react-icons/tb";
import coin from "../assets/pic/chat/beans-icon.png";
import likebg from "../assets/pic/phone/bubble-bj.png";
import img3 from "../assets/img3.jpg";
import { CiHeart, CiLocationOn, CiVideoOn, CiCamera, CiMicrophoneOn } from "react-icons/ci";
import { SlCallEnd } from "react-icons/sl";
import { useLocation, useParams } from 'react-router-dom';
import AgoraRTC from "agora-rtc-sdk-ng"; // Agora SDK

function AgentProfile() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isVideoCallActive, setIsVideoCallActive] = useState(false); // State to manage video call UI
    const [agoraClient, setAgoraClient] = useState(null); // Agora client state
    const [localTrack, setLocalTrack] = useState(null); // State to manage local track
    const { uid } = useParams();
    const locations = useLocation();
    const getQueryParams = () => new URLSearchParams(locations.search);
    const name = getQueryParams().get('name');
    const rate = getQueryParams().get('rate');
    const age = getQueryParams().get('age');
    const location = getQueryParams().get('location');
    const imagesString = getQueryParams().get('images');

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

                // Join the channel
                await client.join('c03a3f9678414dceb45332ac293e2ec4', channelName, agoraToken, "1234");

                // Create a local video track
                const tracks = await AgoraRTC.createMicrophoneAndCameraTracks();
                setLocalTrack(tracks);

                // Play the local video track
                tracks[1].play('local-player'); // You'll need a DOM element with id 'local-player' to show video

                // Publish the local track
                await client.publish(tracks);
                console.log('Video call started');
                setIsVideoCallActive(true); // Show video call UI
            } else {
                console.error('Failed to get Agora token');
            }
        } catch (error) {
            console.error('Error starting video call:', error);
        }
    };

    const handleMicToggle = () => {
        if (localTrack) {
            localTrack[0].setMuted(!localTrack[0].muted); // Toggle microphone
        }
    };

    const handleCameraToggle = () => {
        if (localTrack) {
            localTrack[1].setMuted(!localTrack[1].muted); // Toggle camera
        }
    };

    const endCall = async () => {
        try {
            if (agoraClient) {
                // Leave the channel
                await agoraClient.leave();
                console.log('Left the channel');
            }
            if (localTrack) {
                // Stop and close tracks
                localTrack.forEach(track => track.stop());
            }
            setIsVideoCallActive(false); // Hide video call UI
        } catch (error) {
            console.error('Error ending the call:', error);
        }
    };

    return (
        <>
            {/* After SM screen */}
            <div className="mt-5 relative mx-auto max-w-2xl hidden sm:block">
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
            </div>

            <div className='flex justify-center mx-auto max-w-2xl mt-5 mb-10'>
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
            </div>

            {/* Video call UI */}
            {isVideoCallActive && (

                <>
                    <div className="fixed bottom-0 left-0 right-0 bg-black/80 p-4 flex justify-around items-center">
                        <button onClick={handleMicToggle} className="text-white">
                            <CiMicrophoneOn size={24} />
                        </button>
                        <button onClick={handleCameraToggle} className="text-white">
                            <CiCamera size={24} />
                        </button>
                        <button onClick={endCall} className="text-red-600">
                            <SlCallEnd size={24} />
                        </button>
                    </div>
                    {/* Video call container */}
                </>
            )}
            <div id="local-player" className="absolute top-0 right-0 w-full h-full bg-black"></div>

        </>
    );
}

export default AgentProfile;
