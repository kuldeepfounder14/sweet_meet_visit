import React, { useEffect, useState } from 'react';
import { TbGenderDemigirl } from "react-icons/tb";
import img3 from "../assets/img3.jpg";
import img4 from "../assets/img4.jpg";
import img6 from "../assets/img6.jpg";
import coin from "../assets/pic/chat/beans-icon.png";
import likebg from "../assets/pic/phone/bubble-bj.png";

import { CiHeart, CiLocationOn, CiVideoOn } from "react-icons/ci";

function AgentProfile() {
    const [currentSlide, setCurrentSlide] = useState(0);

    const AgentData = [
        {
            img: [img3, img4, img6],
            rate: 3000,
            name: "Priya Mishra",
            location: "IN",
            age: 30,
            like: 30,
        }
    ];

    const handlePrevClick = () => {
        setCurrentSlide((prev) => (prev === 0 ? AgentData[0].img.length - 1 : prev - 1));
    };

    const handleNextClick = () => {
        setCurrentSlide((prev) => (prev === AgentData[0].img.length - 1 ? 0 : prev + 1));
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev === AgentData[0].img.length - 1 ? 0 : prev + 1));
        }, 2000);

        return () => clearInterval(interval);
    }, []);
    return (
        <>
            {/* After SM screen */}
            <div className="mt-5 relative mx-auto max-w-2xl hidden sm:block">
                <div className="relative aspect-w-16 aspect-h-9 overflow-hidden rounded-xl border border-bg1 max-h-screen">
                    {AgentData.map((item, index) => (
                        <div
                            key={index}
                            className="relative h-full w-full border border-bg1 rounded-xl overflow-hidden"
                        >
                            <img
                                className="w-full h-full object-fill object-center max-h-screen"
                                src={item.img[currentSlide]}
                                alt="Agent"
                            />
                            <div className="absolute flex justify-between bottom-0 left-0 right-0 p-3 bg-black/30 text-white">
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-1">
                                        <img className="w-4 h-4 mt-[6px] object-cover" src={coin} alt="coin" />
                                        <p className="font-bold text-lg">{item.name}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <p className="text-xl flex items-center">
                                            <CiLocationOn className="text-white bg-pink-500 rounded-full" />
                                            {item.location}
                                        </p>
                                        <p className="text-xl flex items-center">
                                            <TbGenderDemigirl className="text-white bg-pink-500 rounded-full" />
                                            {item.age}
                                        </p>
                                    </div>
                                </div>
                                <div className="relative flex items-center justify-center rounded-lg">
                                    <div className="absolute  right-0 bottom-0 w-28 h-10">
                                        <img
                                            src={likebg}
                                            className="w-full h-full rounded-full object-cover"
                                            alt="Like Background"
                                        />
                                    </div>
                                    <p className="absolute right-5 bottom-2 text-xl font-bold text-white flex items-center justify-center gap-1 z-10">
                                        <CiHeart size={25} />
                                        {item.like}k
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <button
                    type="button"
                    className="absolute top-0 start-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
                    onClick={handlePrevClick}
                >
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-full dark:bg-bg1 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
                        <svg
                            className="w-4 h-4 text-white rtl:rotate-180"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 6 10"
                        >
                            <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M5 1 1 5l4 4"
                            />
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
                        <svg
                            className="w-4 h-4 text-white rtl:rotate-180"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 6 10"
                        >
                            <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="m1 9 4-4-4-4"
                            />
                        </svg>
                        <span className="sr-only">Next</span>
                    </span>
                </button>
            </div>


            {/* Below SM screen */}
            <div className=" relative w-full sm:hidden">
                <div className="relative aspect-w-16 aspect-h-9 overflow-hidden">
                    {AgentData.map((item, index) => (
                        <div
                            key={index}
                            className="relative h-[30rem] xsm:h-[45rem] overflow-hidden"
                        >
                            <img
                                className="w-full h-full object-fill object-center max-h-screen"
                                src={item.img[currentSlide]}
                                alt="Agent"
                            />
                            <div className="absolute flex justify-between bottom-0 left-0 right-0 bg-black/30 p-3 text-white">
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-1">
                                        <img className="w-4 h-4 mt-[6px] object-cover" src={coin} alt="coin" />
                                        <p className="font-bold text-lg">{item.name}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <p className="text-xl flex items-center">
                                            <CiLocationOn className="text-white bg-pink-500 rounded-full" />
                                            {item.location}
                                        </p>
                                        <p className="text-xl flex items-center">
                                            <TbGenderDemigirl className="text-white bg-pink-500 rounded-full" />
                                            {item.age}
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
                                        {item.like}k
                                    </p>
                                </div>

                            </div>
                        </div>
                    ))}
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
            </div>

            {/* <h1 className='my-5 text-lg px-5 '> Gifts</h1>
            <div className='flex flex-wrap justify-center  gap-1 text-white '>
                <div className='bg-bg1 w-40 h-28 rounded-lg flex flex-col items-center p-3'>
                    <img
                        className="w-10 h-10 object-cover"
                        src={coin}
                        alt="coin"
                    />
                    <p>Juice</p>
                    <p>x13</p>
                </div>
                <div className='bg-bg1 w-40 h-28 rounded-lg flex flex-col items-center p-3'>
                    <img
                        className="w-10 h-10 object-cover"
                        src={coin}
                        alt="coin"
                    />
                    <p>Juice</p>
                    <p>x13</p>

                </div>
                <div className='bg-bg1 w-40 h-28 rounded-lg flex flex-col items-center p-3'>
                    <img
                        className="w-10 h-10 object-cover"
                        src={coin}
                        alt="coin"
                    />
                    <p>Juice</p>
                    <p>x13</p>

                </div>
                <div className='bg-bg1 w-40 h-28 rounded-lg flex flex-col items-center p-3'>
                    <img
                        className="w-10 h-10 object-cover"
                        src={coin}
                        alt="coin"
                    />
                    <p>Juice</p>
                    <p>x13</p>

                </div>
                <div className='bg-bg1 w-40 h-28 rounded-lg flex flex-col items-center p-3'>
                    <img
                        className="w-10 h-10 object-cover"
                        src={coin}
                        alt="coin"
                    />
                    <p>Juice</p>
                    <p>x13</p>

                </div>
                <div className='bg-bg1 w-40 h-28 rounded-lg flex flex-col items-center p-3'>
                    <img
                        className="w-10 h-10 object-cover"
                        src={coin}
                        alt="coin"
                    />
                    <p>Juice</p>
                    <p>x13</p>

                </div>
                <div className='bg-bg1 w-40 h-28 rounded-lg flex flex-col items-center p-3'>
                    <img
                        className="w-10 h-10 object-cover"
                        src={coin}
                        alt="coin"
                    />
                    <p>Juice</p>
                    <p>x13</p>

                </div>
                <div className='bg-bg1 w-40 h-28 rounded-lg flex flex-col items-center p-3'>
                    <img
                        className="w-10 h-10 object-cover"
                        src={coin}
                        alt="coin"
                    />
                    <p>Juice</p>
                    <p>x13</p>

                </div>
                <div className='bg-bg1 w-40 h-28 rounded-lg flex flex-col items-center p-3'>
                    <img
                        className="w-10 h-10 object-cover"
                        src={coin}
                        alt="coin"
                    />
                    <p >Juice</p>
                    <p>x13</p>
                </div>
            </div> */}



            <div className='flex justify-center  mx-auto max-w-2xl mt-5 mb-10 '>
                <div className='bg-bg1 w-full rounded-2xl h-14 flex items-center justify-center gap-2 p-5 text-white'>
                    <div className='flex'>
                        <img className="w-4 h-4 mt-[6px] object-cover" src={coin} alt="coin not found" />
                        <p className="font-bold text-lg">{3000}/min</p>
                    </div>
                    <button className='flex gap-2'> <CiVideoOn className='mt-1' size={20} />
                        Video Call</button>
                </div>
            </div>
        </>
    );
}

export default AgentProfile;
