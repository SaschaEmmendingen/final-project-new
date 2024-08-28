/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { createContext, useReducer } from "react";

// CartContext erstellen
export const CartContext = createContext();

// Initialzustand für den Warenkorb
const initialState = {
    cartItems: [],
};

// Reducer-Funktion zum Verwalten der Warenkorbaktionen
const cartReducer = (state, action) => {
    switch (action.type) {
        case "ADD_TO_CART":
            return {
                ...state,
                cartItems: [...state.cartItems, action.payload],
            };
        case "REMOVE_FROM_CART":
            return {
                ...state,
                cartItems: state.cartItems.filter(
                    (item) => item.name !== action.payload.name
                ),
            };
        default:
            return state;
    }
};

// CartProvider-Komponente
export const CartProvider = ({ children }) => {
    const [state, dispatch] = useReducer(cartReducer, initialState);

    const addToCart = (item) => {
        dispatch({ type: "ADD_TO_CART", payload: item });
    };

    const removeFromCart = (item) => {
        dispatch({ type: "REMOVE_FROM_CART", payload: item });
    };

    return (
        <CartContext.Provider
            value={{ cartItems: state.cartItems, addToCart, removeFromCart }}
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
