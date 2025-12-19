# Authentication Configuration

This is a generic OpenID Connect (OIDC) authentication system that works with any OIDC provider (Google, GitHub, Auth0, etc.).

## Environment Variables Required

```
# OAuth/OIDC Configuration
ISSUER_URL=https://accounts.google.com  # The OIDC provider URL
OAUTH_CLIENT_ID=your-client-id          # Your OAuth application client ID
OAUTH_CLIENT_SECRET=your-client-secret  # Your OAuth application client secret (handled by passport)

# Session Configuration
SESSION_SECRET=your-session-secret-key  # Secret key for session encryption (change in production)
DATABASE_URL=sqlite:./parish.db         # Database URL for session storage

# Server Configuration
CALLBACK_URL=http://localhost:3000      # Your application's callback URL
NODE_ENV=development                    # development or production

# Optional
PORT=3000                               # Server port
```

## Supported Providers

- **Google OAuth 2.0**: Use `https://accounts.google.com`
- **GitHub OAuth**: Use `https://github.com`
- **Auth0**: Use your Auth0 tenant URL
- **Any OIDC-compliant provider**

## Setup Steps

1. Create an OAuth application with your chosen provider
2. Get your `Client ID` and `Client Secret`
3. Set the redirect URI to `http://localhost:3000/api/callback` (or your production URL)
4. Copy your provider's issuer URL
5. Set all required environment variables
6. The authentication routes will be available at:
   - `/api/login` - Start authentication
   - `/api/callback` - OAuth redirect URL
   - `/api/logout` - Logout and end session

## Files Changed from Replit

- Removed all `@replit/*` package dependencies
- Removed Replit-specific environment variables (REPL_ID)
- Migrated from Replit Auth to generic OpenID Connect
- Updated auth configuration to use standard OIDC flow
- Changed strategy name from `replitauth:domain` to generic `openidconnect`
