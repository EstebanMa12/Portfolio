import { createClient } from '@strapi/client';

const strapiClient = createClient({
  url: import.meta.env.PUBLIC_STRAPI_URL || 'http://localhost:1337',
  token: import.meta.env.PUBLIC_STRAPI_TOKEN,
});

export default strapiClient; 