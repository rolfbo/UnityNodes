# Unity Nodes Project

A comprehensive web application for Unity Nodes participants to estimate ROI and track actual earnings.

## Overview

This project provides two main tools for Unity Nodes operators:

1. **ROI Calculator** - Estimate potential return on investment
2. **Earnings Tracker** - Track and analyze actual earnings

## Features

### ROI Calculator
- Interactive parameter input with real-time calculations
- Multiple market share scenarios (conservative, moderate, optimistic)
- License distribution management (self-run vs leased)
- Cost analysis including hardware, SIM cards, and credits
- Revenue projections with different earning models
- Visual dashboard with charts and key metrics
- Reality check comparisons with actual market data
- Ramp-up period modeling
- Expected uptime scenarios

### Earnings Tracker
- **Data Input**: Paste earnings data and auto-parse
- **Duplicate Detection**: Automatically skip duplicate entries
- **Node Mapping**: Map node IDs to license types
- **Interactive Dashboard**: 
  - Key metrics cards (Total, This Month, Average, Active Nodes)
  - Cumulative earnings chart
  - Daily earnings bar chart
  - License type breakdown pie chart
- **Data Table**: 
  - Sortable columns
  - Advanced filtering (by license type, date range, search)
  - Inline editing
  - Delete entries
- **Export Options**:
  - JSON format
  - CSV for spreadsheets
  - PDF reports

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm (comes with Node.js)

### Installation

1. Navigate to the project directory:
   ```bash
   cd roi-calculator-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or another port if 5173 is in use).

### Building for Production

Create an optimized production build:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Project Structure

```
UnityNodes/
├── roi-calculator-app/          # Main application
│   ├── src/
│   │   ├── App.jsx              # Main app with navigation
│   │   ├── ROICalculatorApp.jsx # ROI calculator component
│   │   ├── EarningsTrackerApp.jsx # Earnings tracker component
│   │   └── utils/
│   │       ├── earningsStorage.js  # localStorage management
│   │       ├── earningsParser.js   # Text parsing logic
│   │       ├── usePersistentState.js # State persistence
│   │       └── test-earnings.js    # Test suite
│   ├── package.json
│   └── README.md
├── instructions/                # Feature documentation
│   ├── earnings-tracker-feature.md
│   ├── reality-check-feature.md
│   ├── ramp-up-feature.md
│   └── expected-uptime-feature.md
└── README.md                    # This file
```

## Usage

### Using the ROI Calculator

1. Click on "ROI Calculator" in the navigation
2. Enter your parameters (number of nodes, licenses, costs, etc.)
3. Choose a market share scenario
4. Review the projections and charts
5. Use the Reality Check feature to compare with actual data
6. Share or export your calculations

### Using the Earnings Tracker

1. Click on "Earnings Tracker" in the navigation
2. Go to "Add Earnings" tab
3. Paste your earnings data in this format:
   ```
   0x01...a278
   + $0.07
   completed / 06 Dec 2025
   ```
4. Click "Parse and Add Earnings"
5. Map node IDs to license types in the "Data Table" tab
6. View visualizations in the "Dashboard" tab
7. Export data as needed (JSON, CSV, or PDF)

## Data Storage

All data is stored locally in your browser using localStorage:
- **Earnings data**: Persists across sessions
- **Node mappings**: Saved automatically
- **Calculator parameters**: Saved in URL for sharing

**Important**: 
- Data is not synced across devices
- Clearing browser data will delete all earnings
- Regular exports are recommended for backup

## Documentation

Detailed documentation for each feature can be found in the `instructions/` folder:
- [Earnings Tracker](instructions/earnings-tracker-feature.md)
- [Reality Check](instructions/reality-check-feature.md)
- [Ramp-up Period](instructions/ramp-up-feature.md)
- [Expected Uptime](instructions/expected-uptime-feature.md)

## Testing

### Manual Testing
1. Start the dev server: `npm run dev`
2. Open browser console
3. Import test file: `import { runTests } from './src/utils/test-earnings.js'`
4. Run tests: `runTests()`

### Testing the Earnings Tracker
Use the sample data provided in the "Add Earnings" tab to test the parser.

## Technologies Used

- **React 19**: UI framework
- **Vite**: Build tool and dev server
- **Tailwind CSS**: Styling
- **Recharts**: Data visualization
- **Lucide React**: Icons
- **jsPDF**: PDF generation
- **html2canvas**: Screenshot generation

## Browser Compatibility

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

**Note**: Requires JavaScript enabled and localStorage access.

## Contributing

When working on this project:
1. Keep code clean and well-commented
2. Follow existing code style
3. Test changes thoroughly
4. Update documentation as needed
5. Use descriptive commit messages

## License

ISC License

## Version History

### v2.0 (December 2025)
- ✨ Added Earnings Tracker feature
- ✨ Node ID to license type mapping
- ✨ Interactive dashboard with charts
- ✨ Export to JSON, CSV, and PDF
- ✨ Navigation between Calculator and Tracker

### v1.x (Previous)
- ROI Calculator with projections
- Reality Check feature
- Ramp-up period modeling
- Expected uptime scenarios

## Support

For issues or questions:
1. Check the documentation in `instructions/`
2. Review the README files
3. Check browser console for errors

## Future Enhancements

Potential features for future development:
- Cloud sync for earnings data
- Mobile app version
- API integration with Unity Nodes
- Advanced analytics and reporting
- Tax reporting features
- Multi-user accounts
- Email notifications
