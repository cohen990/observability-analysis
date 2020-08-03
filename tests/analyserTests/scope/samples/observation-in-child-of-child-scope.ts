const scopeA = 100;

function scopeFunctionA() {
  function childOfChild() {
    console.log(scopeA);
  }
}
