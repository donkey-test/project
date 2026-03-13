import React from 'react';

interface LCornerMarkersProps {
  children: React.ReactNode;
  className?: string;
}

export const LCornerMarkers: React.FC<LCornerMarkersProps> = ({ children, className = '' }) => {
  return (
    <div className={`relative ${className}`}>
      {/* Top Left */}
      <div className="absolute top-0 left-0 w-[10px] h-[12px] border-l-2 border-t-2 border-[#1A3C2B]" />
      {/* Top Right */}
      <div className="absolute top-0 right-0 w-[10px] h-[12px] border-r-2 border-t-2 border-[#1A3C2B]" />
      {/* Bottom Left */}
      <div className="absolute bottom-0 left-0 w-[10px] h-[12px] border-l-2 border-b-2 border-[#1A3C2B]" />
      {/* Bottom Right */}
      <div className="absolute bottom-0 right-0 w-[10px] h-[12px] border-r-2 border-b-2 border-[#1A3C2B]" />
      {children}
    </div>
  );
};

export default LCornerMarkers;
