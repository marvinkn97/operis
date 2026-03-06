export const environment = {
  production: true,
  apiUrl: 'http://localhost:8080/api',
  keycloak: {
    issuer: 'http://localhost:9000/realms/operis',
    clientId: 'operis-ui',
    redirectUri: 'http://localhost:4200/auth/callback',
  },
  stripePublishableKey:
    'pk_test_51QQUaWG2aV2eVEsyoI2Fb3WRGENSWLMxQZpCfrocs6rqo1hu9fqViYk8R5fPfXAx6ip2HKR8elrtskPtWT5zNqOj00htYdhlaL',
};
