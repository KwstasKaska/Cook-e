import React from 'react';

interface MdlSectProps {}

const MdlSect: React.FC<MdlSectProps> = ({}) => {
  return (
    <div className="relative  w-full">
      <section className="absolute top-56 -z-[1] h-64 w-full -skew-y-12 transform  bg-myGrey-100  "></section>
    </div>
  );
};

export default MdlSect;
