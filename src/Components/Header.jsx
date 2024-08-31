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
                <div className='text-white'>Logo</div>
                <nav className="hidden md:block p-4 text-white">
                    <ul className="flex justify-between items-center gap-2 xsm:gap-5">
                        <li>
                            <a href="#home" className="text-white focus:underline  rounded-md text-lg   font-medium hover:text-gray-300 ">All</a>
                        </li>
                        <li>
                            <a href="#middle" className="text-white focus:underline  rounded-md text-lg   font-medium hover:text-gray-300 ">India</a>
                        </li>
                        <li>
                            <a href="#footer" className="text-white focus:underline  rounded-md text-lg   font-medium hover:text-gray-300 ">Pakistan</a>
                        </li>
                        <li>
                            <a href="#footer" className="text-white focus:underline  rounded-md text-lg   font-medium hover:text-gray-300 ">Philippines</a>
                        </li>
                    </ul>
                </nav>
            </div>
        </>
    );
}

export default Header;
