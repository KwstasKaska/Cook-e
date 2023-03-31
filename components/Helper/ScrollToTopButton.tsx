import React, { useEffect, useState } from 'react';

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const toggleVisibility = () => {
    if (typeof window !== 'undefined' && window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', toggleVisibility);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('scroll', toggleVisibility);
      }
    };
  }, []);

  return (
    <button
      className={`fixed bottom-2 right-4  animate-bounce rounded-full border-2 border-myRed bg-transparent p-4 text-black transition-all duration-300  ${
        isVisible ? 'visible opacity-100' : 'invisible opacity-0'
      }`}
      onClick={scrollToTop}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="#ED5B5B"
        className="h-6 w-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18"
        />
      </svg>
    </button>
  );
};

export default ScrollToTopButton;
