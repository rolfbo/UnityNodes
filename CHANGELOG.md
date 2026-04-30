# Changelog

All notable changes to the Unity Nodes ROI Calculator project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - December 2025

### Added

#### Earnings Tracker Feature
- **New Earnings Tracker Application**: Comprehensive earnings tracking system for Unity Nodes
  - Three main views: Dashboard, Data Table, and Add Earnings
  - Auto-parsing of earnings data from Unity Nodes reward allocation page
  - Manual duplicate detection and flagging system
  - Node ID to license type mapping (Self-Run/Leased)
  - Export functionality (JSON, CSV, PDF)
  
- **Dashboard Visualizations**:
  - Key metrics cards (Total Earnings, This Month, Average Daily, Active Nodes)
  - Cumulative earnings line chart
  - Daily earnings bar chart
  - License type breakdown pie chart
  
- **Data Management**:
  - Interactive data table with sorting and filtering
  - Inline editing of entries
  - Delete functionality with confirmation
  - Advanced filtering by license type, date range, and search
  - localStorage persistence for all data

#### Navigation
- Dual-app navigation system between ROI Calculator and Earnings Tracker
- Consistent UI/UX across both applications
- Responsive design for mobile and desktop

#### Documentation
- Quick Start Guide for getting started quickly
- Comprehensive feature documentation in `instructions/` folder
- Data source documentation with direct links to Unity Nodes platform
- Manual duplicate check guide

### Changed
- Updated main `App.jsx` to support multi-app navigation
- Enhanced localStorage usage for data persistence
- Improved responsive design across all components

## [1.3.0] - December 2025

### Added

#### Reality Check Feature
- **Ecosystem Analysis**: Comprehensive financial analysis at ecosystem scale
  - Total market calculations across all 6,000 Unity Nodes
  - User market share analysis (nodes, licenses, revenue)
  - Revenue sustainability verification volume calculations
  - Competitive landscape comparison with other DePIN networks
  
- **Intelligent Warning System**:
  - Four warning levels: Alert (Red), Warning (Yellow), Caution (Orange), Info (Blue)
  - Automatic flag generation based on scenario parameters
  - Revenue sustainability checks
  - Market concentration warnings
  
- **Competitive Benchmarking**:
  - Comparison with Helium Mobile, NATIX Network, and Hivemapper
  - Revenue multiplier calculations
  - Market positioning analysis

- **Documentation**:
  - 78-page Reality Check feature guide
  - Comprehensive test reports with 4 test scenarios
  - Test validation documentation
  - FAQ section

## [1.2.0] - November 2025

### Added

#### Expected Uptime Feature
- Configurable uptime percentage for realistic earnings modeling
- Three preset scenarios: Realistic (95%), Optimistic (98%), Conservative (90%)
- Visual uptime percentage display
- Automatic revenue adjustment based on uptime
- Documentation in `instructions/expected-uptime-feature.md`

## [1.1.0] - November 2025

### Added

#### Ramp-Up Period Feature
- Configurable ramp-up period (0-24 months)
- Linear scaling of operations during ramp-up
- Separate ramp-up modeling for:
  - Phone procurement and setup
  - License activation
  - SIM card activation
  - Monthly operational costs
- Visual ramp-up timeline
- Documentation in `instructions/ramp-up-feature.md`

## [1.0.0] - October 2025

### Added

#### Initial Release - ROI Calculator
- **Node Configuration**:
  - Customizable number of nodes
  - Licenses per node configuration (default 200)
  - License distribution (self-run vs leased)
  
- **Cost Analysis**:
  - Node hardware costs
  - Phone/device costs per license
  - Monthly SIM card costs
  - Monthly credit costs per phone
  - Total investment calculation
  
- **Revenue Modeling**:
  - Multiple market share scenarios (Conservative, Moderate, Optimistic)
  - Revenue per license calculations
  - Lease revenue percentage settings
  - Monthly and annual revenue projections
  
- **Financial Metrics**:
  - Break-even analysis (months to ROI)
  - 12-month and 24-month ROI calculations
  - Monthly cash flow projections
  
- **Visualizations**:
  - Investment breakdown pie chart
  - Revenue breakdown pie chart
  - Monthly cash flow chart
  - Revenue comparison by scenario
  
- **User Experience**:
  - Clean, modern UI with Tailwind CSS
  - Responsive design for all screen sizes
  - Interactive tooltips with help information
  - URL parameter sharing for scenarios
  - localStorage persistence for settings

### Technical Stack
- React 19
- Vite 6
- Tailwind CSS 4
- Recharts 3 (data visualization)
- Lucide React (icons)
- jsPDF (PDF generation)
- html2canvas (screenshot generation)

---

## Version History Summary

- **v2.0.0**: Added Earnings Tracker, dual-app navigation
- **v1.3.0**: Added Reality Check ecosystem analysis
- **v1.2.0**: Added Expected Uptime feature
- **v1.1.0**: Added Ramp-Up Period feature
- **v1.0.0**: Initial ROI Calculator release

---

## Future Roadmap

### Planned Features
- Cloud sync for earnings data across devices
- Mobile app version (React Native)
- API integration with Unity Nodes for automatic data import
- Advanced analytics and reporting
- Tax reporting and export features
- Multi-user accounts and collaboration
- Email notifications for earnings milestones
- Historical performance tracking over time

### Under Consideration
- Integration with accounting software (QuickBooks, Xero)
- Machine learning predictions for earnings trends
- Portfolio optimization recommendations
- Community benchmarking (anonymous aggregate data)
- Automated backup and restore functionality

---

## Links
- [Documentation](instructions/)
- [Quick Start Guide](QUICK-START-GUIDE.md)
- [Contributing Guidelines](CONTRIBUTING.md)
- [License](LICENSE)
