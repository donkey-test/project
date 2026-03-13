import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ScanResult } from '../types';

interface ScanContextType {
  scans: ScanResult[];
  addScan: (scan: ScanResult) => void;
  clearScans: () => void;
}

const ScanContext = createContext<ScanContextType | undefined>(undefined);

export const ScanProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [scans, setScans] = useState<ScanResult[]>([]);

  const addScan = (scan: ScanResult) => {
    setScans((prev) => {
      const updated = [scan, ...prev];
      return updated.slice(0, 50); // Max 50 entries
    });
  };

  const clearScans = () => {
    setScans([]);
  };

  return (
    <ScanContext.Provider value={{ scans, addScan, clearScans }}>
      {children}
    </ScanContext.Provider>
  );
};

export const useScanContext = () => {
  const context = useContext(ScanContext);
  if (context === undefined) {
    throw new Error('useScanContext must be used within a ScanProvider');
  }
  return context;
};
