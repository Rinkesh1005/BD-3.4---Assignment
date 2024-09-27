const express = require('express');
const { resolve } = require('path');
let cors = require('cors');

const app = express();
const port = 3000;

app.use(express.static('static'));
app.use(cors());

let carts = [
  { productId: 1, name: 'Laptop', price: 50000, quantity: 1 },
  { productId: 2, name: 'Mobile', price: 20000, quantity: 2 },
];

function addCartItems(cart, productId, name, price, quantity) {
  let existingItem = cart.find((item) => item.productId === productId);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({
      productId: productId,
      name: name,
      price: price,
      quantity: quantity,
    });
  }
  return cart;
}

app.get('/cart/add', (req, res) => {
  let productId = parseInt(req.query.productId);
  let name = req.query.name;
  let price = parseFloat(req.query.price);
  let quantity = parseInt(req.query.quantity);
  let cart = addCartItems(carts, productId, name, price, quantity);
  res.json({ cartItems: cart });
});

function updateQuantityOfItem(cart, productId, quantity) {
  for (let i = 0; i < cart.length; i++) {
    if (cart[i].productId === productId) {
      cart[i].quantity = quantity;
    }
  }
  return cart;
}

app.get('/cart/edit', (req, res) => {
  let productId = parseInt(req.query.productId);
  let quantity = parseInt(req.query.quantity);
  let cart = updateQuantityOfItem(carts, productId, quantity);
  res.json({ cartItems: cart });
});

function deleteCartItem(cartArrItem, productId) {
  return cartArrItem.productId !== productId;
}

app.get('/cart/delete', (req, res) => {
  let productId = parseInt(req.query.productId);
  carts = carts.filter((cartItem) => deleteCartItem(cartItem, productId));
  res.json({ cartItems: carts });
});

app.get('/cart', (req, res) => {
  res.json({ cartItems: carts });
});

function calculateTotalQuantity(cart) {
  let totalQuantity = 0;
  for (let i = 0; i < cart.length; i++) {
    totalQuantity = totalQuantity + cart[i].quantity;
  }
  return totalQuantity;
}

app.get('/cart/total-quantity', (req, res) => {
  const totalQuantity = calculateTotalQuantity(carts);
  res.json({ totalQuantity });
});

function calculateTotalPrice(cart) {
  let totalPrice = 0;
  for (let i = 0; i < cart.length; i++) {
    totalPrice = totalPrice + cart[i].price * cart[i].quantity;
  }
  return totalPrice;
}

app.get('/cart/total-price', (req, res) => {
  const totalPrice = calculateTotalPrice(carts);
  res.json({ totalPrice: totalPrice });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
