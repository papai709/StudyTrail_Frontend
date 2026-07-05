import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Working = () => {
  const [clicks, setClicks] = useState(0);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4">
      <div className="bg-gray-800/50 backdrop-blur-lg p-10 rounded-2xl border border-gray-700 text-center shadow-xl">
        <h1 className="text-4xl font-bold mb-4">We're Working On It!</h1>
        <p className="text-gray-400 mb-6">This page is currently under construction.</p>
      </div>
    </div>
  );
};

export default Working;