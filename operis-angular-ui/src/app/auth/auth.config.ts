import { AuthConfig } from 'angular-oauth2-oidc';
import { environment } from '../../environments/environment';

export const authConfig: AuthConfig = {
  issuer: environment.keycloak.issuer, // Keycloak realm
  redirectUri: environment.keycloak.redirectUri,
  clientId: environment.keycloak.clientId,                  // Keycloak client
  responseType: 'code',                         // Authorization code flow
  scope: 'openid profile email',                // Scopes
  showDebugInformation: true,                   // For dev only
  disablePKCE: false,
  // silentRefreshRedirectUri: window.location.origin + '/assets/silent-refresh.html',
  // useSilentRefresh: false,
  postLogoutRedirectUri: window.location.origin,   // after logout

};
