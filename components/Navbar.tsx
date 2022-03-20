/*  ./components/Navbar.jsx     */
import Link from 'next/link';
import {useState} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faChevronLeft, faChevronRight} from '@fortawesome/free-solid-svg-icons';
import {useContext} from 'react';
import {UserContext} from '../lib/context';

export const Navbar = () => {
  const [active, setActive] = useState(false);
  const {user, userData} = useContext(UserContext);

  const handleClick = () => {
    setActive(!active);
  };

  return (
    <>
      <header className="flex flex-wrap items-center bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 p-3">
        <Link href="/">
          <a className="mr-4 inline-flex items-center p-2 ">
            <FontAwesomeIcon icon={faChevronLeft} color={'white'} />
            <span className="p-1 text-xl font-bold uppercase tracking-wide text-white">Rafael Zasas</span>
            <FontAwesomeIcon icon={faChevronRight} color={'white'} />
          </a>
        </Link>
        <button
          className=" ml-auto inline-flex rounded p-3 text-white outline-none hover:bg-blue-600 hover:text-white lg:hidden"
          onClick={handleClick}
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        {/*Note that in this div we will use a ternary operator to decide whether or not to display the content of the div  */}
        <div className={`${active ? '' : 'hidden'}   w-full lg:inline-flex lg:w-auto lg:flex-grow`}>
          <div className="flex w-full flex-col items-start lg:ml-auto lg:inline-flex lg:h-auto  lg:w-auto lg:flex-row lg:items-center">
            <Link href="/">
              <a className="w-full items-center justify-center rounded px-3 py-2 font-bold text-white hover:bg-blue-700 hover:text-white lg:inline-flex lg:w-auto ">
                Home
              </a>
            </Link>
            <Link href="/about">
              <a className="w-full items-center justify-center rounded px-3 py-2 font-bold text-white hover:bg-blue-700 hover:text-white lg:inline-flex lg:w-auto">
                About
              </a>
            </Link>
            <Link href="/contact">
              <a className="w-full items-center justify-center rounded px-3 py-2 font-bold text-white hover:bg-blue-700 hover:text-white lg:inline-flex lg:w-auto">
                Contact
              </a>
            </Link>

            {userData && (
              <>
                <Link href="/profile">
                  <a className="w-full items-center justify-center rounded px-3 py-2 font-bold text-white hover:bg-blue-700 hover:text-white lg:inline-flex lg:w-auto">
                    Profile
                  </a>
                </Link>
              </>
            )}

            {!user && (
              <Link href="/login">
                <a className="w-full items-center justify-center rounded px-3 py-2 font-bold text-white hover:bg-blue-700 hover:text-white lg:inline-flex lg:w-auto">
                  Login
                </a>
              </Link>
            )}
          </div>
        </div>
      </header>
    </>
  );
};
