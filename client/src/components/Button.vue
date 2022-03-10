<template>
  <button
    :class="[{ active: parseFloat(currentValue) === displayValue }]"
    @click="onClick"
  >
    {{ symbol }}{{ displayValue }}
  </button>
</template>

<script lang="ts">
import { roundByLevel, roundingLevel } from "@/helpers/rounding";
import { Options, Vue } from "vue-class-component";

@Options({
  props: {
    value: Number,
    rate: Number,
    symbol: String,
    currentValue: String,
  },
})
export default class Button extends Vue {
  value!: number;
  rate!: number;
  symbol!: string;
  currentValue!: string;

  get finalValue() {
    return this.value * this.rate;
  }

  get roundingLevel() {
    return roundingLevel(this.finalValue);
  }

  get displayValue() {
    return roundByLevel(this.finalValue, this.roundingLevel);
  }

  onClick() {
    this.$emit("update:current-value", `${this.displayValue}`);
  }
}
</script>

<style>
button.active {
  background-color: #00c4ff;
}
</style>
