import { Client, Databases } from "appwrite";
import { getDeviceId } from "../utils"; // Assuming you have the getDeviceId function in utils

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
      // Attach deviceId to the document when creating
      return await databases.createDocument(
        collection.dbId,
        collection.id,
        id,
        {
          ...payload,
          deviceId: getDeviceId(), // Add device ID to document
        }
      );
    },
    update: async (id, payload) => {
      // Update document without changing deviceId
      return await databases.updateDocument(
        collection.dbId,
        collection.id,
        id,
        payload
      );
    },
    delete: async (id) => {
      // Delete document by ID
      return await databases.deleteDocument(
        collection.dbId,
        collection.id,
        id
      );
    },
    get: async (id) => {
      // Fetch a single document by ID
      return await databases.getDocument(
        collection.dbId,
        collection.id,
        id
      );
    },
    list: async () => {
      const deviceId = getDeviceId(); // Get the deviceId of the current device
      // Fetch documents filtered by deviceId (only this device's notes)
      return await databases.listDocuments(
        collection.dbId,
        collection.id,
        [
          Query.equal("deviceId", deviceId), // Only fetch documents for this device
        ]
      );
    },
  };
});

export { client, databases, collections, db };
