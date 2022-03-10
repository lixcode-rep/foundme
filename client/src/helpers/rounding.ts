export function roundingLevel(value: number) {
  // if number > 50000 than display value will be rounded to 10000s
  // if number > 5000 than display value will be rounded to 1000s
  // if number > 500 than display value will be rounded to 100s
  // if number > 25 than display value will be rounded to 10s
  // if number <= 25 will display value be rounded to integer
  return value > 50000
    ? 10000
    : value > 5000
    ? 1000
    : value > 500
    ? 100
    : value > 25
    ? 10
    : 1;
}

export function roundByLevel(value: number, level: number) {
  return Math.round(value / level) * level;
}

export function round(value: number) {
  return roundByLevel(value, roundingLevel(value));
}
