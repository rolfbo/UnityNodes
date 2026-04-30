import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useROICalculations } from './useROICalculations';

describe('useROICalculations', () => {
  describe('basic calculations', () => {
    it('should calculate initial investment correctly', () => {
      const { result } = renderHook(() =>
        useROICalculations({
          numberOfNodes: 10,
          numberOfLicenses: 5,
          nodePrice: 1000,
          licensePrice: 500,
          rewardsPerNode: 1.5,
          monthlyHostingPerNode: 10,
          electricityCostPerNode: 5,
          uptimePercentage: 95,
          rampUpMonths: 0,
        })
      );

      const expected = (10 * 1000) + (5 * 500);
      expect(result.current.initialInvestment).toBe(expected);
    });

    it('should calculate monthly revenue correctly', () => {
      const { result } = renderHook(() =>
        useROICalculations({
          numberOfNodes: 10,
          numberOfLicenses: 5,
          nodePrice: 1000,
          licensePrice: 500,
          rewardsPerNode: 2.0,
          monthlyHostingPerNode: 10,
          electricityCostPerNode: 5,
          uptimePercentage: 100,
          rampUpMonths: 0,
        })
      );

      // 10 nodes * $2.0/day * 30 days = $600
      const expectedRevenue = 10 * 2.0 * 30;
      expect(result.current.monthlyRevenue).toBeCloseTo(expectedRevenue, 2);
    });

    it('should calculate monthly costs correctly', () => {
      const { result } = renderHook(() =>
        useROICalculations({
          numberOfNodes: 10,
          numberOfLicenses: 5,
          nodePrice: 1000,
          licensePrice: 500,
          rewardsPerNode: 1.5,
          monthlyHostingPerNode: 10,
          electricityCostPerNode: 5,
          uptimePercentage: 95,
          rampUpMonths: 0,
        })
      );

      // 10 nodes * ($10 + $5) = $150
      const expectedCosts = 10 * (10 + 5);
      expect(result.current.monthlyOperatingCost).toBe(expectedCosts);
    });

    it('should calculate net profit correctly', () => {
      const { result } = renderHook(() =>
        useROICalculations({
          numberOfNodes: 10,
          numberOfLicenses: 5,
          nodePrice: 1000,
          licensePrice: 500,
          rewardsPerNode: 2.0,
          monthlyHostingPerNode: 10,
          electricityCostPerNode: 5,
          uptimePercentage: 100,
          rampUpMonths: 0,
        })
      );

      const expectedRevenue = 10 * 2.0 * 30; // $600
      const expectedCosts = 10 * 15; // $150
      const expectedProfit = expectedRevenue - expectedCosts;

      expect(result.current.monthlyNetProfit).toBeCloseTo(expectedProfit, 2);
    });
  });

  describe('uptime percentage', () => {
    it('should reduce revenue based on uptime', () => {
      const fullUptime = renderHook(() =>
        useROICalculations({
          numberOfNodes: 10,
          numberOfLicenses: 5,
          nodePrice: 1000,
          licensePrice: 500,
          rewardsPerNode: 2.0,
          monthlyHostingPerNode: 10,
          electricityCostPerNode: 5,
          uptimePercentage: 100,
          rampUpMonths: 0,
        })
      );

      const halfUptime = renderHook(() =>
        useROICalculations({
          numberOfNodes: 10,
          numberOfLicenses: 5,
          nodePrice: 1000,
          licensePrice: 500,
          rewardsPerNode: 2.0,
          monthlyHostingPerNode: 10,
          electricityCostPerNode: 5,
          uptimePercentage: 50,
          rampUpMonths: 0,
        })
      );

      expect(halfUptime.result.current.monthlyRevenue).toBeCloseTo(
        fullUptime.result.current.monthlyRevenue * 0.5,
        2
      );
    });

    it('should handle 0% uptime', () => {
      const { result } = renderHook(() =>
        useROICalculations({
          numberOfNodes: 10,
          numberOfLicenses: 5,
          nodePrice: 1000,
          licensePrice: 500,
          rewardsPerNode: 2.0,
          monthlyHostingPerNode: 10,
          electricityCostPerNode: 5,
          uptimePercentage: 0,
          rampUpMonths: 0,
        })
      );

      expect(result.current.monthlyRevenue).toBe(0);
    });
  });

  describe('ramp-up calculations', () => {
    it('should apply ramp-up curve when specified', () => {
      const noRampUp = renderHook(() =>
        useROICalculations({
          numberOfNodes: 10,
          numberOfLicenses: 5,
          nodePrice: 1000,
          licensePrice: 500,
          rewardsPerNode: 2.0,
          monthlyHostingPerNode: 10,
          electricityCostPerNode: 5,
          uptimePercentage: 100,
          rampUpMonths: 0,
        })
      );

      const withRampUp = renderHook(() =>
        useROICalculations({
          numberOfNodes: 10,
          numberOfLicenses: 5,
          nodePrice: 1000,
          licensePrice: 500,
          rewardsPerNode: 2.0,
          monthlyHostingPerNode: 10,
          electricityCostPerNode: 5,
          uptimePercentage: 100,
          rampUpMonths: 6,
        })
      );

      // With ramp-up, break-even should be later
      expect(withRampUp.result.current.breakEvenMonth).toBeGreaterThan(
        noRampUp.result.current.breakEvenMonth
      );
    });

    it('should reach full revenue after ramp-up period', () => {
      const { result } = renderHook(() =>
        useROICalculations({
          numberOfNodes: 10,
          numberOfLicenses: 5,
          nodePrice: 1000,
          licensePrice: 500,
          rewardsPerNode: 2.0,
          monthlyHostingPerNode: 10,
          electricityCostPerNode: 5,
          uptimePercentage: 100,
          rampUpMonths: 3,
        })
      );

      // Check that projections exist and have reasonable values
      expect(result.current.monthlyProjections).toBeDefined();
      expect(result.current.monthlyProjections.length).toBeGreaterThan(0);

      // After ramp-up period, revenue should stabilize
      const lastMonth = result.current.monthlyProjections[result.current.monthlyProjections.length - 1];
      expect(lastMonth.revenue).toBeGreaterThan(0);
    });
  });

  describe('ROI calculations', () => {
    it('should calculate break-even month', () => {
      const { result } = renderHook(() =>
        useROICalculations({
          numberOfNodes: 10,
          numberOfLicenses: 5,
          nodePrice: 1000,
          licensePrice: 500,
          rewardsPerNode: 2.0,
          monthlyHostingPerNode: 10,
          electricityCostPerNode: 5,
          uptimePercentage: 100,
          rampUpMonths: 0,
        })
      );

      expect(result.current.breakEvenMonth).toBeGreaterThan(0);
      expect(result.current.breakEvenMonth).toBeLessThan(100); // Sanity check
    });

    it('should calculate annual ROI percentage', () => {
      const { result } = renderHook(() =>
        useROICalculations({
          numberOfNodes: 10,
          numberOfLicenses: 5,
          nodePrice: 1000,
          licensePrice: 500,
          rewardsPerNode: 2.0,
          monthlyHostingPerNode: 10,
          electricityCostPerNode: 5,
          uptimePercentage: 100,
          rampUpMonths: 0,
        })
      );

      expect(result.current.annualROI).toBeDefined();
      expect(result.current.annualROI).toBeGreaterThan(0);
    });
  });

  describe('edge cases', () => {
    it('should handle zero nodes', () => {
      const { result } = renderHook(() =>
        useROICalculations({
          numberOfNodes: 0,
          numberOfLicenses: 5,
          nodePrice: 1000,
          licensePrice: 500,
          rewardsPerNode: 2.0,
          monthlyHostingPerNode: 10,
          electricityCostPerNode: 5,
          uptimePercentage: 100,
          rampUpMonths: 0,
        })
      );

      expect(result.current.monthlyRevenue).toBe(0);
      expect(result.current.monthlyOperatingCost).toBe(0);
    });

    it('should handle very high node counts', () => {
      const { result } = renderHook(() =>
        useROICalculations({
          numberOfNodes: 1000,
          numberOfLicenses: 500,
          nodePrice: 1000,
          licensePrice: 500,
          rewardsPerNode: 2.0,
          monthlyHostingPerNode: 10,
          electricityCostPerNode: 5,
          uptimePercentage: 100,
          rampUpMonths: 0,
        })
      );

      expect(result.current.initialInvestment).toBe(1000 * 1000 + 500 * 500);
      expect(result.current.monthlyRevenue).toBeGreaterThan(0);
    });

    it('should handle fractional rewards', () => {
      const { result } = renderHook(() =>
        useROICalculations({
          numberOfNodes: 10,
          numberOfLicenses: 5,
          nodePrice: 1000,
          licensePrice: 500,
          rewardsPerNode: 0.123,
          monthlyHostingPerNode: 10,
          electricityCostPerNode: 5,
          uptimePercentage: 100,
          rampUpMonths: 0,
        })
      );

      expect(result.current.monthlyRevenue).toBeCloseTo(10 * 0.123 * 30, 2);
    });

    it('should not produce negative profits with reasonable inputs', () => {
      const { result } = renderHook(() =>
        useROICalculations({
          numberOfNodes: 10,
          numberOfLicenses: 5,
          nodePrice: 1000,
          licensePrice: 500,
          rewardsPerNode: 2.0,
          monthlyHostingPerNode: 10,
          electricityCostPerNode: 5,
          uptimePercentage: 100,
          rampUpMonths: 0,
        })
      );

      expect(result.current.monthlyNetProfit).toBeGreaterThan(0);
    });
  });

  describe('monthly projections', () => {
    it('should generate 12-month projections', () => {
      const { result } = renderHook(() =>
        useROICalculations({
          numberOfNodes: 10,
          numberOfLicenses: 5,
          nodePrice: 1000,
          licensePrice: 500,
          rewardsPerNode: 2.0,
          monthlyHostingPerNode: 10,
          electricityCostPerNode: 5,
          uptimePercentage: 100,
          rampUpMonths: 0,
        })
      );

      expect(result.current.monthlyProjections).toBeDefined();
      expect(result.current.monthlyProjections.length).toBe(12);
    });

    it('should have cumulative profit increasing over time', () => {
      const { result } = renderHook(() =>
        useROICalculations({
          numberOfNodes: 10,
          numberOfLicenses: 5,
          nodePrice: 1000,
          licensePrice: 500,
          rewardsPerNode: 2.0,
          monthlyHostingPerNode: 10,
          electricityCostPerNode: 5,
          uptimePercentage: 100,
          rampUpMonths: 0,
        })
      );

      const projections = result.current.monthlyProjections;
      
      for (let i = 1; i < projections.length; i++) {
        expect(projections[i].cumulativeProfit).toBeGreaterThanOrEqual(
          projections[i - 1].cumulativeProfit
        );
      }
    });
  });
});
