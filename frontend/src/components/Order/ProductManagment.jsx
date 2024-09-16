import React, { useEffect, useState } from "react";
import axios from "axios";

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState(""); // Kategorie-Reiter
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    imageUrl: "", // Hinzugefügtes Feld für das Bild
  });
  const [editingProduct, setEditingProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:1312/api/products");

      // Setze die erste Kategorie als aktive Kategorie
      const sortedProducts = response.data.sort((a, b) =>
        a.category.localeCompare(b.category)
      );
      setProducts(sortedProducts);
      setActiveCategory(sortedProducts[0]?.category || "");
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleChange = (e) => {
    setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
  };

  const handleAddProduct = async () => {
    try {
      if (
        !newProduct.name ||
        !newProduct.description ||
        !newProduct.price ||
        !newProduct.category ||
        !newProduct.stock ||
        !newProduct.imageUrl
      ) {
        console.error("Alle Felder müssen ausgefüllt werden.");
        return;
      }

      await axios.post("http://localhost:1312/api/products", newProduct);
      fetchProducts();
      setNewProduct({
        name: "",
        description: "",
        price: "",
        category: "",
        stock: "",
        imageUrl: "", // Leert das Bildfeld nach dem Hinzufügen
      });
    } catch (error) {
      console.error("Fehler beim Hinzufügen des Produkts:", error);
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

  const handleEditProduct = async () => {
    try {
      const response = await axios.put(
        `http://localhost:1312/api/products/${editingProduct._id}`,
        editingProduct
      );
      setProducts(
        products.map((p) =>
          p._id === editingProduct._id ? response.data : p
        )
      );
      setEditingProduct(null); // Schließt das Bearbeitungsformular
      setIsModalOpen(false); // Schließt das Modal
    } catch (error) {
      console.error("Error editing product:", error);
    }
  };

  const groupProductsByCategory = (products) => {
    return products.reduce((grouped, product) => {
      const category = product.category;
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(product);
      return grouped;
    }, {});
  };

  const groupedProducts = groupProductsByCategory(products);

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true); // Öffnet das Modal
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingProduct(null); // Schließt das Modal und setzt das bearbeitete Produkt zurück
  };

  return (
    <div>
      <h3 className="text-xl font-bold mb-4 border border-pink-400">
        Produktverwaltung
      </h3>

      {/* Kategorien als Tabs */}
      <div className="mb-4">
        {Object.keys(groupedProducts).map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`mr-4 py-2 px-4 rounded ${
              activeCategory === category
                ? "bg-blue-500 text-white"
                : "bg-gray-200"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="mt-8">
        <h4 className="font-bold mb-4">{activeCategory} Produkte:</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {groupedProducts[activeCategory]?.map((product) => (
            <div
              key={product._id}
              className="border p-4 rounded-lg shadow-lg border-pink-400"
            >
              <h5 className="text-lg font-bold mb-2">{product.name}</h5>
              <p className="text-gray-600">{product.price}€</p>
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-32 h-32 object-cover my-2"
              />
              <div className="flex justify-between mt-2">
                <button
                  onClick={() => handleEditClick(product)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded"
                >
                  Bearbeiten
                </button>
                <button
                  onClick={() => handleDeleteProduct(product._id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Löschen
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal für Produktbearbeitung */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg shadow-lg w-1/2">
            <h2 className="text-xl font-bold mb-4">Produkt bearbeiten</h2>
            <div className="mb-4">
              <label className="block text-gray-700">Name:</label>
              <input
                type="text"
                name="name"
                value={editingProduct?.name || ""}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    name: e.target.value,
                  })
                }
                className="border rounded w-full py-2 px-3"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Beschreibung:</label>
              <input
                type="text"
                name="description"
                value={editingProduct?.description || ""}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    description: e.target.value,
                  })
                }
                className="border rounded w-full py-2 px-3"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Preis:</label>
              <input
                type="number"
                name="price"
                value={editingProduct?.price || ""}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    price: e.target.value,
                  })
                }
                className="border rounded w-full py-2 px-3"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Kategorie:</label>
              <input
                type="text"
                name="category"
                value={editingProduct?.category || ""}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    category: e.target.value,
                  })
                }
                className="border rounded w-full py-2 px-3"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Lagerbestand:</label>
              <input
                type="number"
                name="stock"
                value={editingProduct?.stock || ""}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    stock: e.target.value,
                  })
                }
                className="border rounded w-full py-2 px-3"
              />
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleModalClose}
                className="bg-gray-500 text-white px-4 py-2 rounded mr-4"
              >
                Abbrechen
              </button>
              <button
                onClick={handleEditProduct}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Speichern
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;