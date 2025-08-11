import type { Handler } from '@netlify/functions';
import { account, databases } from './appwriteClient';
import { Query } from 'appwrite';

export const handler: Handler = async () => {
  try {
    const user = await account.get();
    if (!user) {
      return { statusCode: 404, body: JSON.stringify({ error: 'No user found' }) };
    }

    const { documents } = await databases.listDocuments(
      process.env.APPWRITE_DATABASE_ID as string,
      process.env.APPWRITE_USERS_COLLECTION_ID as string,
      [Query.equal('accountId', user.$id)]
    );

    if (documents.length === 0) {
      return { statusCode: 404, body: JSON.stringify({ error: 'User data not found' }) };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(documents[0])
    };
  } catch (e: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: e.message })
    };
  }
};
