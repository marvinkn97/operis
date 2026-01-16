import { AuthConfig } from 'angular-oauth2-oidc';

export const authConfig: AuthConfig = {
  issuer: 'http://localhost:9000/realms/operis', // Keycloak realm
  redirectUri: window.location.origin + '/projects', // Angular app URL
  clientId: 'operis-ui',                  // Keycloak client
  responseType: 'code',                         // Authorization code flow
  scope: 'openid profile email',                // Scopes
  showDebugInformation: true,                   // For dev only
  // silentRefreshRedirectUri: window.location.origin + '/assets/silent-refresh.html',
  // useSilentRefresh: false,
  postLogoutRedirectUri: window.location.origin,   // after logout
};
