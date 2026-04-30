# Security Policy

## Data Privacy

This application stores all data locally in your browser using localStorage. We do not collect, transmit, or store any user data on external servers.

### What Data is Stored Locally

- ROI calculator parameters and settings
- Earnings tracker data (transaction history, node mappings)
- User preferences and UI state

### Data Protection Recommendations

1. **Regular Backups**: Export your earnings data regularly using the built-in export features (JSON, CSV)
2. **Browser Data**: Clearing your browser's localStorage will delete all application data
3. **Private Browsing**: Using private/incognito mode will prevent data persistence
4. **Sensitive Information**: This tool is for financial planning - keep access to your browser secure

## Reporting a Vulnerability

If you discover a security vulnerability, please follow these steps:

### For Non-Critical Issues

1. Open an issue on GitHub with the "security" label
2. Provide a clear description of the vulnerability
3. Include steps to reproduce if applicable
4. Suggest a fix if you have one

### For Critical Security Issues

If you discover a critical security vulnerability that could compromise user data or application integrity:

1. **Do NOT** open a public issue
2. Email the maintainers directly (see contact information in the repository)
3. Provide detailed information about the vulnerability
4. Allow time for the issue to be addressed before public disclosure

## Security Best Practices for Contributors

When contributing to this project:

### Code Security

- Never commit API keys, passwords, or sensitive credentials
- Avoid using `eval()` or similar unsafe JavaScript functions
- Sanitize user inputs to prevent XSS attacks
- Use secure methods for data storage and retrieval

### Dependency Security

- Keep dependencies up to date
- Review dependency vulnerabilities regularly
- Use `npm audit` to check for known vulnerabilities
- Prefer well-maintained packages with active communities

### Testing

- Test for edge cases that could cause unexpected behavior
- Validate all user inputs
- Check for potential memory leaks with large datasets
- Test in different browsers and environments

## Supported Versions

We provide security updates for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 2.0.x   | ✅ Yes             |
| 1.x.x   | ⚠️ Limited support |
| < 1.0   | ❌ No              |

## Security Features

### Current Security Measures

- **Local-only data storage** - No server communication
- **No authentication required** - Reduces attack surface
- **Client-side only** - No backend vulnerabilities
- **Open source** - Community can review and audit code
- **No external dependencies at runtime** - Reduces supply chain risks

### What We Don't Do (Intentionally)

- **No user accounts** - Prevents credential theft
- **No cloud sync** - Eliminates data breach risks (may be added as optional feature in future)
- **No analytics tracking** - Protects user privacy
- **No external API calls** - Prevents data leakage

## Third-Party Dependencies

This application uses the following major dependencies:

- React (UI framework)
- Recharts (data visualization)
- jsPDF (PDF generation)
- Tailwind CSS (styling)

We regularly review and update these dependencies for security patches.

## Data Export Security

When exporting data:

- **JSON exports** - Plain text, contains all your earnings data
- **CSV exports** - Compatible with spreadsheets, consider encrypting if emailing
- **PDF exports** - Read-only format, safe for sharing summaries

### Recommendations for Exported Data

1. Store exported files securely
2. Encrypt sensitive data before sharing
3. Be cautious when uploading to cloud services
4. Use password protection for sensitive spreadsheets

## Browser Security

### Recommended Browsers

- Chrome/Edge (latest version)
- Firefox (latest version)
- Safari (latest version)

### Browser Settings

For optimal security:
- Keep your browser updated
- Use HTTPS when accessing the application (if hosted)
- Enable browser security features
- Be cautious with browser extensions that could access localStorage

## Compliance

This application:
- Does not collect personal data (GDPR compliant by design)
- Stores data only locally (no data transfer)
- Is open source for transparency and auditability

## Updates and Patches

Security updates will be released as soon as possible after discovery. Check the [CHANGELOG](CHANGELOG.md) for security-related updates.

## Questions?

For security-related questions, please:
1. Review this document
2. Check existing issues
3. Create a new issue with the "security" label

---

**Last Updated**: December 2025

**Note**: This is a client-side application. Always practice good security hygiene when handling financial data.
