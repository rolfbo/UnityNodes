import { useState } from 'react';

/**
 * Custom hook for scenario save/load/delete/compare.
 */
export function useScenarios(currentState) {
    const [savedScenarios, setSavedScenarios] = useState([]);
    const [scenarioName, setScenarioName] = useState('');

    const saveCurrentScenario = () => {
        if (!scenarioName.trim()) {
            alert('Please enter a scenario name');
            return;
        }

        const scenario = {
            id: Date.now(),
            name: scenarioName,
            ...currentState
        };

        setSavedScenarios([...savedScenarios, scenario]);
        setScenarioName('');
    };

    const loadScenario = (scenario) => {
        // Call all the setters from currentState
        Object.entries(scenario).forEach(([key, value]) => {
            if (key !== 'id' && key !== 'name' && currentState[`set${key.charAt(0).toUpperCase()}${key.slice(1)}`]) {
                const setterName = `set${key.charAt(0).toUpperCase()}${key.slice(1)}`;
                if (typeof currentState[setterName] === 'function') {
                    currentState[setterName](value);
                }
            }
        });
    };

    const deleteScenario = (id) => {
        setSavedScenarios(savedScenarios.filter(s => s.id !== id));
    };

    return { savedScenarios, scenarioName, setScenarioName, saveCurrentScenario, loadScenario, deleteScenario };
}
