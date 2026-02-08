export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080',
  keycloak: {
    issuer: 'http://localhost:9000/realms/operis',
    clientId: 'operis-ui',
    redirectUri: window.location.origin + '/auth/callback',
  }
};
