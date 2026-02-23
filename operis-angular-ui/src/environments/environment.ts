export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080',
  keycloak: {
    issuer: 'http://localhost:9000/realms/operis',
    clientId: 'operis-ui',
    redirectUri: window.location.origin + '/auth/callback',
  },
  stripePublishableKey: 'pk_test_51QQUaWG2aV2eVEsyoI2Fb3WRGENSWLMxQZpCfrocs6rqo1hu9fqViYk8R5fPfXAx6ip2HKR8elrtskPtWT5zNqOj00htYdhlaL',
};
