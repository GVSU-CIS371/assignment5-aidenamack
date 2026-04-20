import { db } from "./firebase";
import { collection, setDoc, doc } from "firebase/firestore";

// Collection data types
interface Base {
  id: string;
  name: string;
  color: string;
}

interface Creamer {
  id: string;
  name: string;
  color: string;
}

interface Syrup {
  id: string;
  name: string;
  color: string;
}

// Initial data
const basesData: Base[] = [
  { id: "b1", name: "Black Tea", color: "#8B4513" },
  { id: "b2", name: "Green Tea", color: "#C8E6C9" },
  { id: "b3", name: "Coffee", color: "#6F4E37" },
];

const creamersData: Creamer[] = [
  { id: "c1", name: "No Cream", color: "transparent" },
  { id: "c2", name: "Milk", color: "AliceBlue" },
  { id: "c3", name: "Cream", color: "#F5F5DC" },
  { id: "c4", name: "Half & Half", color: "#FFFACD" },
];

const syrupsData: Syrup[] = [
  { id: "s1", name: "No Syrup", color: "transparent" },
  { id: "s2", name: "Vanilla", color: "#FFEFD5" },
  { id: "s3", name: "Caramel", color: "#DAA520" },
  { id: "s4", name: "Hazelnut", color: "#6B4423" },
];

/**
 * Populates the Firestore database with initial collections
 */
export async function setupFirestoreCollections() {
  try {
    // Setup bases collection
    const basesRef = collection(db, "bases");
    for (const base of basesData) {
      await setDoc(doc(basesRef, base.id), base);
    }
    console.log("✓ Bases collection populated");

    // Setup creamers collection
    const creamersRef = collection(db, "creamers");
    for (const creamer of creamersData) {
      await setDoc(doc(creamersRef, creamer.id), creamer);
    }
    console.log("✓ Creamers collection populated");

    // Setup syrups collection
    const syrupsRef = collection(db, "syrups");
    for (const syrup of syrupsData) {
      await setDoc(doc(syrupsRef, syrup.id), syrup);
    }
    console.log("✓ Syrups collection populated");

    console.log("✓ Firestore setup complete!");
    return true;
  } catch (error) {
    console.error("Error setting up Firestore collections:", error);
    throw error;
  }
}

/**
 * Individual setup functions for each collection (if you need to populate them separately)
 */
export async function setupBasesCollection() {
  const basesRef = collection(db, "bases");
  for (const base of basesData) {
    await setDoc(doc(basesRef, base.id), base);
  }
}

export async function setupCreamersCollection() {
  const creamersRef = collection(db, "creamers");
  for (const creamer of creamersData) {
    await setDoc(doc(creamersRef, creamer.id), creamer);
  }
}

export async function setupSyrupsCollection() {
  const syrupsRef = collection(db, "syrups");
  for (const syrup of syrupsData) {
    await setDoc(doc(syrupsRef, syrup.id), syrup);
  }
}
