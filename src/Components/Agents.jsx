
import img3 from "../assets/img3.jpg"
import img4 from "../assets/img4.jpg"
import img6 from "../assets/img6.jpg"
import call1 from "../assets/pic/video/icon-call-redial.png"
import coin from "../assets/pic/chat/beans-icon.png"
import live from "../assets/pic/app/icon-Live.png"
import { RiRadioButtonLine } from "react-icons/ri"

const data = [
    {
        img: img3,
        rate: "3000",
        name: "Priya Mishra",
        location: "IN",
        age: "25",
        status:"Live",
        statusIcon:live
    },
    {
        img: img4,
        rate: "2800",
        name: "Nisha Singh",
        location: "PH",
        age: "28",
        status: "Online",
        statusIcon:<RiRadioButtonLine className="text-green-600" />

    },
    {
        img: img6,
        rate: "2000",
        name: "Nushrat Khan",
        location: "PK",
        age: "20",
        status: "Bust",
        statusIcon:<RiRadioButtonLine className="text-red-600" />
    },
    {
        img: img3,
        rate: "3000",
        name: "Priya Mishra",
        location: "IN",
        age: "25"
    },
    {
        img: img4,
        rate: "2800",
        name: "Nisha Singh",
        location: "PH",
        age: "28"
    },
    {
        img: img6,
        rate: "2000",
        name: "Nushrat Khan",
        location: "PK",
        age: "20"
    },
    {
        img: img3,
        rate: "3000",
        name: "Priya Mishra",
        location: "IN",
        age: "25"
    },
    {
        img: img4,
        rate: "2800",
        name: "Nisha Singh",
        location: "PH",
        age: "28"
    },
    {
        img: img6,
        rate: "2000",
        name: "Nushrat Khan",
        location: "PK",
        age: "20"
    },
    {
        img: img3,
        rate: "3000",
        name: "Priya Mishra",
        location: "IN",
        age: "25"
    },
    {
        img: img4,
        rate: "2800",
        name: "Nisha Singh",
        location: "PH",
        age: "28"
    },
    {
        img: img6,
        rate: "2000",
        name: "Nushrat Khan",
        location: "PK",
        age: "20"
    },

]

function Agents() {
    return (
        <>
            <div className="flex flex-wrap justify-center">
                <a href="agent" >
                    {data.map((item, index) => (
                        <div
                            key={index}
                            className="relative h-[30rem] sm:max-w-sm rounded-lg shadow-lg overflow-hidden border border-bg1"
                        >
                            <img
                                className="w-full h-f object-cover"
                                src={item.img}
                                alt="Agent"
                            />
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-transparent to-transparent p-3 text-white">
                                <div className="flex justify-between items-center">
                                    <div className="flex flex-col">
                                        <div className="flex gap-1">
                                            <img className="w-4 h-4 mt-[6px] object-cover" src={coin} alt="coin not found" />
                                            <p className="font-bold text-lg">{item.rate}/min</p>
                                        </div>
                                        <p className="text-xl">{item.name}</p>
                                        <p className="text-xl">{item.location}/{item.age}</p>
                                    </div>
                                    <div className="flex items-center">
                                        <img
                                            className="w-20 h-20 object-contain"
                                            src={call1}
                                            alt="Call Icon"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </a>
            </div>
        </>
    )
}

export default Agents