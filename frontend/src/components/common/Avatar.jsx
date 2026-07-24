import React from 'react';

export default function Avatar({ name = 'Traveler', imageUrl = '' }) {
  const initials = name.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase();

  if (imageUrl) {
    return <img src={imageUrl} alt={name} className="h-11 w-11 rounded-full object-cover ring-2 ring-slate-200" />;
  }

  return (
    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-teal-600 text-sm font-bold text-white ring-2 ring-teal-100">
      {initials}
    </div>
  );
}
