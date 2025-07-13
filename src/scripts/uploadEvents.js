import { db } from "../lib/firebase.node.js";
import {
  collection,
  addDoc,
  serverTimestamp,
  writeBatch,
  doc,
} from "firebase/firestore";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// Handle JSON import for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const events = JSON.parse(
  fs.readFileSync(join(__dirname, "../data/events.json"), "utf8")
);

const uploadEvents = async () => {
  try {
    console.log(`📤 Starting upload of ${events.length} events...`);

    // Option 1: Using individual addDoc calls (your current approach)
    const uploadPromises = events.map(async (event, index) => {
      try {
        const docRef = await addDoc(collection(db, "events"), {
          ...event,
          createdAt: serverTimestamp(),
        });
        console.log(
          `✅ Event ${index + 1}/${events.length} uploaded with ID: ${
            docRef.id
          }`
        );
        return docRef;
      } catch (error) {
        console.error(`❌ Error uploading event ${index + 1}:`, error);
        throw error;
      }
    });

    await Promise.all(uploadPromises);
    console.log("🎉 All events uploaded successfully!");
  } catch (error) {
    console.error("❌ Error uploading events:", error);
    process.exit(1);
  }
};

// Alternative: Batch upload (more efficient for large datasets)
const uploadEventsBatch = async () => {
  try {
    console.log(`📤 Starting batch upload of ${events.length} events...`);

    // Firestore batches are limited to 500 operations
    const batchSize = 500;
    const batches = [];

    for (let i = 0; i < events.length; i += batchSize) {
      const batch = writeBatch(db);
      const batchEvents = events.slice(i, i + batchSize);

      batchEvents.forEach((event) => {
        const docRef = doc(collection(db, "events"));
        batch.set(docRef, {
          ...event,
          createdAt: serverTimestamp(),
        });
      });

      batches.push(batch);
    }

    // Execute all batches
    await Promise.all(batches.map((batch) => batch.commit()));
    console.log("🎉 All events uploaded successfully using batch!");
  } catch (error) {
    console.error("❌ Error uploading events:", error);
    process.exit(1);
  }
};

// Run the upload
uploadEvents();
// Or use batch upload for better performance:
// uploadEventsBatch();
