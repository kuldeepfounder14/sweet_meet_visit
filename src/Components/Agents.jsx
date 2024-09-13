
import img3 from "../assets/img3.jpg"
import call1 from "../assets/pic/video/icon-call-redial.png"
import coin from "../assets/pic/chat/beans-icon.png"
import { RiRadioButtonLine } from "react-icons/ri"
import { FaFlag } from "react-icons/fa"
import { MdLiveTv } from "react-icons/md"
import axios from "axios"
import { useEffect, useState } from "react"
import { HiOutlineStatusOffline } from "react-icons/hi"
import { Link } from "react-router-dom"

// const data = [
//     {
//         img: img3,
//         rate: "3000",
//         name: "Priya Mishra",
//         location: "IN",
//         age: "25",
//         status: "Live",
//         statusIcon: <MdLiveTv />,
//         flag: <FaFlag />
//     },
//     {
//         img: img4,
//         rate: "2800",
//         name: "Nisha Singh",
//         location: "PH",
//         age: "28",
//         status: "Online",
//         statusIcon: <RiRadioButtonLine className="text-green-600" />,
//         flag: <FaFlag />

//     },
//     {
//         img: img6,
//         rate: "2000",
//         name: "Nushrat Khan",
//         location: "PK",
//         age: "20",
//         status: "Busy",
//         statusIcon: <RiRadioButtonLine className="text-red-600" />,
//         flag: <FaFlag />
//     },
//     {
//         img: img3,
//         rate: "3000",
//         name: "Priya Mishra",
//         location: "IN",
//         age: "25",
//         status: "Busy",
//         statusIcon: <RiRadioButtonLine className="text-red-600" />,
//         flag: <FaFlag />
//     },
//     {
//         img: img4,
//         rate: "2800",
//         name: "Nisha Singh",
//         location: "PH",
//         age: "28",
//         status: "Busy",
//         statusIcon: <RiRadioButtonLine className="text-red-600" />,
//         flag: <FaFlag />
//     },
//     {
//         img: img6,
//         rate: "2000",
//         name: "Nushrat Khan",
//         location: "PK",
//         age: "20",
//         status: "Busy",
//         statusIcon: <RiRadioButtonLine className="text-red-600" />,
//         flag: <FaFlag />
//     },
//     {
//         img: img3,
//         rate: "3000",
//         name: "Priya Mishra",
//         location: "IN",
//         age: "25",
//         status: "Busy",
//         statusIcon: <RiRadioButtonLine className="text-red-600" />,
//         flag: <FaFlag />
//     },
//     {
//         img: img4,
//         rate: "2800",
//         name: "Nisha Singh",
//         location: "PH",
//         age: "28",
//         status: "Online",
//         statusIcon: <RiRadioButtonLine className="text-green-600" />,
//         flag: <FaFlag />

//     },
//     {
//         img: img6,
//         rate: "2000",
//         name: "Nushrat Khan",
//         location: "PK",
//         age: "20",
//         status: "Busy",
//         statusIcon: <RiRadioButtonLine className="text-red-600" />,
//         flag: <FaFlag />
//     },
//     {
//         img: img3,
//         rate: "3000",
//         name: "Priya Mishra",
//         location: "IN",
//         age: "25",
//         status: "Busy",
//         statusIcon: <RiRadioButtonLine className="text-red-600" />,
//         flag: <FaFlag />
//     },
//     {
//         img: img4,
//         rate: "2800",
//         name: "Nisha Singh",
//         location: "PH",
//         age: "28",
//         status: "Busy",
//         statusIcon: <RiRadioButtonLine className="text-red-600" />,
//         flag: <FaFlag />
//     },
//     {
//         img: img6,
//         rate: "2000",
//         name: "Nushrat Khan",
//         location: "PK",
//         age: "20",
//         status: "Busy",
//         statusIcon: <RiRadioButtonLine className="text-red-600" />,
//         flag: <FaFlag />
//     },

// ]


function Agents() {
    const [agents, setAgents] = useState(null)

    const getAgents = async () => {
        try {
            const res = await axios.get("http://localhost:3000/sweetmeet/allusers")
            // const res = await axios.get("http://sweet_meet_backend.fapjoymall.com/sweetmeet/allusers")
            console.log(res)
            const filteredUsers = res?.data?.allUsers?.filter(item => item?.role === "agent")
            console.log(filteredUsers)
            setAgents(filteredUsers)

        } catch (err) {
            console.log("error", err)
        }
    }
    useEffect(() => {
        getAgents()
    }, [])
    console.log("agents", agents)

    return (
        <>
            <ul className="flex justify-between items-center gap-3 xsm:gap-5 px-5 xsm:px-10 overflow-x-auto my-5">
                <li>
                    <a href="#home" className=" bg-bg1 text-white focus:bg-bg1 focus:text-white px-2 py-1  rounded-md text-lg flex items-center gap-1  text-nowrap font-medium">All</a>
                </li>
                <li>
                    <a href="#middle" className="  focus:bg-bg1 focus:text-white px-2 py-1  rounded-md text-lg flex items-center gap-1  text-nowrap font-medium"><FaFlag /> India</a>
                </li>
                <li>
                    <a href="#footer" className="  focus:bg-bg1 focus:text-white px-2 py-1   rounded-md text-lg flex items-center gap-1  text-nowrap font-medium"> <FaFlag />Pakistan</a>
                </li>
                <li>
                    <a href="#footer" className="  focus:bg-bg1 focus:text-white px-2 py-1   rounded-md text-lg flex items-center gap-1  text-nowrap font-medium"> <FaFlag /> Philippines</a>
                </li>
                <li>
                    <a href="#footer" className="  focus:bg-bg1 focus:text-white px-2 py-1   rounded-md text-lg flex items-center gap-1  text-nowrap font-medium"><FaFlag /> Sri Lanka</a>
                </li>
                <li>
                    <a href="#footer" className="  focus:bg-bg1 focus:text-white px-2 py-1   rounded-md text-lg flex items-center gap-1  text-nowrap font-medium"><FaFlag /> Nepal</a>
                </li>
                <li>
                    <a href="#footer" className="  focus:bg-bg1 focus:text-white px-2 py-1   rounded-md text-lg flex items-center gap-1  text-nowrap font-medium"><FaFlag /> Bhutan</a>
                </li>
            </ul>
            <div className="flex flex-wrap justify-center">
                {agents?.map((item, index) => (
                    <Link to={`/agent/${item.uid}?rate=${item.details.agent_video_rate}&name=${item.username}&age=${item.age}&location=${item.details.agent_location}&images=${encodeURIComponent(JSON.stringify(item.details.agent_images))}`}
                        key={index} className="w-96 max-w-lg m-2">
                        <div className="relative h-[30rem] rounded-lg shadow-lg overflow-hidden border border-bg1">
                            <img
                                className="w-96 object-cover"
                                src={img3}
                                // src={item.img}
                                alt="Agent"
                            />
                            <div className="absolute top-0 left-0 right-0 p-3 text-white">
                                <div className="flex justify-between items-center">
                                    <div></div>
                                    <div className={`bg-black/70 flex items-center justify-center gap-1 py-1 px-2 rounded-2xl ${item.status === "Live" ? "text-[#48CFCB]" : "text-white"}`}>
                                        {(() => {
                                            switch (item.details.agent_online_status) {
                                                case 0:
                                                    return <HiOutlineStatusOffline className="text-red-600" />
                                                case 1:
                                                    return <RiRadioButtonLine className="text-green-600" />;
                                                case 2:
                                                    return <MdLiveTv />;
                                                case 3:
                                                    return <RiRadioButtonLine className="text-red-600" />;
                                                default:
                                                    return <RiRadioButtonLine className="text-green-600" />
                                            }
                                        })()}
                                        {(() => {
                                            switch (item.details.agent_online_status) {
                                                case 0:
                                                    return "Offline";
                                                case 1:
                                                    return "Online";
                                                case 2:
                                                    return "Live";
                                                case 3:
                                                    return "Busy";
                                                default:
                                                    return "Online";
                                            }
                                        })()}
                                    </div>
                                </div>
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 bg-black/30 p-3 text-white">
                                <div className="flex justify-between items-center">
                                    <div className="flex flex-col">
                                        <div className="flex gap-1">
                                            <img className="w-4 h-4 mt-[6px] object-cover" src={coin} alt="coin not found" />
                                            <p className="font-bold text-lg">{item.details.agent_video_rate}/min</p>
                                        </div>
                                        <p className="text-xl">{item.username}</p>
                                        <p className="text-xl flex items-center gap-1">{item.flag}
                                            {(() => {
                                                switch (item.location) {
                                                    case 1:
                                                        return "India"
                                                }
                                            })()}
                                            /{item.age}</p>
                                    </div>
                                    <div className="flex items-center">
                                        <img
                                            className="w-20 h-20 object-cover"
                                            src={call1}
                                            alt="Call Icon"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

        </>
    )
}

export default Agents