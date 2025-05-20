// app/components/FeatureButton.jsx
'use client';

import React from 'react';
import Link from 'next/link';

const FeatureButton = ({ icon, label, href }) => {
  return (
    <Link href={href}>
      <div className="flex flex-col items-center justify-center m-3 p-3 rounded-lg shadow-md hover:bg-gray-100 cursor-pointer transition">
        <div className="text-2xl">{icon}</div>
        <span className="text-blue-600 font-semibold">{label}</span>
      </div>
    </Link>
  );
};

export default FeatureButton;
