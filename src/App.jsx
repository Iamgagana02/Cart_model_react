import React, { useReducer } from 'react';
import './App.css'

const initialState = {
  cart: [],
  stock: [
    { id: 1, name: 'Apple', price: 1, availableStock: 10 },
    { id: 2, name: 'Banana', price: 0.5, availableStock: 5 },
    { id: 3, name: 'Orange', price: 0.75, availableStock: 8 } 
  ]
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM':
      const itemIndex = state.cart.findIndex(item => item.id === action.payload.id);
    
      const updatedCart = [...state.cart];
    
      if (itemIndex >= 0) {
        const item = updatedCart[itemIndex];
        if (item.quantity < action.payload.availableStock) {
          updatedCart[itemIndex] = { ...item, quantity: item.quantity + 1 };
        }
      } 
      else {
        if (action.payload.availableStock > 0) {
          return { ...state, cart: [...state.cart, { ...action.payload, quantity: 1 }] };
        }
      }
    
      return { ...state, cart: updatedCart };
    
      

    case 'REMOVE_ITEM':
      return {
        ...state,cart: state.cart.filter(item => item.id !== action.payload.id),
      };

    case 'INCREMENT_ITEM':
      return {
        ...state,cart: state.cart.map(item => {
          if (item.id === action.payload.id) {
            const newQuantity = item.quantity + 1;
            if (newQuantity <= action.payload.availableStock) {
              return { ...item, quantity: newQuantity };
            }
          }
        }),
      };

    case 'DECREMENT_ITEM':
      return {
        ...state,
        cart: state.cart.map(item => 
          item.id === action.payload.id && item.quantity > 1 
            ? { ...item, quantity: item.quantity - 1 } 
            : item
        ),
      };

    case 'CLEAR_CART':
      return {
        ...state,
        cart: [],
      };

    default:
      return state;
  }
};

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const addItemToCart = (product_object) => {
    dispatch({ type: 'ADD_ITEM', payload: product_object });
  };

  const removeItemFromCart = (itemId) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { id: itemId } });
  };

  const incrementItem = (itemId) => {
    const item = state.stock.find(stockItem => stockItem.id === itemId);
    dispatch({ type: 'INCREMENT_ITEM', payload: item });
  };

  const decrementItem = (itemId) => {
    dispatch({ type: 'DECREMENT_ITEM', payload: { id: itemId } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  return (
    <div className='container'>
      <h1>Shopping Cart</h1>
      <div>
        <h2>Available Products</h2>
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {state.stock.map((i) => (
              <tr key={i.id}>
                <td>{i.name}</td>
                <td>${i.price}</td>
                <td>{i.availableStock}</td>
                <td>
                  <button onClick={() => addItemToCart(i)}>Add to Cart</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>Cart Items</h2>
      {state.cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <ul>
          {state.cart.map(item => (
            <li key={item.id}>
              {item.name} - ${item.price.toFixed(2)} x {item.quantity}
              <button onClick={() => incrementItem(item.id)}>+</button>
              <button onClick={() => decrementItem(item.id)}>-</button>
              <button onClick={() => removeItemFromCart(item.id)}>Remove</button>
            </li>
          ))}
        </ul>
      )}
      <button className='clear-cart' onClick={clearCart}>Clear Cart</button>
    </div>
  );
}

export default App;
