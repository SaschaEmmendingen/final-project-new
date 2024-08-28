// import { useParams } from 'react-router-dom';
// import { useState, useEffect } from 'react';
// import { FaStar, FaShoppingCart, FaCheckCircle } from 'react-icons/fa';
// import { useCart } from '../CartContext';

// const ProductDetail = () => {
//   const { productId } = useParams();
//   console.log('Product ID:', productId);
//   const [product, setProduct] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const { addToCart } = useCart();

//   useEffect(() => {
//     const fetchProduct = async () => {
//       try {
//         const response = await fetch(`http://localhost:1312/api/products/${productId}`);
//         if (!response.ok) {
//           throw new Error(`Network response was not ok: ${response.statusText}`);
//         }
//         const data = await response.json();
//         setProduct(data);
//       } catch (error) {
//         console.error('Fetching product failed:', error); // Füge dies hinzu, um mehr Details zu sehen
//         setError(error.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProduct();
//   }, [productId]);

//   if (loading) return <p>Loading...</p>;
//   if (error) return <p>Error: {error}</p>;
//   if (!product) return <p>Product not found</p>;

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-4">{product.name}</h1>
//       <img src={product.imageUrl} alt={product.name} className="w-full h-64 object-cover mb-4" />
//       <p className="text-lg font-medium mb-4">{product.price}</p>
//       <div className="flex items-center mb-4">
//         {Array.from({ length: product.rating }).map((_, i) => (
//           <FaStar key={i} className="text-yellow-500" />
//         ))}
//       </div>
//       <p className="text-gray-700 mb-4">{product.description}</p>
//       <button
//         onClick={() => addToCart(product)}
//         className="bg-blue-500 text-white px-4 py-2 rounded-lg"
//       >
//         <FaShoppingCart className="inline mr-2" /> Add to Cart
//       </button>
//     </div>
//   );
// };

// export default ProductDetail;

// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import { FaStar, FaShoppingCart } from 'react-icons/fa';
// import { useCart } from '../CartContext';

// const ProductDetail = () => {
//   const { productId } = useParams();  // Hole die Produkt-ID aus der URL
//   const [product, setProduct] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const { addToCart } = useCart();

//   useEffect(() => {
//     const fetchProduct = async () => {
//       try {
//         if (!productId) {
//           throw new Error('Product ID is missing');
//         }

//         const response = await fetch(`http://localhost:1312/api/products/${productId}`);
//         if (!response.ok) {
//           throw new Error(`Network response was not ok: ${response.statusText}`);
//         }

//         const data = await response.json();
//         setProduct(data);
//       } catch (error) {
//         console.error('Fetching product failed:', error);
//         setError(error.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProduct();
//   }, [productId]);

//   if (loading) return <p>Loading...</p>;
//   if (error) return <p>Error: {error}</p>;
//   if (!product) return <p>Product not found</p>;

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-4">{product.name}</h1>
//       <img src={product.imageUrl} alt={product.name} className="w-full h-64 object-cover mb-4" />
//       <p className="text-lg font-medium mb-4">${product.price.toFixed(2)}</p>
//       <div className="flex items-center mb-4">
//         {Array.from({ length: product.rating || 0 }).map((_, i) => (
//           <FaStar key={i} className="text-yellow-500" />
//         ))}
//       </div>
//       <p className="text-gray-700 mb-4">{product.description}</p>
//       <button
//         onClick={() => addToCart(product)}
//         className="bg-blue-500 text-white px-4 py-2 rounded-lg"
//       >
//         <FaShoppingCart className="inline mr-2" /> Add to Cart
//       </button>
//     </div>
//   );
// };

// export default ProductDetail;

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function ProductDetail() {
  const { id } = useParams(); // Holt die Produkt-ID aus der URL
  const [product, setProduct] = useState(null);

  useEffect(() => {
    // Holt die Produktdetails von der API
    fetch(`http://localhost:1312/api/products/${id}`)
      .then((response) => response.json())
      .then((data) => setProduct(data))
      .catch((error) => console.error('Fehler beim Laden des Produkts:', error));
  }, [id]);

  if (!product) {
    return <div>Loading...</div>; // Zeigt einen Ladeindikator an, bis die Daten geladen sind
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

      {/* Produktbild */}
      {product.imageUrl && (
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-auto object-cover mb-4"
        />
      )}

      {/* Produktbeschreibung */}
      <p className="mb-4">{product.description}</p>

      {/* Weitere Produktdetails */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">Preis</h2>
          <p>{product.price} €</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">Kategorie</h2>
          <p>{product.category}</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">auf Lager</h2>
          <p>{product.stock}</p>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;