import { databases, appwriteConfig } from './client';
import { ID } from 'appwrite';

type DBMethods = {
  create: (payload: any, permissions?: any, id?: string) => Promise<any>;
  update: (id: string, payload: any, permissions?: any) => Promise<any>;
  delete: (id: string) => Promise<any>;
  list: (queries?: any[]) => Promise<any>;
  get: (id: string) => Promise<any>;
};

const db: Record<string, DBMethods> = {};

interface Collections {
  dbId: string;
  clId: string;
  name: string;
}
const collections: Collections[] = [
  {
    dbId: appwriteConfig.databaseId,
    clId: appwriteConfig.usersCollectionId,
    name: 'users',
  },
];

collections.forEach((col) => {
  db[col.name] = {
    create: (payload, permissions, id = ID.unique()) =>
      databases.createDocument(col.dbId, col.clId, id, payload, permissions),
    update: (id, payload, permissions) =>
      databases.updateDocument(col.dbId, col.clId, id, payload, permissions),
    delete: (id) => databases.deleteDocument(col.dbId, col.clId, id),

    list: (queries = []) =>
      databases.listDocuments(col.dbId, col.clId, queries),

    get: (id) => databases.getDocument(col.dbId, col.clId, id),
  };
});

export default db;
