<template>
  <div v-if="showSyrup" class="syrup" :style="{ backgroundColor: syrupColor }"></div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useBeverageStore } from "../stores/beverageStore";

const beverageStore = useBeverageStore();
const showSyrup = computed(() => beverageStore.selectedSyrup?.name !== "No Syrup");
const syrupColor = computed(() => beverageStore.selectedSyrup?.color ?? "#c6c6c6");
</script>
<style lang="scss" scoped>
.syrup {
  transform: translateY(400%);
  position: relative;
  width: 100%;
  height: 20%;
  animation: pour-tea 2s 1s forwards;
  z-index: 2;
}
</style>
