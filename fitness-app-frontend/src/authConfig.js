export const authConfig = {
    clientId: 'oauth2-pkce-client',
    authorizationEndpoint: 'http://localhost:8080/realms/fitness-oauth2/protocol/openid-connect/auth',
    tokenEndpoint: 'http://localhost:8080/realms/fitness-oauth2/protocol/openid-connect/token',
    redirectUri: 'http://localhost:5173/',
    scope: 'openid profile email offline_access',
    onRefreshTokenExpire: (event) => window.confirm('Session expired. Refresh page to continue using the site?') && event.logIn(),
}