# Chessome: Authentication Architecture

## 1. Authentication Philosophy
Chessome is an open platform. We do not want to manage thousands of user passwords if we can avoid it. The primary authentication mechanism is **OAuth 2.0** via existing chess platforms. 
This provides a massive UX benefit: users log in with Lichess or Chess.com, and we instantly know their username, rating, and can begin syncing their games immediately.

## 2. Supported Authentication Methods

### 2.1 Primary (OAuth 2.0)
- **Lichess**: The preferred open-source provider. Lichess uses standard OAuth 2.0. We request read-only access to their profile and game history.
- **Chess.com**: Supported via their respective API protocols to allow users from the largest platform to migrate their data easily.

### 2.2 Secondary (Local/Standard)
- **Email & Password**: For users who wish to remain completely anonymous or disconnected from major platforms. Requires email verification and securely hashed passwords (Argon2 or bcrypt).

## 3. Session Management

- **Token Type**: JSON Web Tokens (JWT)
- **Storage**: HttpOnly, Secure Cookies. 
- **Why**: Storing JWTs in `localStorage` makes them vulnerable to Cross-Site Scripting (XSS). HttpOnly cookies prevent JavaScript from accessing the token, drastically reducing the attack surface.
- **Refresh Strategy**: Short-lived Access Tokens (e.g., 15 minutes) and long-lived Refresh Tokens (e.g., 7 days). The Refresh Token is stored in a separate HttpOnly cookie and verified against the Redis session store.

## 4. Architectural Decision Records (ADR)

### ADR-AUTH-001: HttpOnly Cookies over Authorization Headers for Web Clients
- **Why it exists**: The Next.js web client needs to maintain state. Setting `Authorization: Bearer <token>` on every Axios request is standard, but requires storing the token in JS memory or `localStorage`.
- **Trade-offs**: Cookies are vulnerable to Cross-Site Request Forgery (CSRF). 
- **Alternative approaches**: Storing JWT in memory and refreshing on every page load (poor UX).
- **Future scalability**: Native mobile apps (React Native) will use standard `Authorization` headers and store tokens in the device's Secure Enclave/Keychain, bypassing cookie limitations.
- **Risks**: CSRF attacks if SameSite attributes are misconfigured.
- **Engineering justification**: The Next.js frontend will use NextAuth.js (Auth.js) which handles the complexity of secure cookie management, CSRF tokens, and OAuth handshakes automatically. The NestJS backend will validate the session cookie. This provides the best balance of UX and security against XSS.

### ADR-AUTH-002: Zero-Knowledge Platform (Guest Mode)
- **Why it exists**: Many users just want to analyze a single FEN without creating an account.
- **Trade-offs**: Anonymous usage can lead to abuse of the Cloud Analysis engine.
- **Alternative approaches**: Forcing login for all features.
- **Future scalability**: Lowering the barrier to entry increases viral adoption.
- **Risks**: High server costs from anonymous bots.
- **Engineering justification**: Authentication is entirely optional for the core product. If a user is not authenticated, the platform defaults to **Local WASM Analysis only**. To use Cloud Analysis, a user must be authenticated. This perfectly balances the open-source ethos with the financial reality of running compute servers.
