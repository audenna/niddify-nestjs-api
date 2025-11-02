import * as dotenv from 'dotenv';

export function preloadEnv(): void {
  console.log('Loading the contents of ENV_FILE from secret.');
  if (process.env.ENV_FILE) {
    console.log('Loaded ENV_FILE from secret.');
    const parsed = dotenv.parse(process.env.ENV_FILE);
    console.log('Parsed environment from secret.', parsed);
    for (const [key, value] of Object.entries(parsed)) {
      process.env[key] = value;
    }
  } else {
    console.log('No ENV_FILE found, using fallback .env');
    dotenv.config({ path: '.env' });
  }
}
