import type { Handler } from '@netlify/functions';
import { account } from './appwriteClient';

export const handler: Handler = async () => {
  try {
    await account.deleteSession('current');
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Logged out successfully' })
    };
  } catch (e: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: e.message })
    };
  }
};
