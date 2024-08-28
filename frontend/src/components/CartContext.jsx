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
    console.log('Reducer action:', action);
    switch (action.type) {
        case "ADD_TO_CART": {
            console.log('State before add:', state);
            const existingItemIndex = state.cartItems.findIndex(item => item.productId === action.payload.productId);
            console.log('Existing item index:', existingItemIndex);

            if (existingItemIndex !== -1) {
                const updatedCartItems = state.cartItems.map((item, index) =>
                    index === existingItemIndex
                        ? { ...item, quantity: (item.quantity || 0) + (action.payload.quantity || 1) }
                        : item
                );
                console.log('State after update:', { ...state, cartItems: updatedCartItems });
                return {
                    ...state,
                    cartItems: updatedCartItems,
                };
            } else {
                console.log('State after addition:', { ...state, cartItems: [...state.cartItems, action.payload] });
                return {
                    ...state,
                    cartItems: [...state.cartItems, action.payload],
                };
            }
        }
        case "REMOVE_FROM_CART": {
            console.log('State before remove:', state);
            console.log('State after remove:', { ...state, cartItems: state.cartItems.filter((item) => item.productId !== action.payload.productId) });
            return {
                ...state,
                cartItems: state.cartItems.filter(
                    (item) => item.productId !== action.payload.productId
                ),
            };
        }
        default:
            console.log('Unknown action type:', action.type);
            return state;
    }
};

// CartProvider-Komponente
export const CartProvider = ({ children }) => {
    const [state, dispatch] = useReducer(cartReducer, initialState);

    const addToCart = (item) => {
        console.log('Adding item to cart:', item);
        dispatch({
            type: "ADD_TO_CART",
            payload: {
                ...item,
                quantity: item.quantity || 1
            }
        });
    };

    const removeFromCart = (item) => {
        console.log('Removing item from cart:', item);
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