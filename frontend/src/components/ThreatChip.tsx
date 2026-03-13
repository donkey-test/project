import React from 'react';

interface ThreatChipProps {
  level: 'MALICIOUS' | 'SUSPICIOUS' | 'SAFE';
  size?: 'sm' | 'md' | 'lg';
}

export const ThreatChip: React.FC<ThreatChipProps> = ({ level, size = 'md' }) => {
  const baseClasses = "font-mono uppercase font-semibold inline-flex items-center justify-center";
  
  const sizeClasses = {
    sm: 'text-[9px] px-2 py-0.5 tracking-[0.1em]',
    md: 'text-[10px] px-3 py-1 tracking-[0.1em]',
    lg: 'text-sm px-4 py-2 tracking-[0.08em]',
  };

  const colorClasses = {
    MALICIOUS: 'bg-[rgba(255,140,105,0.15)] border border-[#FF8C69] text-[#FF8C69]',
    SUSPICIOUS: 'bg-[rgba(244,211,94,0.15)] border border-[#F4D35E] text-[#F4D35E]',
    SAFE: 'bg-[rgba(158,255,191,0.15)] border border-[#9EFFBF] text-[#1A3C2B]',
  };

  return (
    <span className={`${baseClasses} ${sizeClasses[size]} ${colorClasses[level]}`}>
      {level}
    </span>
  );
};

export default ThreatChip;
