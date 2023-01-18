import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';

export const config: Config = {
  namespace: 'birdnest-nt',
  plugins: [
    sass()
  ],
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader',
    },
    {
      type: 'dist-custom-elements',
    },
    {
      type: 'docs-readme',
    },
    {
      type: 'www',
      serviceWorker: null, // disable service workers
    },
  ],
  env: {
    API_KEY: "***",
    AUTH_DOMAIN: "birdnest-nt.firebaseapp.com",
    PROJECT_ID: "birdnest-nt",
    STORAGE_BUCKET: "birdnest-nt.appspot.com",
    MESSAGING_SENDER_ID: "113546238055",
    APP_ID: "1:113546238055:web:8cb4f6c5e6994660eb1cc2",
    MEASUREMENT_ID: "G-01Z7BRX90M"
  }
};
