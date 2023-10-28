import React from 'react';
import Navbar from '../../components/Users/Navbar';
import Footer from '../../components/Users/Footer';
import MdlSect from '../../components/Users/MdlSect';

const user = () => {
  return (
    <>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <MdlSect />
        <Footer />
      </div>
    </>
  );
};

export default user;
