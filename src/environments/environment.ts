export const environment = {
  production: false,
  apiUrl: 'http://localhost:5286/api',
  keycloak: {
    url: 'http://localhost:8081',
    realm: 'plataforma-talento',
    clientId: 'plataforma-talento-frontend', // cliente público, sin secreto (PKCE)
    scope: 'openid profile email',
  },
};
