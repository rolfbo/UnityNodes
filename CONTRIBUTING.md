# Contributing to Unity Nodes ROI Calculator

Thank you for your interest in contributing to the Unity Nodes ROI Calculator! This document provides guidelines and information for contributors.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Coding Standards](#coding-standards)
- [Pull Request Process](#pull-request-process)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Features](#suggesting-features)

## Code of Conduct

This project is intended to be a safe, welcoming space for collaboration. Contributors are expected to:

- Be respectful and inclusive
- Accept constructive criticism gracefully
- Focus on what is best for the community
- Show empathy towards other community members

## How Can I Contribute?

### Types of Contributions

We welcome several types of contributions:

1. **Bug Fixes** - Fix issues in existing functionality
2. **Feature Enhancements** - Improve existing features
3. **New Features** - Add new capabilities to the calculator
4. **Documentation** - Improve or expand documentation
5. **Testing** - Add test cases or improve test coverage
6. **UI/UX Improvements** - Enhance the user interface and experience

### Before You Start

- Check the [Issues](../../issues) page to see if your bug/feature is already being discussed
- For major changes, open an issue first to discuss your proposed changes
- Make sure you understand the project structure (see [Project Structure](#project-structure))

## Development Setup

### Prerequisites

- **Node.js** v18 or higher
- **npm** (comes with Node.js)
- **Git** for version control

### Installation Steps

1. **Fork the Repository**
   - Click the "Fork" button on GitHub
   - Clone your fork: `git clone https://github.com/YOUR-USERNAME/UnityNodes.git`

2. **Navigate to Project**
   ```bash
   cd UnityNodes/roi-calculator-app
   ```

3. **Install Dependencies**
   ```bash
   npm install
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

5. **Open Browser**
   - Navigate to `http://localhost:5173` (or the port shown in terminal)

### Project Structure

```
UnityNodes/
├── roi-calculator-app/          # Main React application
│   ├── src/
│   │   ├── App.jsx              # Navigation and app shell
│   │   ├── ROICalculatorApp.jsx # ROI Calculator component
│   │   ├── EarningsTrackerApp.jsx # Earnings Tracker component
│   │   └── utils/               # Utility functions
│   │       ├── earningsStorage.js
│   │       ├── earningsParser.js
│   │       ├── usePersistentState.js
│   │       └── test-earnings.js
│   └── package.json
├── instructions/                # Feature documentation
└── README.md                    # Project overview
```

## Coding Standards

### General Principles

1. **Clean Code**
   - Write clear, self-documenting code
   - Use descriptive variable and function names
   - Keep functions small and focused on a single task

2. **Comments and Documentation**
   - Add comments explaining WHY, not WHAT
   - Document complex logic or business rules
   - Update documentation when changing features
   - At the top of files, explain what the file does

3. **Code Style**
   - Follow existing code formatting in the project
   - Use 2-space indentation (JavaScript/JSX)
   - Use meaningful variable names (avoid single letters except in loops)

### React/JavaScript Specific

```javascript
// Good: Descriptive component and variable names
const ROICalculatorApp = () => {
  const [numberOfNodes, setNumberOfNodes] = useState(1);
  
  // Calculate total investment based on node count and costs
  const calculateTotalInvestment = () => {
    return numberOfNodes * nodePrice + phonesNeeded * phonePrice;
  };
  
  return (
    // ...
  );
};

// Bad: Unclear names and no comments
const App = () => {
  const [n, setN] = useState(1);
  const calc = () => n * p + ph * pp;
};
```

### File Organization

- **One component per file** for major components
- **Group related utilities** in the `utils/` folder
- **Keep components** in the `src/` root or organized subfolders
- **Documentation files** go in `instructions/` folder

## Pull Request Process

### 1. Create a Branch

Create a descriptive branch name:

```bash
# For bug fixes
git checkout -b fix/description-of-bug

# For features
git checkout -b feature/description-of-feature

# For documentation
git checkout -b docs/description-of-update
```

### 2. Make Your Changes

- Write clean, well-commented code
- Follow the coding standards above
- Test your changes thoroughly
- Update documentation if needed

### 3. Commit Your Changes

Write clear, descriptive commit messages:

```bash
# Good commit messages
git commit -m "Fix calculation error in ROI break-even timeline"
git commit -m "Add export to PDF feature for earnings tracker"
git commit -m "Update reality check documentation with examples"

# Bad commit messages (avoid these)
git commit -m "fixed bug"
git commit -m "updates"
git commit -m "WIP"
```

### 4. Push to Your Fork

```bash
git push origin your-branch-name
```

### 5. Open a Pull Request

1. Go to the original repository on GitHub
2. Click "Pull Requests" → "New Pull Request"
3. Select your fork and branch
4. Fill out the PR template with:
   - **Description**: What does this PR do?
   - **Motivation**: Why is this change needed?
   - **Testing**: How did you test this?
   - **Screenshots**: If UI changes, include before/after images

### 6. Code Review

- Be responsive to feedback
- Make requested changes promptly
- Discuss disagreements professionally
- Update your PR based on review comments

### 7. Merge

Once approved, a maintainer will merge your PR!

## Reporting Bugs

### Before Submitting a Bug Report

1. **Check existing issues** to avoid duplicates
2. **Try the latest version** - the bug may already be fixed
3. **Collect information**:
   - What were you trying to do?
   - What did you expect to happen?
   - What actually happened?
   - Browser and version
   - Steps to reproduce

### How to Submit a Bug Report

Create an issue with:

**Title**: Short, descriptive summary

**Description**:
```markdown
## Expected Behavior
What should happen?

## Actual Behavior
What actually happens?

## Steps to Reproduce
1. Go to ROI Calculator
2. Set nodes to 10
3. Click on Reality Check
4. See error in console

## Environment
- Browser: Chrome 120
- OS: macOS 14
- Version: main branch (or commit hash)

## Screenshots/Videos
[If applicable, attach screenshots]

## Additional Context
Any other relevant information
```

## Suggesting Features

### Before Suggesting a Feature

1. **Check if it already exists** in a different form
2. **Review the roadmap** in README or issues
3. **Consider the scope** - does it fit the project goals?

### How to Suggest a Feature

Create an issue with:

**Title**: Clear feature request title

**Description**:
```markdown
## Problem Statement
What problem does this solve?

## Proposed Solution
How would this feature work?

## Alternatives Considered
What other approaches did you think about?

## Use Cases
Who would use this and why?

## Mockups/Examples
[If applicable, include sketches or examples]
```

## Testing

### Manual Testing

Before submitting a PR:

1. **Test the happy path** - normal usage works
2. **Test edge cases** - extreme values, empty inputs
3. **Test different scenarios** - various configurations
4. **Test in different browsers** - Chrome, Firefox, Safari
5. **Check console** - no errors or warnings

### Testing Checklist

- [ ] Feature works as expected
- [ ] No console errors
- [ ] UI looks good on desktop and mobile
- [ ] Data persists correctly (if using localStorage)
- [ ] Calculations are accurate
- [ ] Documentation is updated

## Documentation

When adding or changing features:

1. **Update README.md** if it affects setup or usage
2. **Create/update files in `instructions/`** for detailed features
3. **Add code comments** explaining complex logic
4. **Include examples** in documentation
5. **Update inline help tooltips** if relevant

## Questions?

If you have questions about contributing:

1. Check existing documentation in the `instructions/` folder
2. Search closed issues for similar questions
3. Open a new issue with the "question" label
4. Be specific about what you're trying to do

## Recognition

All contributors will be recognized in the project. Thank you for helping make Unity Nodes ROI Calculator better!

---

## Quick Start Checklist

New contributor? Here's a quick checklist:

- [ ] Fork the repository
- [ ] Clone your fork locally
- [ ] Install dependencies (`npm install`)
- [ ] Create a new branch (`git checkout -b feature/my-feature`)
- [ ] Make your changes
- [ ] Test thoroughly
- [ ] Commit with clear messages
- [ ] Push to your fork
- [ ] Open a Pull Request
- [ ] Respond to review feedback

**Welcome to the project! We're excited to see your contributions!** 🚀
