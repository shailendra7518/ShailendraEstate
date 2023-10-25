import React from "react";

const Footer = () => {
  return (
    <footer className="bg-slate-200 h-16 flex items-center px-8">
      <div className="container mx-auto flex justify-between">
        <div>
          <h1 className="text-xl font-bold">ShailendraEstate</h1>
          <p className="mt-1 text-sm">Your Trusted Partner in Real Estate</p>
        </div>

        <div className="flex items-center">
          <p>&copy; 2023 ShailendraEstate. All rights reserved.</p>
              </div>
              
        <div className="flex items-center">
          <a href="#" className="mx-2 hover:text-gray-500">
            Home
          </a>
          <a href="#" className="mx-2 hover:text-gray-500">
            Properties
          </a>
          <a href="#" className="mx-2 hover:text-gray-500">
            About Us
          </a>
          <a href="#" className="mx-2 hover:text-gray-500">
            Contact
          </a>
          <a href="#" className="mx-2 hover:text-gray-500">
            Terms
          </a>
          <a href="#" className="mx-2 hover:text-gray-500">
            Privacy
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
