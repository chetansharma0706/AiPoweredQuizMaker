import { Client, Account, Databases, Storage } from 'appwrite';

const client = new Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT as string)
  .setProject(process.env.APPWRITE_PROJECT_ID as string);

const account = new Account(client);
const databases = new Databases(client);
const storage = new Storage(client);

export { client, account, databases, storage };
