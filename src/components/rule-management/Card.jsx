
import React from 'react';

const gradientMap = {
  Logistics: { gradient: 'from-purple-500 via-purple-400 to-purple-100', textColor: 'text-[#790B8B]' },
  HR: { gradient: 'from-yellow-600 via-yellow-500 to-yellow-300', textColor: 'text-[#8B410B]' },
  Security: { gradient: 'from-green-500 via-green-400 to-green-100', textColor: 'text-[#438B0B]' },
  Finance: { gradient: 'from-blue-500 via-blue-400 to-blue-100', textColor: 'text-[#0B5D8B]' },
  Operations: { gradient: 'from-red-500 via-red-400 to-red-100', textColor: 'text-[#8B0B39]' },
};

function Card({ title, quantity, logoURL }) {
  console.log({ title, quantity, logoURL });
  const { gradient, textColor } = gradientMap[title] || { gradient: 'from-gray-300 to-gray-500', textColor: 'text-gray-500' };

  return (
    <div className={`w-64 rounded-2xl flex items-center p-4 md:flex-row border-2 bg-gradient-to-b ${gradient} p-[2px]`}>
      <div className={`bg-gradient-to-b ${gradient} dark:bg-gray-800 rounded-2xl w-full h-full flex justify-start items-center p-3`}>
        <div className='md:mr-4'>
          <img className='h-12 w-12 md:h-auto md:w-auto' src={logoURL} alt='logo' />
        </div>
        <div>
          <p className={`text-sm font-montserrat font-medium text-[16px] leading-[24px] tracking-[0%] ${textColor}`}>{title}</p>
          <h1 className='font-semibold text-[28px] leading-[42px] tracking-[0%] text-white'>
            {String(quantity).padStart(2, '0')}
          </h1>
        </div>
      </div>
    </div>
  );
}

export default Card;
