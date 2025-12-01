# Security Documentation

## Overview

This document outlines the security measures implemented in the TMDb Visualizer application and provides guidance for maintaining security best practices.

## Security Measures Implemented

### 1. API Key Protection

**Status**: ✅ Implemented

- API keys are stored in `.env.local` file (excluded from version control via `.gitignore`)
- No hardcoded secrets in the codebase
- Documentation includes warnings about API key security
- `.env.example` provides template without actual credentials

**Important Notes**:
- The TMDb API key is exposed on the client-side due to the nature of client-side API calls
- This is acceptable for TMDb's use case, as their API keys are designed for client-side usage
- Monitor API usage regularly to detect any abuse
- Set up billing alerts if applicable

**Best Practices**:
- Never commit `.env.local` to version control
- Rotate API keys periodically
- Consider implementing a backend proxy for production deployments (see recommendations below)

### 2. Security Headers

**Status**: ✅ Implemented

All deployments include comprehensive security headers configured in `vercel.json`:

- **Content-Security-Policy (CSP)**: Restricts resource loading to trusted sources
  - Scripts: Self-hosted only (with unsafe-inline for React)
  - Styles: Self-hosted only (with unsafe-inline for Tailwind)
  - Images: Self + TMDb CDN + data URIs
  - Connect: Self + TMDb API
  - Frames: Blocked (frame-ancestors 'none')

- **X-Frame-Options**: `DENY` - Prevents clickjacking attacks

- **X-Content-Type-Options**: `nosniff` - Prevents MIME-sniffing attacks

- **Referrer-Policy**: `strict-origin-when-cross-origin` - Controls referrer information

- **Permissions-Policy**: Disables geolocation, microphone, and camera access

- **Strict-Transport-Security (HSTS)**: Enforces HTTPS for 1 year including subdomains

### 3. Production-Safe Logging

**Status**: ✅ Implemented

A custom logger utility (`src/utils/logger.js`) ensures error messages are not exposed in production:

- **Development**: Full error logging to browser console
- **Production**: Silent logging (errors not exposed to end users)
- Build configuration strips all `console.*` calls in production builds

**Usage**:
```javascript
import { logger } from '@/utils/logger';

// Instead of console.error()
logger.error('Error message:', error);

// Instead of console.warn()
logger.warn('Warning message');
```

**Integration Points**:
- Error tracking service (e.g., Sentry) can be added to logger utility
- All API error handling uses the logger
- All cache operations use the logger

### 4. Data Privacy

**Status**: ✅ Acceptable Risk

- User search history and viewed shows are cached in `localStorage`
- Data stored is public information from TMDb API (non-sensitive)
- No personally identifiable information (PII) is collected or stored
- No authentication system (no user accounts or passwords)

**Considerations**:
- localStorage data persists across browser sessions
- Data is accessible to any JavaScript on the domain
- Cache clearing functionality is available
- Consider using `sessionStorage` for shorter data persistence if privacy is a concern

### 5. Dependency Security

**Status**: ✅ Maintained

- Regular `npm audit` checks for known vulnerabilities
- Dependencies are kept up-to-date
- No known high/critical vulnerabilities in dependencies

**Maintenance**:
```bash
# Check for vulnerabilities
npm audit

# Fix vulnerabilities automatically
npm audit fix

# Update dependencies
npm update
```

## Known Security Considerations

### Client-Side API Key Exposure

**Risk Level**: Medium (Acceptable for this use case)

The TMDb API key is necessarily exposed on the client-side due to direct browser-to-API communication. This is by design for many API providers, including TMDb.

**Mitigation Strategies**:

1. **Current Implementation** (Acceptable):
   - Monitor API usage dashboard at TMDb
   - Set up rate limiting alerts
   - Rotate keys if abuse is detected

2. **Enhanced Security** (Recommended for production):
   Implement a serverless backend proxy:

   ```javascript
   // api/tmdb.js (Vercel Serverless Function)
   export default async function handler(req, res) {
     const apiKey = process.env.TMDB_API_KEY; // Backend-only, not VITE_ prefix
     const { endpoint, ...params } = req.query;

     // Validate request
     if (!endpoint) {
       return res.status(400).json({ error: 'Missing endpoint' });
     }

     // Apply rate limiting
     // Add authentication if needed

     const response = await fetch(
       `https://api.themoviedb.org/3/${endpoint}?api_key=${apiKey}&${new URLSearchParams(params)}`
     );
     const data = await response.json();
     res.status(200).json(data);
   }
   ```

   Benefits:
   - API key stays on backend
   - Server-side rate limiting
   - Request validation and filtering
   - Usage analytics and monitoring

### localStorage Data Exposure

**Risk Level**: Low (Public data only)

Cached show data in localStorage is:
- Non-sensitive public information
- Does not include PII
- Only reveals user's viewing interests

**Enhanced Privacy** (If needed in future):

```javascript
import CryptoJS from 'crypto-js';

const ENCRYPTION_KEY = 'session-specific-key';

function encryptData(data) {
  return CryptoJS.AES.encrypt(JSON.stringify(data), ENCRYPTION_KEY).toString();
}

function decryptData(ciphertext) {
  const bytes = CryptoJS.AES.decrypt(ciphertext, ENCRYPTION_KEY);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
}
```

## Security Testing

### Manual Testing

1. **Security Headers Verification**:
   ```bash
   # Using curl
   curl -I https://your-domain.vercel.app

   # Using online tools
   # - https://securityheaders.com
   # - https://observatory.mozilla.org
   ```

2. **API Key Exposure Check**:
   - Open DevTools → Network tab
   - Search for API requests
   - Verify API key is not logged or exposed unnecessarily

3. **CSP Violations**:
   - Open DevTools → Console
   - Look for CSP violation warnings
   - Adjust CSP policy if legitimate resources are blocked

### Automated Testing

Add security scanning to CI/CD pipeline:

```yaml
# .github/workflows/security.yml
name: Security Audit

on: [push, pull_request]

jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm audit
      - run: npm run build
```

## Incident Response

### If API Key is Compromised

1. **Immediate Actions**:
   - Revoke the compromised key at [TMDb API Settings](https://www.themoviedb.org/settings/api)
   - Generate a new API key
   - Update `.env.local` with new key

2. **If Key Was Committed to Git**:
   ```bash
   # Remove from Git history (WARNING: Rewrites history)
   git filter-branch --force --index-filter \
     "git rm --cached --ignore-unmatch docs/SETUP.md" \
     --prune-empty --tag-name-filter cat -- --all

   # Or use BFG Repo-Cleaner (recommended)
   bfg --replace-text <(echo 'OLD_API_KEY==>REDACTED') .

   # Force push (after backing up)
   git push origin --force --all
   git push origin --force --tags
   ```

3. **Post-Incident**:
   - Notify all collaborators to re-clone repository
   - Monitor API usage for unusual activity
   - Review access logs if available
   - Update security documentation

### Suspicious API Usage

1. Check TMDb API usage dashboard
2. Review application logs for unusual patterns
3. Rotate API key if abuse confirmed
4. Consider implementing rate limiting or backend proxy

## Security Checklist

### Pre-Deployment

- [ ] No secrets in `.env.local` are committed to Git
- [ ] `.gitignore` includes `.env.local`
- [ ] Security headers configured in `vercel.json`
- [ ] Production logging uses logger utility
- [ ] `npm audit` shows no high/critical vulnerabilities
- [ ] Environment variables set in deployment platform (Vercel/Netlify)

### Post-Deployment

- [ ] Verify security headers at https://securityheaders.com
- [ ] Test CSP policy (no console errors)
- [ ] Confirm HTTPS is enforced
- [ ] Check API key is not exposed in public files
- [ ] Monitor initial API usage for anomalies

### Ongoing Maintenance

- [ ] Monthly `npm audit` and dependency updates
- [ ] Quarterly API key rotation
- [ ] Regular monitoring of TMDb API usage
- [ ] Review error tracking service (if implemented)
- [ ] Annual security review of codebase

## Reporting Security Issues

If you discover a security vulnerability:

1. **Do NOT** open a public issue
2. Email the repository owner directly
3. Include detailed description and steps to reproduce
4. Allow reasonable time for fix before public disclosure

## Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [TMDb API Documentation](https://developer.themoviedb.org/docs)
- [Vercel Security](https://vercel.com/docs/concepts/security)
- [Content Security Policy Guide](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)

---

**Last Updated**: 2025-11-30
**Next Review**: 2026-02-28
