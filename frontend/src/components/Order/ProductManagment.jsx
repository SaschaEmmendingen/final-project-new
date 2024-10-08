import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ProductManagement = () => {
  const navigate = useNavigate(); // Initialisiere useNavigate
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState("");
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    imageUrl: "",
  });
  const [editingProduct, setEditingProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:1312/api/products");
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

  const handleEditChange = (e) => {
    setEditingProduct({ ...editingProduct, [e.target.name]: e.target.value });
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
        imageUrl: "",
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

  const handleEditClick = (product) => {
    setEditingProduct(product); // Setze das Produkt als zu bearbeitendes Produkt
    setIsModalOpen(true); // Öffne das Modal
  };

  const handleUpdateProduct = async () => {
    try {
      await axios.put(
        `http://localhost:1312/api/products/${editingProduct._id}`,
        editingProduct
      );
      fetchProducts(); // Aktualisiere die Produktliste
      setIsModalOpen(false); // Schließe das Modal
      setEditingProduct(null); // Leere das editierte Produkt
    } catch (error) {
      console.error("Fehler beim Aktualisieren des Produkts:", error);
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

  return (
    <div>
      <h1
        className="text-2xl font-bold mb-4 text-gray-400"
        style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.6)" }}
      >
        Produktverwaltung
      </h1>

      {/* Kategorien als Tabs */}
      <div className="mb-4">
        {Object.keys(groupedProducts).map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`mr-4 py-2 px-4 rounded ${
              activeCategory === category
                ? "bg-stone-800 text-gray-400"
                : "bg-gray-400"
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
              className="flex flex-col justify-between p-4 rounded-lg shadow-lg border-0"
              style={{ background: "linear-gradient(#78716c, white 10%)" }}
            >
              <div>
                <h5
                  className="text-lg font-bold mb-2 cursor-pointer hover:underline"
                  onClick={() => navigate(`/products/${product._id}`)} // Navigiere zur Produktdetailseite
                >
                  {product.name}
                </h5>
                <p className="text-gray-600">{product.price}€</p>
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-32 h-32 object-cover my-2 cursor-pointer"
                  onClick={() => navigate(`/products/${product._id}`)} // Navigiere zur Produktdetailseite
                />
              </div>
              <div className="flex justify-between mt-2">
                <button
                  onClick={() => handleEditClick(product)} // Bearbeitungsmodal öffnen
                  className="bg-yellow-500 text-yellow-700 py-1 px-2 rounded mr-2 hover:bg-yellow-600"
                >
                  Bearbeiten
                </button>
                <button
                  onClick={() => handleDeleteProduct(product._id)}
                  className="bg-red-600 text-red-200 py-1 px-2 rounded hover:bg-red-900"
                >
                  Löschen
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal für Produktbearbeitung */}
      {isModalOpen && editingProduct && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center">
          <div className="bg-white mt-32 p-8 rounded-lg shadow-lg w-1/2">
            <h2 className="text-xl font-bold mb-4">Produkt bearbeiten</h2>

            {/* Name */}
            <label
              htmlFor="name"
              className="block text-gray-700 font-medium mb-2"
            >
              Name:
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={editingProduct.name}
              onChange={handleEditChange}
              className="w-full p-2 mb-4 border border-gray-300 rounded-md"
            />

            {/* Beschreibung */}
            <label
              htmlFor="description"
              className="block text-gray-700 font-medium mb-2"
            >
              Beschreibung:
            </label>
            <input
              type="text"
              id="description"
              name="description"
              value={editingProduct.description}
              onChange={handleEditChange}
              className="w-full p-2 mb-4 border border-gray-300 rounded-md"
            />

            {/* Preis */}
            <label
              htmlFor="price"
              className="block text-gray-700 font-medium mb-2"
            >
              Preis (€):
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={editingProduct.price}
              onChange={handleEditChange}
              className="w-full p-2 mb-4 border border-gray-300 rounded-md"
            />

            {/* Kategorie */}
            <label
              htmlFor="category"
              className="block text-gray-700 font-medium mb-2"
            >
              Kategorie:
            </label>
            <input
              type="text"
              id="category"
              name="category"
              value={editingProduct.category}
              onChange={handleEditChange}
              className="w-full p-2 mb-4 border border-gray-300 rounded-md"
            />

            {/* Lagerbestand */}
            <label
              htmlFor="stock"
              className="block text-gray-700 font-medium mb-2"
            >
              Lagerbestand:
            </label>
            <input
              type="number"
              id="stock"
              name="stock"
              value={editingProduct.stock}
              onChange={handleEditChange}
              className="w-full p-2 mb-4 border border-gray-300 rounded-md"
            />

            {/* Bild-URL */}
            <label
              htmlFor="imageUrl"
              className="block text-gray-700 font-medium mb-2"
            >
              Bild-URL:
            </label>
            <input
              type="text"
              id="imageUrl"
              name="imageUrl"
              value={editingProduct.imageUrl}
              onChange={handleEditChange}
              className="w-full p-2 mb-4 border border-gray-300 rounded-md"
            />

            {/* Buttons */}
            <div className="flex justify-end">
              <button
                onClick={handleUpdateProduct}
                className="bg-green-500 text-green-100 py-2 px-4 rounded hover:bg-green-700"
              >
                Speichern
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="ml-2 bg-gray-500 text-gray-100 py-2 px-4 rounded hover:bg-gray-700"
              >
                Abbrechen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;
