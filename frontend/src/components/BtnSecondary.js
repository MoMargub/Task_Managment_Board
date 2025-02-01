import React from 'react';

const BtnSecondary = ({ type = "button", children, ...rest }) => {
  return (
    <button 
      type={type} 
      {...rest} 
      className='text-indigo-600 bg-white border border-indigo-500 text-sm px-4 py-2 rounded-md hover:bg-indigo-500 hover:text-indigo-50 transition-colors focus:outline-none focus:ring focus:ring-indigo-300 focus:ring-offset-1'
    >
      {children}
    </button>
  );
};

export default BtnSecondary;
