import React from 'react';

interface BrandLogoProps {
  className?: string;
  showSlogan?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ className = "", showSlogan = false }) => {
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <img 
        src="/icons/logo.svg" 
        alt="AME Logo" 
        className="w-24 md:w-28 h-auto object-contain select-none"
        
      />
      {showSlogan && (
        <div className="mt-2 text-center text-[10px] tracking-[0.2em] font-bold uppercase whitespace-nowrap">
          <span className="text-white">MISSÕES QUE </span>
          <span className="text-primary">TRANSFORMAM</span>
        </div>
      )}
    </div>
  );
};