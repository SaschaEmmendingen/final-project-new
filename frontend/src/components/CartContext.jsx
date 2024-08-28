import React, { createContext, useReducer } from "react";

// CartContext erstellen
export const CartContext = createContext();

// Initialzustand für den Warenkorb
const initialState = {
  cartItems: [],
};

// Reducer-Funktion zum Verwalten der Warenkorbaktionen
const cartReducer = (state, action) => {
  console.log("Reducer action:", action);
  switch (action.type) {
    case "ADD_TO_CART": {
      console.log("State before add:", state);
      const existingItemIndex = state.cartItems.findIndex(
        (item) => item.productId === action.payload.productId
      );
      console.log("Existing item index:", existingItemIndex);

      if (existingItemIndex !== -1) {
        // Artikel ist bereits im Warenkorb, erhöhe die Menge
        const updatedCartItems = state.cartItems.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        );
        console.log("Updated cart items:", updatedCartItems);
        return {
          ...state,
          cartItems: updatedCartItems,
        };
      } else {
        // Füge neuen Artikel zum Warenkorb hinzu
        const newCartItems = [...state.cartItems, action.payload];
        console.log("New cart item added:", action.payload);
        console.log("Cart items after addition:", newCartItems);
        return {
          ...state,
          cartItems: newCartItems,
        };
      }
    }
    case "REMOVE_FROM_CART": {
      console.log("State before remove:", state);
      const filteredCartItems = state.cartItems.filter(
        (item) => item.productId !== action.payload.productId
      );
      console.log("Cart items after removal:", filteredCartItems);
      return {
        ...state,
        cartItems: filteredCartItems,
      };
    }
    case "CLEAR_CART": {
      console.log("Clearing cart");
      return {
        ...state,
        cartItems: [],
      };
    }
    default:
      return state;
  }
};

// CartProvider-Komponente
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const addToCart = (item) => {
    console.log("Adding item to cart:", item);
    dispatch({
      type: "ADD_TO_CART",
      payload: {
        ...item,
        quantity: item.quantity || 1,
      },
    });
  };

  const removeFromCart = (item) => {
    console.log("Removing item from cart:", item);
    dispatch({ type: "REMOVE_FROM_CART", payload: item });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  return (
    <CartContext.Provider
      value={{ cartItems: state.cartItems, addToCart, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Custom Hook zum Verwenden des CartContext
export const useCart = () => {
  const context = React.useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};