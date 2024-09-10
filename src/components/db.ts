import { IDBPDatabase, openDB } from "idb";

interface Room {
  id: string;
  title: string;
  lastUpdated: string;
}

let db: IDBPDatabase;

interface Store {
  name: string;
  keyPath: string;
}

const dbName = "aigptku";
const ver = 1;
const stores = [
  {
    name: "rooms",
    keyPath: "id",
    autoIncrement: false,
  },
  {
    name: "scroll",
    keyPath: "id",
    autoIncrement: false,
  },
  {
    name: "chats",
    keyPath: "id",
    autoIncrement: true,
    index: ["idx_room_id", "room_id"],
  },
];

export async function createInitStore() {
  db = await openDB(dbName, ver, {
    upgrade: (db) => {
      stores.forEach((s) => {
        const store = db.createObjectStore(s.name, {
          keyPath: s.keyPath,
          autoIncrement: s.autoIncrement,
        });
        if (s.index && s.index.length >= 2) {
          store.createIndex(s.index[0], s.index[1]);
        }
      });
    },
  });

  console.log("init db created");
}

export const addToStore = async (store: string, data: any) => {
  // const db = await openDB(dbName, 1);
  return await db?.put(store, data);
};

export const deleteFromStore = async (store: string, key: string) => {
  // const db = await openDB(dbName, 1);
  return db?.delete(store, key);
};

export const getAllFromStore = async (store: string) => {
  // const db = await openDB(dbName, 1);
  console.log(store, db?.objectStoreNames);
  const result = await db.getAll(store);
  return result;
};

interface GetFromIndexOpt {
  indexName: string;
  indexValue: string;
}

export const getAllIndexedFromStore = async (
  store: string,
  opt: GetFromIndexOpt
) => {
  try {
    // const db = await openDB(dbName, 1);
    const tx = db.transaction(store, "readonly");
    const index = tx.store.index(opt.indexName);

    const result: any[] = [];

    for await (const cursor of index.iterate(opt.indexValue)) {
      result.push(cursor.value);
    }

    await tx.done;

    return result;
  } catch (error) {
    console.log(error);
  }
};

export const getFromStore = async (store: string, key: string) => {
  // const db = await openDB(dbName, 1);
  const result = await db.get(store, key);
  return result;
};
