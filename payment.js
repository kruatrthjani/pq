// payment.js

require('dotenv').config();
console.log(process.env.STRIPE_PUBLIC_KEY);
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const elements = stripe.elements();
const cardElement = elements.create('card');

cardElement.mount('#card-element');

const form = document.getElementById('payment-form');
form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const { token, error } = await stripe.createToken(cardElement);

  if (error) {
    const errorElement = document.getElementById('card-errors');
    errorElement.textContent = error.message;
  } else {
    const hiddenInput = document.createElement('input');
    hiddenInput.setAttribute('type', 'hidden');
    hiddenInput.setAttribute('name', 'token');
    hiddenInput.setAttribute('value', token.id);

    form.appendChild(hiddenInput);
    form.submit();
  }
});
