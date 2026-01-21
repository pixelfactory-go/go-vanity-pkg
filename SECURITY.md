# Security Policy

## Supported Versions

We actively support the following versions with security updates:

| Version | Supported          |
| ------- | ------------------ |
| latest  | :white_check_mark: |
| main    | :white_check_mark: |

## Reporting a Vulnerability

We take the security of go-vanity-pkg seriously. If you discover a security vulnerability, please follow these steps:

### How to Report

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, please report them via one of the following methods:

1. **GitHub Security Advisories** (Preferred)
   - Navigate to the [Security tab](https://github.com/pixelfactory-go/go-vanity-pkg/security) of this repository
   - Click "Report a vulnerability"
   - Fill out the advisory form with details

2. **Email**
   - Send an email describing the vulnerability to the repository maintainers
   - Include as much detail as possible (see "What to Include" below)

### What to Include

To help us better understand and resolve the issue, please include:

- Type of vulnerability (e.g., XSS, injection, authentication bypass)
- Full paths of source file(s) related to the vulnerability
- Location of the affected source code (tag/branch/commit or direct URL)
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the vulnerability
- Suggested fix (if available)

### Response Timeline

- **Initial Response**: Within 48 hours of report submission
- **Status Update**: Within 7 days with an initial assessment
- **Resolution Timeline**: Varies based on severity and complexity
  - Critical: Within 7 days
  - High: Within 14 days
  - Medium: Within 30 days
  - Low: Within 60 days

### What to Expect

1. We will acknowledge receipt of your vulnerability report
2. We will investigate and validate the vulnerability
3. We will work on a fix and keep you updated on progress
4. Once fixed, we will:
   - Release a security patch
   - Publish a security advisory (with your permission)
   - Credit you for the discovery (unless you prefer to remain anonymous)

## Security Considerations for Users

### Deployment Best Practices

#### Cloudflare Workers Deployment

- **Configuration Security**: Keep your `config.json` file secure and do not commit sensitive repository information
- **Access Control**: Use Cloudflare Access or similar tools to restrict access if needed
- **Rate Limiting**: Consider implementing rate limiting to prevent abuse
- **Domain Verification**: Ensure your DNS records are properly configured and secured

#### Docker Deployment

- **Image Security**: Use the official images from `ghcr.io/pixelfactory-go/go-vanity-pkg`
- **Configuration Management**:
  - Mount `config.json` as read-only (`-v $(pwd)/config.json:/app/config.json:ro`)
  - Never build sensitive configuration into images
  - Use environment variables for sensitive data when possible
- **Network Security**: Run containers behind a reverse proxy with TLS/SSL enabled
- **Updates**: Regularly update to the latest image version
- **User Permissions**: Run containers with non-root users when possible

### Common Security Risks

1. **Configuration Exposure**
   - Risk: Accidentally committing sensitive repository URLs to public repositories
   - Mitigation: Use `.gitignore` for `config.json` if it contains sensitive data

2. **Open Redirects**
   - Risk: Malicious redirection to untrusted repositories
   - Mitigation: Validate all repository URLs in your configuration

3. **Denial of Service**
   - Risk: Excessive requests overwhelming your service
   - Mitigation: Use Cloudflare's built-in DDoS protection or implement rate limiting

## Security Features

- **Static Configuration**: Configuration is loaded at build/start time, reducing runtime attack surface
- **No Database**: Eliminates SQL injection and database-related vulnerabilities
- **TypeScript**: Type safety helps prevent common programming errors
- **Minimal Dependencies**: Reduced attack surface with fewer third-party dependencies
- **Edge Deployment**: Cloudflare Workers provide built-in DDoS protection and WAF

## Known Security Limitations

- This service trusts the repository URLs in `config.json`. Ensure only trusted repositories are configured
- The service does not authenticate Go package requests (by design, following Go's vanity import specification)
- Web UI is publicly accessible by default - implement access controls if needed

## Security Updates

Security updates will be:
- Published through GitHub Security Advisories
- Documented in release notes with `[SECURITY]` prefix
- Announced in the repository's changelog
- Tagged with appropriate CVE identifiers when applicable

## Acknowledgments

We appreciate the security research community's efforts to keep go-vanity-pkg safe. Security researchers who responsibly disclose vulnerabilities will be acknowledged in our security advisories (unless they prefer to remain anonymous).

## Policy Updates

This security policy may be updated from time to time. Please check back periodically for any changes.

---

Last updated: 2026-01-21
