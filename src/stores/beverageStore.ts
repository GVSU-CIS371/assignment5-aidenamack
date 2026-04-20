import { defineStore } from "pinia";
import type { BeverageType } from "../types/beverage";
import tempretures from "../data/tempretures.json";
import bases from "../data/bases.json";
import creamers from "../data/creamers.json";
import syrups from "../data/syrups.json";

export const useBeverageStore = defineStore("BeverageStore", {
  state: () => ({
    temps: tempretures,
    currentTemp: tempretures[0],
    bases: bases,
    selectedBase: bases[0],
    creamers: creamers,
    selectedCreamer: creamers[0],
    syrups: syrups,
    selectedSyrup: syrups[0],
    savedBeverages: [] as BeverageType[],
    selectedSavedBeverageId: null as string | null,
  }),

  actions: {
    makeBeverage(name = "Saved Beverage") {
      const beverage: BeverageType = {
        id: `${Date.now()}`,
        name,
        temp: this.currentTemp,
        base: this.selectedBase,
        syrup: this.selectedSyrup,
        creamer: this.selectedCreamer,
      };

      this.savedBeverages.push(beverage);
      this.selectedSavedBeverageId = beverage.id;
      return beverage;
    },

    showBeverage(beverage: BeverageType) {
      this.selectedSavedBeverageId = beverage.id;
      this.currentTemp = beverage.temp;
      this.selectedBase = beverage.base;
      this.selectedSyrup = beverage.syrup;
      this.selectedCreamer = beverage.creamer;
      return beverage;
    },
  },
  persist: true,
});
