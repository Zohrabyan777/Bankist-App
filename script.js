'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2,
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', //
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};
alert(`Hi,
If you want to sign in please use this username and pin.
User: js
login :1111`);

const accounts = [account1, account2];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
/////////////////////////////////////////////////

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);
console.log(currencies);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////The functionality

///////////////////function which creats HTML
function creatHTML(data, index, displaydate) {
  const type = data > 0 ? 'deposit' : 'withdrawal';
  const html = `    
  <div class="movements__row">
  <div class="movements__type movements__type--${type}">${
    index + 1
  } ${type}</div>
  <div class="movements__date">${displaydate}</div>
  <div class="movements__value">${data}€</div>
</div>
  
`;

  containerMovements.insertAdjacentHTML('afterbegin', html);
}

////// Functuin culculates and prints current balance
const calcprintbalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  return (labelBalance.innerHTML = ` ${acc.balance.toFixed(2)} €`);
};
///////prints movements
const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';
  let movs = sort ? acc.movements.slice().sort((a, b) => a - b) : acc.movements;
  movs.forEach((mov, i) => {
    const date = new Date(acc.movementsDates[i]);

    const day = date.getDate();
    const month = `${date.getMonth() + 1}`.padStart(2, 0);
    const year = date.getFullYear();

    const displaydate = `  ${day < 10 ? '0' + day : day}/ ${month} /${year} `;
    creatHTML(mov, i, displaydate);
  });
};
////////to calculate the datas of footer
const calcDisplaySummery = function (acc) {
  const icoms = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, el) => {
      return acc + el;
    }, 0);
  labelSumIn.innerHTML = `${icoms.toFixed(2)}€`;
  const out = movements
    .filter(mov => mov < 0)
    .reduce((acc, el) => {
      return acc + el;
    }, 0);
  labelSumOut.innerHTML = `${Math.abs(out).toFixed(2)}€`;
  const interest = movements
    .filter(mov => mov > 0)
    .map(mov => {
      return (mov * acc.interestRate) / 100;
    })
    .filter(int => int > 1)
    .reduce((acc, int) => {
      return acc + int;
    }, 0);
  labelSumInterest.innerHTML = interest;
};

function createUsernames(accs) {
  accs.forEach(acc => {
    acc.username = acc.owner
      .split(' ')
      .map(el => el[0].toLowerCase())
      .join('');
  });
}

createUsernames(accounts);

function updateUI(acc) {
  displayMovements(acc);
  calcDisplaySummery(acc);
  calcprintbalance(acc);
}

let currentAccount;
let timer;
let countdown = function () {
  let time = 60;

  timer = setInterval(() => {
    let mins = String(Math.floor(time / 60)).padStart(2, 0);
    let sec = String(Math.floor(time % 60)).padStart(2, 0);
    labelTimer.innerHTML = `${mins}:${sec}`;
    time--;
    if (time === 0) {
      clearInterval(timer);

      containerApp.style.opacity = 0;
      labelWelcome.innerHTML = 'Log in to get   started';
    }
  }, 1000);
};

btnLogin.addEventListener('click', e => {
  e.preventDefault();
  currentAccount = accounts.find(
    val => val.username === inputLoginUsername.value
  );
  if (currentAccount?.pin === parseInt(inputLoginPin.value)) {
    labelWelcome.innerHTML = `Welcome back,  ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 1;
    const date = new Date();
    const day = date.getDate();
    const month = `${date.getMonth() + 1}`.padStart(2, 0);
    const year = date.getFullYear();
    const hour = date.getHours();
    const min = date.getMinutes();

    labelDate.innerHTML = `  ${
      day < 10 ? '0' + day : day
    }/ ${month} /${year} ,${hour}:${min}`;

    inputLoginUsername.value = inputLoginPin.value = '';

    updateUI(currentAccount);
    countdown();
  }
});
btnTransfer.addEventListener('click', e => {
  e.preventDefault();
  let amount = parseInt(inputTransferAmount.value);
  let recievedAccount = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';
  if (
    amount > 0 &&
    recievedAccount &&
    amount <= currentAccount.balance &&
    recievedAccount !== currentAccount
  ) {
    recievedAccount.movements.push(amount);
    recievedAccount.movementsDates.push(new Date());
    currentAccount.movements.push(-amount);
    currentAccount.movementsDates.push(new Date());
    updateUI(currentAccount);
  } else {
    console.log('something went wrong');
  }
  clearInterval(timer);
  countdown();
});
btnClose.addEventListener('click', e => {
  e.preventDefault();
  clearInterval(timer);
  countdown();
  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    let index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    accounts.splice(index, 1);

    console.log(accounts);
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
  labelWelcome.innerHTML = 'Log in to get   started';
});
btnLoan.addEventListener('click', e => {
  e.preventDefault();
  clearInterval(timer);
  countdown();
  const amount = Math.floor(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    currentAccount.movements.push(amount);
    currentAccount.movementsDates.push(new Date());
  }
  updateUI(currentAccount);
  inputLoanAmount.value = '';
});

///flat() method
const accountMovements = accounts
  .map(acc => acc.movements)
  .flat()
  .reduce((acc, el) => {
    return acc + el;
  }, 0);
console.log(accountMovements);

//sorting movements
let sorted = false;
btnSort.addEventListener('click', e => {
  e.preventDefault();
  clearInterval(timer);
  countdown();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});
