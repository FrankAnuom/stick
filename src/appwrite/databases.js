import { Client, Databases, Query } from "appwrite"; // Import Query here

const client = new Client()
  .setEndpoint(import.meta.env.VITE_ENDPOINT)
  .setProject(import.meta.env.VITE_PROJECT_ID);

const databases = new Databases(client);

const collections = [
  {
      name: "notes",
      id: import.meta.env.VITE_COLLECTION_NOTES_ID,
      dbId: import.meta.env.VITE_DATABASE_ID
  },
];

const db = {};

collections.forEach((collection) => {
    db[collection.name] = {
        create: async (payload, id = ID.unique()) => {
            return await databases.createDocument(
                collection.dbId,
                collection.id,
                id,
                payload
            );
        },
        update: async (id, payload) => {
            return await databases.updateDocument(
                collection.dbId,
                collection.id,
                id,
                payload
            );
        },
        delete: async (id) => {
            return await databases.deleteDocument(
                collection.dbId,
                collection.id,
                id
            );
        },
        get: async (id) => {
            return await databases.getDocument(
                collection.dbId,
                collection.id,
                id
            );
        },
        list: async (queries) => {
            return await databases.listDocuments(
                collection.dbId,
                collection.id,
                queries // Pass queries for filtering
            );
        },
    };
});

export { db };
