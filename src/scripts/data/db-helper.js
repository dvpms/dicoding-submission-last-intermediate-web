// src/scripts/data/db-helper.js

import { openDB } from "idb";

const DATABASE_NAME = "story-app-database";
const DATABASE_VERSION = 1;
const OBJECT_STORE_NAME = "stories";

// Fungsi untuk membuka atau membuat database
const dbPromise = openDB(DATABASE_NAME, DATABASE_VERSION, {
  upgrade(database) {
    console.log("Upgrading database...");
    database.createObjectStore(OBJECT_STORE_NAME, { keyPath: "id" });
  },
});

const StoryDbHelper = {
  // Mengambil semua cerita dari IndexedDB
  async getAllStories() {
    console.log("Mengambil semua cerita dari IndexedDB...");
    return (await dbPromise).getAll(OBJECT_STORE_NAME);
  },

  // Mengambil satu cerita berdasarkan ID
  async getStory(id) {
    console.log(`Mengambil cerita dengan ID: ${id} dari IndexedDB...`);
    return (await dbPromise).get(OBJECT_STORE_NAME, id);
  },

  // Menyimpan atau memperbarui satu cerita
  async putStory(story) {
    if (!story || !story.id) {
      console.error("Gagal menyimpan cerita, data atau ID tidak valid:", story);
      return;
    }
    console.log("Menyimpan cerita ke IndexedDB:", story);
    return (await dbPromise).put(OBJECT_STORE_NAME, story);
  },

  // Menyimpan atau memperbarui banyak cerita sekaligus
  async putAllStories(stories) {
    if (!stories || stories.length === 0) return;
    console.log("Menyimpan semua cerita ke IndexedDB...");
    const tx = (await dbPromise).transaction(OBJECT_STORE_NAME, "readwrite");
    await Promise.all(stories.map((story) => tx.store.put(story)));
    await tx.done;
    console.log("Semua cerita berhasil disimpan.");
  },

  // Menghapus satu cerita berdasarkan ID
  async deleteStory(id) {
    if (!id) return;
    console.log(`Menghapus cerita dengan ID: ${id} dari IndexedDB...`);
    return (await dbPromise).delete(OBJECT_STORE_NAME, id);
  },
};

export default StoryDbHelper;
