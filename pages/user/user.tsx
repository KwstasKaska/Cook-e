import React from 'react';
import Navbar from '../../components/Users/Navbar';
import Footer from '../../components/Users/Footer';

const user = () => {
  return (
    <>
      <div className="flex min-h-screen flex-col">
        <Navbar />

        <Footer></Footer>
      </div>
    </>
  );
};

export default user;
