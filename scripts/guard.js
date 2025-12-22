const originalRepeat = String.prototype.repeat;

String.prototype.repeat = function repeat(count) {
  if (typeof count === "number" && count < 0) {
    const err = new Error("String.repeat called with negative count");
    console.error("String.repeat negative call detected:", {
      value: this.toString(),
      count,
      stack: err.stack,
    });
  }
  return originalRepeat.call(this, count);
};
