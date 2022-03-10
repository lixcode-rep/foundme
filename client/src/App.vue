<template>
  <div class="buttons">
    <Button
      v-for="preset of presets"
      :key="preset"
      :value="preset"
      :rate="currentCurrency.rate"
      :symbol="currentCurrency.symbol"
      v-model:current-value="currentValue"
    ></Button>
  </div>
  <div class="input">
    <label>{{ currentCurrency.symbol }}</label>
    <input type="text" v-model="currentValue" />
    <select v-model="currentCurrencyIndex">
      <option v-for="(item, index) in currencies" :key="index" :value="index">
        {{ item.code }}
      </option>
    </select>
  </div>
  <div class="error" v-if="error">
    {{ error }}
  </div>
  <div>
    <button @click="send">Send!</button>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import Button from "@/components/Button.vue";
import { round } from "@/helpers/rounding";

@Options({
  components: {
    Button,
  },
  watch: {
    currentCurrencyIndex(oldIndex: number, newIndex: number) {
      this.currentValue = `${round(
        (this.currentValue * this.currencies[oldIndex].rate) /
          this.currencies[newIndex].rate
      )}`;
    },
  },
})
export default class App extends Vue {
  presets = [40, 100, 200, 1000, 2500, 5000];
  suggestion = 40;

  currencies = [
    { name: "US Dollar", code: "USD", symbol: "$", rate: 1 },
    { name: "Euro", code: "EUR", symbol: "€", rate: 0.897597 },
    { name: "British Pound", code: "GBP", symbol: "£", rate: 0.81755 },
    { name: "Russian Ruble", code: "RUB", symbol: "₽", rate: 63.461993 },
  ];
  currentCurrencyIndex = 0;
  currentValue = `${this.suggestion}`;

  get currentCurrency() {
    return this.currencies[this.currentCurrencyIndex];
  }

  get error() {
    return !/^-?\d+$/.test(`${this.currentValue}`)
      ? "Invalid value"
      : parseFloat(this.currentValue) <= 0
      ? "The value must be bigger then zero"
      : null;
  }

  async send() {
    if (!this.error) {
      try {
        const response = await fetch("http://localhost:8081/donate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "omit",
          body: JSON.stringify({
            amount: parseInt(this.currentValue),
            currency: this.currentCurrency.code,
          }),
        });
        const responseBody = await response.json();

        if (responseBody?.ok) {
          alert("Thank you for your donation!");
        } else {
          alert("Error: " + responseBody?.error);
        }
      } catch (e) {
        alert("Failed to send request");
      }
    }
  }
}
</script>
