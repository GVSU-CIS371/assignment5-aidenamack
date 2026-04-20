<template>
  <div>
    <Beverage :isIced="beverageStore.currentTemp === 'Cold'" />
    <ul>
      <li>
        <template v-for="temp in beverageStore.temps" :key="temp">
          <label>
            <input
              type="radio"
              name="temperature"
              :id="`r${temp}`"
              :value="temp"
              v-model="beverageStore.currentTemp"
            />
            {{ temp }}
          </label>
        </template>
      </li>
      <li>
        <template v-for="base in beverageStore.bases" :key="base.id">
          <label>
            <input
              type="radio"
              name="base"
              :id="`r${base.id}`"
              :value="base"
              v-model="beverageStore.currentBase"
            />
            {{ base.name }}
          </label>
        </template>
      </li>
      <li>
        <template v-for="syrup in beverageStore.syrups" :key="syrup.id">
          <label>
            <input
              type="radio"
              name="syrup"
              :id="`r${syrup.id}`"
              :value="syrup"
              v-model="beverageStore.currentSyrup"
            />
            {{ syrup.name }}
          </label>
        </template>
      </li>
      <li>
        <template v-for="creamer in beverageStore.creamers" :key="creamer.id">
          <label>
            <input
              type="radio"
              name="creamer"
              :id="`r${creamer.id}`"
              :value="creamer"
              v-model="beverageStore.currentCreamer"
            />
            {{ creamer.name }}
          </label>
        </template>
      </li>
    </ul>

    <div class="auth-section">
      <div v-if="beverageStore.user" class="user-info">
        <span>{{ beverageStore.user.email }}</span>
        <button @click="signOut" class="signout-btn">Sign Out</button>
      </div>
      <div v-else>
        <button @click="withGoogle" class="google-signin-btn">Sign In with Google</button>
      </div>
      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
    </div>

    <input type="text" placeholder="Beverage Name" v-model="beverageName" />
    <button 
      @click="createBeverage"
      :disabled="!beverageStore.user"
      class="make-beverage-btn"
    >
      🍺 Make Beverage
    </button>
  </div>

  <div v-if="beverageStore.user" id="beverage-container" style="margin-top: 20px">
    <div class="saved-beverages">
      <label
        v-for="beverage in beverageStore.beverages"
        :key="beverage.id"
      >
        <input
          type="radio"
          name="savedBeverage"
          :value="beverage.id"
          v-model="beverageStore.selectedBeverageId"
          @change="beverageStore.showBeverage(beverage)"
        />
        {{ beverage.name }}
      </label>
    </div>
  </div>
</template>

<script setup lang="ts">
import Beverage from "./components/Beverage.vue";
import { useBeverageStore } from "./stores/beverageStore";
import { ref, onMounted } from "vue";
import { auth } from "./firebase";
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut as firebaseSignOut } from "firebase/auth";

const beverageStore = useBeverageStore();
const beverageName = ref("");
const errorMessage = ref("");

const withGoogle = async () => {
  try {
    errorMessage.value = "";
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    
    // Set the user in the store to start listening to their beverages
    await beverageStore.setUser(user);
    console.log("✓ Signed in as:", user.email);
  } catch (error: any) {
    const errorMsg = error?.message || "Sign in failed. Please try again.";
    console.error("Sign in error:", error);
    errorMessage.value = errorMsg;
    // Clear error after 5 seconds
    setTimeout(() => {
      errorMessage.value = "";
    }, 5000);
  }
};

const signOut = async () => {
  try {
    errorMessage.value = "";
    await firebaseSignOut(auth);
    await beverageStore.setUser(null);
    beverageName.value = "";
    console.log("✓ Signed out");
  } catch (error: any) {
    const errorMsg = error?.message || "Sign out failed. Please try again.";
    console.error("Sign out error:", error);
    errorMessage.value = errorMsg;
  }
};

const createBeverage = async () => {
  const message = await beverageStore.makeBeverage(beverageName.value);
  console.log(message);
  beverageName.value = "";
};

// Listen for auth state changes
onMounted(() => {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      await beverageStore.setUser(user);
    } else {
      await beverageStore.setUser(null);
    }
  });
});
</script>

<style lang="scss">
body,
html {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  background-color: #6e4228;
  background: linear-gradient(to bottom, #6e4228 0%, #956f5a 100%);
}
ul {
  list-style: none;
}

.auth-section {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 15px;
  color: white;
  font-weight: 600;
}

.error-message {
  color: #ff6b6b;
  background-color: rgba(255, 107, 107, 0.1);
  padding: 10px 15px;
  border-radius: 5px;
  font-size: 14px;
  border-left: 4px solid #ff6b6b;
}
</style>
