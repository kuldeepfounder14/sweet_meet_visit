/* eslint-disable react/prop-types */
import { CgMenuBoxed } from 'react-icons/cg';
import { Link } from 'react-router-dom';

function Header() {

    return (
        <>
            {/* desktop */}
            <div className=" h-20 flex justify-between items-center shadow-sm bg-bg1 xsm:px-10">
                {/* <Link to="#" >
                    <img
                        src=""
                        className="w-10 h-10 p-1 rounded-full ring-2 ring-text dark:ring-text cursor-pointer"
                        alt="not found"
                    />
                </Link> */}
                <div>Logo</div>
                <nav className=" p-4 text-white">
                    {/* <ul className="flex justify-between items-center xsm:gap-5">
                        <li>
                            <a href="#home" className="text-white px-3 py-2 rounded-md text-lg   font-medium hover:text-gray-300 ">Home</a>
                        </li>
                        <li>
                            <a href="#middle" className="text-white px-3 py-2 rounded-md text-lg   font-medium hover:text-gray-300 ">Middle</a>
                        </li>
                        <li>
                            <a href="#footer" className="text-white px-3 py-2 rounded-md text-lg   font-medium hover:text-gray-300 ">Footer</a>
                        </li>
                    </ul> */}
                    Sweet Meet
                </nav>
            </div>
        </>
    );
}

export default Header;
