import Store from './beedle.mjs';

const $ = n => document.querySelector(n);
const log = console.log;
const ace = (n, func) => n.addEventListener('click', func);



const actions = {
  alterNumber(context, payload) {
    context.commit('handleNumChange', payload)
  },
  addLocalCard(context, payload) {
    context.commit('handleCardAdding', payload)
  },
  changeButtonNum(context, payload) {
    context.commit('handleButtonNum', payload)
  },
  deleteCard(context, payload) {
    context.commit('handleCardDelete', payload)
  },
  resetCard(context, payload) {
    context.commit('handleCardReset', payload)
  }
}
const mutations = {
  handleNumChange(state, payload) {
    const card = state.miniCards.filter(card => card.id === +payload.id)[0];

    switch (payload.operation) {
      case 'add': card.value += +payload.value; break;
      case 'minus': card.value -= +payload.value; break;
      case 'times': card.value *= +payload.value; break;
      case 'divide': card.value /= +payload.value; break;
    }


    let a = state.miniCards.map(x => +x.value);
    let b = a.reduce((a, b) => a + b);
    state.totalSum = b;

    return state;
  },
  handleCardAdding(state, payload) {
    const prevItems = [...state.miniCards];
    if (prevItems.length === 0) {
      const newItems = [{
        value: payload,
        id: 1,
        input: 2
      }];
      state.miniCards = newItems;
    }
    else {
      const newItems = [...prevItems,
      {
        value: payload,
        id: prevItems[prevItems.length - 1].id + 1,
        input: 2
      }];
      state.miniCards = newItems;
    }
    return state;
  },
  handleButtonNum(state, payload) {
    const card = state.miniCards.filter(card => card.id === +payload.id)[0];
    card.input = +payload.value;
    return state;
  },
  handleCardReset(state, payload) {
    const card = state.miniCards.filter(card => card.id === +payload)[0];
    card.value = 0;

    let a = state.miniCards.map(x => +x.value);
    if (a.length !== 0) {
      let b = a.reduce((a, b) => a + b);
      state.totalSum = b;
    }
    else {
      state.totalSum = 0;
    }
    return state;
  },
  handleCardDelete(state, payload) {
    const cards = state.miniCards.filter(card => card.id !== +payload);
    state.miniCards = cards;

    let a = state.miniCards.map(x => +x.value);
    if (a.length !== 0) {
      let b = a.reduce((a, b) => a + b);
      state.totalSum = b;
    }
    else {
      state.totalSum = 0;
    }
  }
}


const initialState = {
  miniCards: [
    { value: 2, id: 1, input: 2 },
    { value: 3, id: 2, input: 3 }
  ],
  totalSum: 5
}
//miniCards.map(x => +x.value).reduce((a, b) => a+b)


const storeInstance = new Store({
  actions, mutations, initialState
})

const nodes = {
  addLocal: $('#add-local'),
  totalSum: $('#total-sum'),
  localCards: $('#local-cards')
}
const { addLocal, totalSum, localCards } = nodes;

const cardMarkUp = (localSum, id, buttonNum) => `
  
  <div class="mini-card" data-id=${id}>
    <h6 class="mini-card-header">local sum = ${localSum}</h6>
    <div class="local-buttons">
      <button data-operator="+" class="plus">+</button>
      <button data-operator="-" class="minus">-</button>
      <button data-operator="*" data-value = ${buttonNum} class="times">x${buttonNum}</button>
      <button data-operator="/" data-value = ${buttonNum} class="divide">&divide;${buttonNum}</button>
    </div>

    <div class="num-cont">
      <input type="number" name="num" class = "num" value= ${buttonNum}>
    </div>

    <div class="actions">
      <button class="reset">reset</button>
      <button class="delete">delete</button>
    </div>
  </div>
 
`;


ace(addLocal, () => {
  storeInstance.dispatch('addLocalCard', 0);
})

ace(localCards, ({ target }) => {
  const parent = target.parentNode.parentNode;
  const id = parent.dataset.id;
  if (target.classList.contains('plus')) {
    storeInstance.dispatch('alterNumber', { id: id, value: 1, operation: 'add' })
  }
  else if (target.classList.contains('minus')) {
    storeInstance.dispatch('alterNumber', { id: id, value: 1, operation: 'minus' })
  }
  else if (target.classList.contains('times')) {
    let value = target.dataset.value;
    storeInstance.dispatch('alterNumber', { id: id, value: value, operation: 'times' })
  }
  else if (target.classList.contains('divide')) {
    let value = target.dataset.value;
    storeInstance.dispatch('alterNumber', { id: id, value: value, operation: 'divide' })
  }
  else if (target.classList.contains('delete')) {
    storeInstance.dispatch('deleteCard', id)
  }
  else if (target.classList.contains('reset')) {
    storeInstance.dispatch('resetCard', id)
  }
})

/* THERE IS A BUG HERE */
localCards.addEventListener('input', ({ target }) => {
  const id = target.parentNode.parentNode.dataset.id;
  const value = target.value;
  storeInstance.dispatch('changeButtonNum', { id: id, value: value })
})
localCards.addEventListener('change', ({ target }) => {
 
  const id = target.parentNode.parentNode.dataset.id;
  const value = target.value;
  storeInstance.dispatch('alterNumber', { id: id, value, operation: 'add' })
})

storeInstance.subscribe(state => {
  let temp = '';
  state.miniCards.map((item) => {
    temp += cardMarkUp(item.value, item.id, item.input);
  })
  localCards.innerHTML = temp;
  temp = '';

  totalSum.textContent = state.totalSum;


});


// ONLOAD STUFF TO BE REMOVED SOON
(function loadMarkup() {
  let temp = '';
  storeInstance.state.miniCards.map((item) => {
    temp += cardMarkUp(item.value, item.id, item.input);
  })
  localCards.innerHTML = temp;
  temp = '';
  totalSum.textContent = storeInstance.state.totalSum;
})();
