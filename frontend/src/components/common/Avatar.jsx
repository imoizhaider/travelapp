import React from 'react';

export default function Avatar({ name = 'Traveler', imageUrl = '' }) {
  const initials = name.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase();

  if (imageUrl) {
    return <img src={imageUrl} alt={name} className="h-11 w-11 rounded-full object-cover ring-2 ring-white/10" />;
  }

  return (
    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-accent-blue to-accent-cyan text-sm font-bold text-white ring-2 ring-white/10">
      {initials}
    </div>
  );
}
