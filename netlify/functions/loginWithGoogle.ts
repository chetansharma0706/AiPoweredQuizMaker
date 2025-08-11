// netlify/functions/loginWithGoogle.ts
import { Handler } from "@netlify/functions";
import { Client, Account, OAuthProvider } from "appwrite";

const client = new Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT as string)
  .setProject(process.env.APPWRITE_PROJECT_ID as string);

const account = new Account(client);

export const handler: Handler = async () => {
  try {
    const successUrl = `${process.env.FRONTEND_URL}/dashboard`;
    const failureUrl = `${process.env.FRONTEND_URL}/about`;

    // Create OAuth2 Session (Appwrite handles redirect)
    const sessionUrl = account.createOAuth2Session(
      OAuthProvider.Google,
      successUrl,
      failureUrl
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ url: sessionUrl })
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
