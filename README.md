# Simple Beedle App

Just a simple app which uses beedle for state management

## BUGS

### Script.js
line 167 - 171

```js
localCards.addEventListener('input', ({target}) => {
  const id = target.parentNode.parentNode.dataset.id;
  const value = target.value;
  storeInstance.dispatch('changeButtonNum', { id: id, value: value })
})
```
Input element doesn't retain its value.