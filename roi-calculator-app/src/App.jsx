/**
 * Main Application Component
 *
 * This is the root component of the Unity Nodes application.
 * It provides navigation between two main features:
 * 1. ROI Calculator - For projecting potential earnings
 * 2. Earnings Tracker - For tracking actual earnings
 *
 * The component uses React state to manage which page is currently displayed,
 * providing a simple tab-based navigation system without requiring a router.
 *
 * @component
 * @returns {JSX.Element} The application wrapper with navigation and active page
 */

import { useState } from 'react'
import { Calculator, TrendingUp } from 'lucide-react'
import UnityNodesROICalculator from './ROICalculatorApp.jsx'
import EarningsTrackerApp from './EarningsTrackerApp.jsx'

function App() {
  // State to manage which page is currently active
  // 'calculator' = ROI Calculator page
  // 'tracker' = Earnings Tracker page
  const [activePage, setActivePage] = useState('calculator')

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation Header */}
      <nav className="bg-slate-900/80 backdrop-blur-sm border-b border-purple-400/30 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo/Title */}
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Unity Nodes
              </h1>
            </div>

            {/* Navigation Tabs */}
            <div className="flex space-x-2">
              <button
                onClick={() => setActivePage('calculator')}
                className={`flex items-center gap-2 px-6 py-2 rounded-lg transition-all duration-200 ${activePage === 'calculator'
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/50'
                    : 'bg-slate-800/50 text-purple-200 hover:bg-slate-800 hover:text-white'
                  }`}
              >
                <Calculator size={20} />
                <span className="font-medium">ROI Calculator</span>
              </button>

              <button
                onClick={() => setActivePage('tracker')}
                className={`flex items-center gap-2 px-6 py-2 rounded-lg transition-all duration-200 ${activePage === 'tracker'
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/50'
                    : 'bg-slate-800/50 text-purple-200 hover:bg-slate-800 hover:text-white'
                  }`}
              >
                <TrendingUp size={20} />
                <span className="font-medium">Earnings Tracker</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <main>
        {activePage === 'calculator' ? (
          <UnityNodesROICalculator />
        ) : (
          <EarningsTrackerApp />
        )}
      </main>
    </div>
  )
}

export default App
