import React, { useEffect, useState } from "react";
import axios from "axios";

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
  });
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:1312/api/products");
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleChange = (e) => {
    setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
  };

  const handleAddProduct = async () => {
    try {
      await axios.post("http://localhost:1312/api/products", newProduct);
      fetchProducts();
      setNewProduct({
        name: "",
        description: "",
        price: "",
        category: "",
        stock: "",
      });
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await axios.delete(`http://localhost:1312/api/products/${id}`);
      setProducts(products.filter((product) => product._id !== id));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleEditProduct = async (product) => {
    try {
      const response = await axios.put(`http://localhost:1312/api/products/${product._id}`, product);
      setProducts(products.map((p) => (p._id === product._id ? response.data : p)));
      setEditingProduct(null); // Schließt das Bearbeitungsformular
    } catch (error) {
      console.error("Error editing product:", error);
    }
  };

  return (
    <div>
      <h3 className="text-xl font-bold mb-4 border border-pink-400">Produktverwaltung</h3>
      {editingProduct ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleEditProduct(editingProduct);
          }}
        >
          <input
            type="text"
            value={editingProduct.name}
            onChange={(e) =>
              setEditingProduct({ ...editingProduct, name: e.target.value })
            }
            placeholder="Produktname"
            className="border p-2 mb-2 w-full border-pink-400"
          />
          <input
            type="text"
            value={editingProduct.description}
            onChange={(e) =>
              setEditingProduct({ ...editingProduct, description: e.target.value })
            }
            placeholder="Beschreibung"
            className="border p-2 mb-2 w-full border-pink-400"
          />
          <input
            type="number"
            value={editingProduct.price}
            onChange={(e) =>
              setEditingProduct({ ...editingProduct, price: e.target.value })
            }
            placeholder="Preis"
            className="border p-2 mb-2 w-full border-pink-400"
          />
          <input
            type="text"
            value={editingProduct.category}
            onChange={(e) =>
              setEditingProduct({ ...editingProduct, category: e.target.value })
            }
            placeholder="Kategorie"
            className="border p-2 mb-2 w-full border-pink-400"
          /><input
          type="number"
          value={editingProduct.stock}
          onChange={(e) =>
            setEditingProduct({ ...editingProduct, stock: e.target.value })
          }
          placeholder="Lagerbestand"
          className="border p-2 mb-2 w-full border-pink-400"
        />
          <button
            type="submit"
            className="bg-green-500 text-white py-2 px-4 rounded"
          >
            Speichern
          </button>
        </form>
      ) : (
        <div>
          <h4 className="font-bold mb-2">Neues Produkt hinzufügen:</h4>
          <input
            type="text"
            name="name"
            placeholder="Produktname"
            value={newProduct.name}
            onChange={handleChange}
            className="border p-2 mb-2 w-full border-pink-400"
          />
          <input
            type="text"
            name="description"
            placeholder="Produktbeschreibung"
            value={newProduct.description}
            onChange={handleChange}
            className="border p-2 mb-2 w-full border-pink-400"
          />
          <input
            type="number"
            name="price"
            placeholder="Preis"
            value={newProduct.price}
            onChange={handleChange}
            className="border p-2 mb-2 w-full border-pink-400"
          />
          <input
            type="text"
            name="category"
            placeholder="Kategorie"
            value={newProduct.category}
            onChange={handleChange}
            className="border p-2 mb-2 w-full border-pink-400"
          />
          <input
            type="number"
            name="stock"
            placeholder="Lagerbestand"
            value={newProduct.stock}
            onChange={handleChange}
            className="border p-2 mb-2 w-full border-pink-400"
          />
          <button
            onClick={handleAddProduct}
            className="bg-green-500 text-white py-2 px-4 rounded"
          >
            Produkt hinzufügen
          </button>
        </div>
      )}
      <div className="mt-8">
        <h4 className="font-bold mb-2">Produktliste:</h4>
        <ul>
          {products.map((product) => (
            <li key={product._id} className="border p-2 mb-2 border-pink-400">
              {product.name} - {product.price}€
              <button
                onClick={() => setEditingProduct(product)}
                className="bg-yellow-500 text-white ml-4 px-2 py-1 rounded"
              >
                Bearbeiten
              </button>
              <button
                onClick={() => handleDeleteProduct(product._id)}
                className="bg-red-500 text-white ml-4 px-2 py-1 rounded"
              >
                Löschen
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ProductManagement;