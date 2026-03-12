/**
 * usePersistentState - Custom React hook for persistent state management
 *
 * This hook provides a drop-in replacement for useState that automatically
 * persists values to localStorage. When the component mounts, it reads the
 * value from localStorage if available, otherwise uses the provided default.
 * All state changes are automatically saved to localStorage.
 *
 * @param {string} key - Unique key for localStorage storage
 * @param {*} defaultValue - Default value to use if no stored value exists
 * @returns {[*, function]} - Tuple of [currentValue, setValue] just like useState
 *
 * @example
 * const [count, setCount] = usePersistentState('myCounter', 0);
 * // count will be 0 on first visit, then whatever was saved
 */
import { useState, useEffect } from 'react';

export function usePersistentState(key, defaultValue) {
    // Initialize state from localStorage or default
    const [value, setValue] = useState(() => {
        try {
            const stored = localStorage.getItem(key);
            if (stored !== null) {
                return JSON.parse(stored);
            }
        } catch (error) {
            console.warn(`Failed to load ${key} from localStorage:`, error);
        }
        return defaultValue;
    });

    // Save to localStorage whenever value changes
    useEffect(() => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.warn(`Failed to save ${key} to localStorage:`, error);
        }
    }, [key, value]);

    return [value, setValue];
}
