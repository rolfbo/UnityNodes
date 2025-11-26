/**
 * Profit Context for Investment Allocation Planner
 *
 * This React Context manages the state for the profit allocation and investment planner.
 * It provides centralized state management for monthly profit, investment allocations,
 * and time horizons. The context includes persistence to localStorage to maintain
 * user preferences and calculations between sessions.
 *
 * Key features:
 * - Monthly profit tracking (from ROI calculator or manual input)
 * - Dynamic investment allocations with percentage splits
 * - Configurable time horizons for projections
 * - Automatic persistence and restoration from localStorage
 * - Validation helpers for allocation percentages
 *
 * The context is designed to be used throughout the planner components
 * to maintain consistent state and provide real-time updates.
 *
 * @component
 * @returns {JSX.Element} Context provider wrapping child components
 */

import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the context
const ProfitContext = createContext();

// Default investment template
const DEFAULT_INVESTMENT = {
  id: Date.now(),
  name: 'New Investment',
  percent: 0,
  apy: 7 // Default conservative APY
};

// Default context state
const DEFAULT_STATE = {
  monthlyProfit: 0,
  investments: [],
  horizonMonths: 12 // Default to 1 year
};

export const ProfitProvider = ({ children }) => {
  // Load initial state from localStorage or use defaults
  const [monthlyProfit, setMonthlyProfitState] = useState(() => {
    const saved = localStorage.getItem('profitPlanner_monthlyProfit');
    return saved ? parseFloat(saved) : DEFAULT_STATE.monthlyProfit;
  });

  const [investments, setInvestmentsState] = useState(() => {
    const saved = localStorage.getItem('profitPlanner_investments');
    return saved ? JSON.parse(saved) : DEFAULT_STATE.investments;
  });

  const [horizonMonths, setHorizonMonthsState] = useState(() => {
    const saved = localStorage.getItem('profitPlanner_horizonMonths');
    return saved ? parseInt(saved) : DEFAULT_STATE.horizonMonths;
  });

  // Persist to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('profitPlanner_monthlyProfit', monthlyProfit.toString());
  }, [monthlyProfit]);

  useEffect(() => {
    localStorage.setItem('profitPlanner_investments', JSON.stringify(investments));
  }, [investments]);

  useEffect(() => {
    localStorage.setItem('profitPlanner_horizonMonths', horizonMonths.toString());
  }, [horizonMonths]);

  // Setter functions with validation
  const setMonthlyProfit = (profit) => {
    const validProfit = Math.max(0, parseFloat(profit) || 0);
    setMonthlyProfitState(validProfit);
  };

  const setInvestments = (newInvestments) => {
    // Ensure all investments have valid data
    const validated = newInvestments.map(inv => ({
      ...inv,
      percent: Math.max(0, Math.min(100, parseFloat(inv.percent) || 0)),
      apy: Math.max(0, parseFloat(inv.apy) || 0)
    }));
    setInvestmentsState(validated);
  };

  const setHorizonMonths = (months) => {
    const validMonths = Math.max(1, parseInt(months) || 12);
    setHorizonMonthsState(validMonths);
  };

  // Helper functions for managing investments
  const addInvestment = () => {
    const newInvestment = {
      ...DEFAULT_INVESTMENT,
      id: Date.now() // Ensure unique ID
    };
    setInvestments([...investments, newInvestment]);
  };

  const updateInvestment = (id, updates) => {
    setInvestments(investments.map(inv =>
      inv.id === id ? { ...inv, ...updates } : inv
    ));
  };

  const removeInvestment = (id) => {
    setInvestments(investments.filter(inv => inv.id !== id));
  };

  // Calculate total allocation percentage
  const totalAllocationPercent = investments.reduce((sum, inv) => sum + inv.percent, 0);
  const personalUsePercent = Math.max(0, 100 - totalAllocationPercent);

  // Validation helper
  const isAllocationValid = totalAllocationPercent <= 100;

  // Context value
  const value = {
    // State
    monthlyProfit,
    investments,
    horizonMonths,

    // Setters
    setMonthlyProfit,
    setInvestments,
    setHorizonMonths,

    // Investment management
    addInvestment,
    updateInvestment,
    removeInvestment,

    // Computed values
    totalAllocationPercent,
    personalUsePercent,
    isAllocationValid
  };

  return (
    <ProfitContext.Provider value={value}>
      {children}
    </ProfitContext.Provider>
  );
};

// Custom hook to use the context
export const useProfitContext = () => {
  const context = useContext(ProfitContext);
  if (!context) {
    throw new Error('useProfitContext must be used within a ProfitProvider');
  }
  return context;
};

export default ProfitContext;
