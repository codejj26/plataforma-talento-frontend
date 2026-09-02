export const environment = {
  production: true,
  apiUrl: 'https://api.plataforma-talento.edu.co/api',
  keycloak: {
    url: 'https://auth.plataforma-talento.edu.co',
    realm: 'plataforma-talento',
    clientId: 'plataforma-talento-frontend',
    scope: 'openid profile email',
  },
};
