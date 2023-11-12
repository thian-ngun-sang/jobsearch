// const handleClickOutside = (event) => {
//     if (dropdownRef.current !== null && !dropdownRef.current.contains(event.target) && logoutRequest) {
//         // document.removeEventListener('click', handleClickOutside);
//         // setLogoutRequest(false);
//         console.log("Clicked outside");
//     }else{
//         console.log("Clicked inside");
//     }
// };

// useEffect(() => {
//     document.addEventListener('click', handleClickOutside);

//     return () => {
//         document.removeEventListener('click', handleClickOutside);
//         console.log("Component was unmount");
//     }
// }, []);

// function LogoutRequest(){
//     return (
//         <div className="position-absolute logout-confirm" id="logout-confirm-id" ref={dropdownRef}>
//             <div className="text-center">
//                 Are you sure you want to logout?
//             </div>
//             <div className="logout-confirm-option text-end">
//                 <span className="custom-button custom-button-red" onClick={logout}>Yes</span>
//                 <span className="custom-button custom-button-green ms-2" onClick={toggleLogoutRequest}>No</span>
//             </div>
//         </div>
//     )
// }

//   **********************************************************************************************************

import React, { useState, useEffect, useRef } from 'react';

const Dropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    // Function to handle outside clicks
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        console.log("Clicked outside");
        setIsOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsOpen(prev => !prev);
  };

  return (
    <div className="dropdown" ref={dropdownRef}>
      <button className="dropdown-toggle" onClick={toggleDropdown}>
        Toggle Dropdown
      </button>
      {isOpen && <div>
            <ul className="">
            <li>Option 1</li>
            <li>Option 2</li>
            <li>Option 3</li>
            </ul>
        </div>}
    </div>
  );
};

export default Dropdown;