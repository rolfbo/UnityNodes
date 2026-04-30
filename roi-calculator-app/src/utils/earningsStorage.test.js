import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  loadEarnings,
  saveEarnings,
  addEarning,
  updateEarning,
  deleteEarning,
  clearAllEarnings,
  exportToCSV,
  exportToJSON,
} from './earningsStorage';

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = value.toString();
    },
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

global.localStorage = localStorageMock;

describe('earningsStorage', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('loadEarnings', () => {
    it('should return empty array when no data exists', () => {
      const earnings = loadEarnings();
      expect(earnings).toEqual([]);
    });

    it('should load existing earnings from localStorage', () => {
      const mockData = [
        { id: '1', date: '2026-04-01', nodeId: 'node1', amount: 1.5 },
      ];
      localStorage.setItem('unityEarnings', JSON.stringify(mockData));

      const earnings = loadEarnings();
      expect(earnings).toEqual(mockData);
    });

    it('should handle corrupted localStorage data gracefully', () => {
      localStorage.setItem('unityEarnings', 'invalid json');
      const earnings = loadEarnings();
      expect(earnings).toEqual([]);
    });
  });

  describe('saveEarnings', () => {
    it('should save earnings to localStorage', () => {
      const mockData = [
        { id: '1', date: '2026-04-01', nodeId: 'node1', amount: 1.5 },
      ];
      
      saveEarnings(mockData);
      
      const stored = JSON.parse(localStorage.getItem('unityEarnings'));
      expect(stored).toEqual(mockData);
    });

    it('should handle empty array', () => {
      saveEarnings([]);
      const stored = JSON.parse(localStorage.getItem('unityEarnings'));
      expect(stored).toEqual([]);
    });
  });

  describe('addEarning', () => {
    it('should add new earning with generated ID', () => {
      const newEarning = {
        date: '2026-04-01',
        nodeId: 'node1',
        amount: 1.5,
        uptime: 95,
      };

      const result = addEarning(newEarning);
      
      expect(result).toHaveProperty('id');
      expect(result.date).toBe('2026-04-01');
      expect(result.nodeId).toBe('node1');
      expect(result.amount).toBe(1.5);

      const stored = loadEarnings();
      expect(stored).toHaveLength(1);
      expect(stored[0]).toMatchObject(newEarning);
    });

    it('should prevent duplicate entries (same date and nodeId)', () => {
      const earning = {
        date: '2026-04-01',
        nodeId: 'node1',
        amount: 1.5,
      };

      addEarning(earning);
      const duplicate = addEarning(earning);

      expect(duplicate).toBeNull();
      
      const stored = loadEarnings();
      expect(stored).toHaveLength(1);
    });

    it('should allow same date with different nodeId', () => {
      addEarning({ date: '2026-04-01', nodeId: 'node1', amount: 1.5 });
      addEarning({ date: '2026-04-01', nodeId: 'node2', amount: 2.0 });

      const stored = loadEarnings();
      expect(stored).toHaveLength(2);
    });
  });

  describe('updateEarning', () => {
    it('should update existing earning', () => {
      const earning = addEarning({
        date: '2026-04-01',
        nodeId: 'node1',
        amount: 1.5,
      });

      const updated = updateEarning(earning.id, { amount: 2.0 });

      expect(updated).toBe(true);
      
      const stored = loadEarnings();
      expect(stored[0].amount).toBe(2.0);
    });

    it('should return false for non-existent ID', () => {
      const result = updateEarning('nonexistent', { amount: 1.0 });
      expect(result).toBe(false);
    });

    it('should not allow duplicate after update', () => {
      addEarning({ date: '2026-04-01', nodeId: 'node1', amount: 1.5 });
      const second = addEarning({ date: '2026-04-02', nodeId: 'node1', amount: 2.0 });

      // Try to update second to have same date as first
      const result = updateEarning(second.id, { date: '2026-04-01' });

      expect(result).toBe(false);
    });
  });

  describe('deleteEarning', () => {
    it('should delete earning by ID', () => {
      const earning = addEarning({
        date: '2026-04-01',
        nodeId: 'node1',
        amount: 1.5,
      });

      const result = deleteEarning(earning.id);
      expect(result).toBe(true);

      const stored = loadEarnings();
      expect(stored).toHaveLength(0);
    });

    it('should return false for non-existent ID', () => {
      const result = deleteEarning('nonexistent');
      expect(result).toBe(false);
    });
  });

  describe('clearAllEarnings', () => {
    it('should clear all earnings', () => {
      addEarning({ date: '2026-04-01', nodeId: 'node1', amount: 1.5 });
      addEarning({ date: '2026-04-02', nodeId: 'node1', amount: 2.0 });

      clearAllEarnings();

      const stored = loadEarnings();
      expect(stored).toHaveLength(0);
    });
  });

  describe('exportToCSV', () => {
    it('should export earnings to CSV format', () => {
      addEarning({
        date: '2026-04-01',
        nodeId: 'node1',
        amount: 1.5,
        uptime: 95,
        tasks: 10,
      });

      const csv = exportToCSV();

      expect(csv).toContain('Date,Node ID,Amount,Uptime,Tasks');
      expect(csv).toContain('2026-04-01,node1,1.5,95,10');
    });

    it('should handle empty earnings', () => {
      const csv = exportToCSV();
      expect(csv).toBe('Date,Node ID,Amount,Uptime,Tasks\n');
    });
  });

  describe('exportToJSON', () => {
    it('should export earnings as JSON string', () => {
      const earning = addEarning({
        date: '2026-04-01',
        nodeId: 'node1',
        amount: 1.5,
      });

      const json = exportToJSON();
      const parsed = JSON.parse(json);

      expect(parsed).toHaveLength(1);
      expect(parsed[0]).toMatchObject({
        date: '2026-04-01',
        nodeId: 'node1',
        amount: 1.5,
      });
    });

    it('should handle empty earnings', () => {
      const json = exportToJSON();
      expect(json).toBe('[]');
    });
  });

  describe('data integrity', () => {
    it('should maintain data consistency across operations', () => {
      // Add multiple earnings
      const e1 = addEarning({ date: '2026-04-01', nodeId: 'node1', amount: 1.5 });
      const e2 = addEarning({ date: '2026-04-02', nodeId: 'node1', amount: 2.0 });
      const e3 = addEarning({ date: '2026-04-03', nodeId: 'node2', amount: 1.8 });

      // Update one
      updateEarning(e2.id, { amount: 2.5 });

      // Delete one
      deleteEarning(e1.id);

      // Verify final state
      const stored = loadEarnings();
      expect(stored).toHaveLength(2);
      expect(stored.find(e => e.id === e2.id).amount).toBe(2.5);
      expect(stored.find(e => e.id === e3.id)).toBeDefined();
      expect(stored.find(e => e.id === e1.id)).toBeUndefined();
    });

    it('should preserve numeric precision for amounts', () => {
      const earning = addEarning({
        date: '2026-04-01',
        nodeId: 'node1',
        amount: 1.234567,
      });

      const stored = loadEarnings();
      expect(stored[0].amount).toBe(1.234567);
    });

    it('should handle date formats correctly', () => {
      const earning = addEarning({
        date: '2026-12-31',
        nodeId: 'node1',
        amount: 1.5,
      });

      const stored = loadEarnings();
      expect(stored[0].date).toBe('2026-12-31');
    });
  });
});
