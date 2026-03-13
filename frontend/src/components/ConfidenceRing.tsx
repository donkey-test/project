import React from 'react';

interface ConfidenceRingProps {
  percentage: number;
  threatLevel: 'MALICIOUS' | 'SUSPICIOUS' | 'SAFE';
  size?: number;
}

export const ConfidenceRing: React.FC<ConfidenceRingProps> = ({ 
  percentage, 
  threatLevel,
  size = 120 
}) => {
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  const colors = {
    MALICIOUS: '#FF8C69',
    SUSPICIOUS: '#F4D35E',
    SAFE: '#9EFFBF',
  };

  const color = colors[threatLevel];

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg 
        width={size} 
        height={size} 
        className="progress-ring"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(58, 58, 56, 0.1)"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.5s ease' }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-heading text-[28px] font-bold text-[#1A3C2B]">
          {Math.round(percentage)}%
        </span>
      </div>
    </div>
  );
};

export default ConfidenceRing;
