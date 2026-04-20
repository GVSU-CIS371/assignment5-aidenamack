import { defineStore } from "pinia";
import type { BeverageType, BaseBeverageType, CreamerType, SyrupType } from "../types/beverage";
import type { User } from "firebase/auth";
import db from "../firebase";
import {
  collection,
  getDocs,
  addDoc,
  onSnapshot,
  query,
  where,
  Unsubscribe,
} from "firebase/firestore";
import tempretures from "../data/tempretures.json";

export const useBeverageStore = defineStore("BeverageStore", {
  state: () => ({
    // Temperature state
    temps: tempretures,
    currentTemp: tempretures[0],

    // Ingredient states from Firestore
    bases: [] as BaseBeverageType[],
    creamers: [] as CreamerType[],
    syrups: [] as SyrupType[],

    // Current selections
    currentBase: null as BaseBeverageType | null,
    currentCreamer: null as CreamerType | null,
    currentSyrup: null as SyrupType | null,

    // User and beverage states
    user: null as User | null,
    beverages: [] as BeverageType[],
    selectedBeverageId: null as string | null,

    // Firestore listener cleanup
    beverageListener: null as Unsubscribe | null,
  }),

  actions: {
    /**
     * Initialize the store by loading ingredient data from Firestore
     */
    async init() {
      try {
        // Load bases from Firestore
        const basesSnapshot = await getDocs(collection(db, "bases"));
        this.bases = basesSnapshot.docs.map(
          (doc) =>
            ({
              id: doc.id,
              ...doc.data(),
            } as BaseBeverageType)
        );
        this.currentBase = this.bases[0] || null;

        // Load creamers from Firestore
        const creamersSnapshot = await getDocs(collection(db, "creamers"));
        this.creamers = creamersSnapshot.docs.map(
          (doc) =>
            ({
              id: doc.id,
              ...doc.data(),
            } as CreamerType)
        );
        this.currentCreamer = this.creamers[0] || null;

        // Load syrups from Firestore
        const syrupsSnapshot = await getDocs(collection(db, "syrups"));
        this.syrups = syrupsSnapshot.docs.map(
          (doc) =>
            ({
              id: doc.id,
              ...doc.data(),
            } as SyrupType)
        );
        this.currentSyrup = this.syrups[0] || null;

        console.log("✓ Store initialized with ingredient data");
      } catch (error) {
        console.error("Error initializing store:", error);
      }
    },

    /**
     * Set the current user and listen to their beverages
     */
    async setUser(user: User | null) {
      // Detach previous listener if it exists
      if (this.beverageListener) {
        this.beverageListener();
        this.beverageListener = null;
      }

      // Update user state
      this.user = user;

      if (user) {
        // Set up listener for user's beverages
        const beveragesRef = collection(db, "beverages");
        const q = query(beveragesRef, where("uid", "==", user.uid));

        this.beverageListener = onSnapshot(q, (snapshot) => {
          this.beverages = snapshot.docs.map(
            (doc) =>
              ({
                id: doc.id,
                ...doc.data(),
              } as BeverageType)
          );

          // Set currentBeverage if we have beverages
          if (this.beverages.length > 0 && !this.selectedBeverageId) {
            this.selectedBeverageId = this.beverages[0].id;
          }
        });
      } else {
        // Clear beverages when user logs out
        this.beverages = [];
        this.selectedBeverageId = null;
      }
    },

    /**
     * Create and save a new beverage to Firestore
     */
    async makeBeverage(name: string): Promise<string> {
      // Check if user is signed in
      if (!this.user) {
        return "No user logged in, please sign in first.";
      }

      // Check if all required fields are filled
      if (
        !name ||
        !this.currentBase ||
        !this.currentCreamer ||
        !this.currentSyrup
      ) {
        return "Please complete all beverage options and the name before making a beverage.";
      }

      try {
        // Build unique beverage ID and document
        const beverageData = {
          id: `${this.user.uid}-${Date.now()}`,
          name,
          temp: this.currentTemp,
          base: this.currentBase,
          syrup: this.currentSyrup,
          creamer: this.currentCreamer,
          uid: this.user.uid,
          createdAt: new Date(),
        };

        // Add to Firestore
        const docRef = await addDoc(collection(db, "beverages"), beverageData);
        console.log("Beverage saved with ID:", docRef.id);

        // Update store state immediately
        const beverage: BeverageType = {
          id: docRef.id,
          name,
          temp: this.currentTemp,
          base: this.currentBase,
          syrup: this.currentSyrup,
          creamer: this.currentCreamer,
        };

        this.beverages.push(beverage);
        this.selectedBeverageId = beverage.id;

        return `Beverage ${name} made successfully!`;
      } catch (error) {
        console.error("Error creating beverage:", error);
        return "Error creating beverage. Please try again.";
      }
    },

    /**
     * Display a saved beverage by updating current selections
     */
    showBeverage(beverage: BeverageType) {
      this.selectedBeverageId = beverage.id;
      this.currentTemp = beverage.temp;
      this.currentBase = beverage.base;
      this.currentSyrup = beverage.syrup;
      this.currentCreamer = beverage.creamer;
      return beverage;
    },
  },
  persist: true,
});
