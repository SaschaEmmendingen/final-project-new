import { useState, useRef, useEffect } from "react";
import {
  FaArrowLeft,
  FaArrowRight,
  FaShoppingCart,
  FaStar,
  FaCheckCircle,
} from "react-icons/fa";
import { useCart } from "../CartContext";
import FirstBanner from "../../banner/FirstBanner.jpg";
import SecondBanner from "../../banner/SecondBanner.jpg";
import ThirdBanner from "../../banner/ThirdBanner.jpg";
import FourthBanner from "../../banner/FourthBanner.jpg";
import FifthBanner from "../../banner/FifthBanner.jpg";
import SixthBanner from "../../banner/SeventhBanner.jpg";

const images = [
  FirstBanner,
  SecondBanner,
  ThirdBanner,
  FourthBanner,
  FifthBanner,
  SixthBanner,
];

const reviews = [
  {
    name: "Max Mustermann",
    timeAgo: "2 hours ago",
    rating: 5,
    comment: "Great product! Highly recommended.",
  },
  {
    name: "Anna Schmidt",
    timeAgo: "1 hour ago",
    rating: 4,
    comment: "Very good, but could be cheaper.",
  },
  {
    name: "John Doe",
    timeAgo: "30 minutes ago",
    rating: 5,
    comment: "Excellent quality and fast delivery.",
  },
  {
    name: "Maria Müller",
    timeAgo: "10 minutes ago",
    rating: 4,
    comment: "Satisfied with the purchase. Would buy again.",
  },
];

const Home = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [bestsellerIndex, setBestsellerIndex] = useState(0);
  const [reviewIndex, setReviewIndex] = useState(0);
  const [products, setProducts] = useState([]); // State for products
  const [loading, setLoading] = useState(true); // State for loading indicator
  const token = useState();

  const scrollRef = useRef(null);
  const reviewRef = useRef(null);
  const { addToCart } = useCart(); // Use cart context

  useEffect(() => {
    // Fetch products from the backend
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:1312/api/products");
        const data = await response.json();
        setProducts(data); // Set the fetched products to state
        setLoading(false); // Turn off loading indicator
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleNextBestseller = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
    setBestsellerIndex((prevIndex) =>
      prevIndex === products.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrevBestseller = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
    setBestsellerIndex((prevIndex) =>
      prevIndex === 0 ? products.length - 1 : prevIndex - 1
    );
  };

  const handleNextReview = () => {
    if (reviewRef.current) {
      reviewRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
    setReviewIndex((prevIndex) =>
      prevIndex === reviews.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrevReview = () => {
    if (reviewRef.current) {
      reviewRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
    setReviewIndex((prevIndex) =>
      prevIndex === 0 ? reviews.length - 1 : prevIndex - 1
    );
  };

  const handleAddToCart = (product, quantity) => {
    if (!token) {
      navigate("/login"); // Leite Benutzer zur Login-Seite weiter, wenn nicht angemeldet
      return;
    }
    addToCart({ ...product, quantity });
  };

  return (
    <div className="relative w-full md:w-[95%] lg:w-[95%] xl:w-[95%] mx-auto">
      <div className="relative h-[400px] md:h-[600px] lg:h-[700px] xl:h-[660px] w-[100%]">
        <img
          src={images[currentIndex]}
          alt={`Bild ${currentIndex + 1}`}
          className="w-[100%] h-[100%] object-cover object-center shadow-lg "
        />
        <button
          className="absolute top-1/2 left-4 transform -translate-y-1/2 text-lg text-black bg-white p-3 rounded-full shadow-md hover:bg-gray-200 z-10"
          onClick={handlePrev}
        >
          <FaArrowLeft />
        </button>

        <button
          className="absolute top-1/2 right-4 transform -translate-y-1/2 text-lg text-black bg-white p-3 rounded-full shadow-md hover:bg-gray-200 z-10"
          onClick={handleNext}
        >
          <FaArrowRight />
        </button>
      </div>

      <h2 className="text-2xl font-bold mt-4 mb-2 py-8 p-4">
        Empfohlene Produkte
      </h2>

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-2 md:gap-4">
          {products.map((product, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-lg shadow-md p-4"
              onMouseEnter={() => setHoveredProduct(index)}
              onMouseLeave={() => setHoveredProduct(null)}
            >
              <a href={`/products/${product._id}`}>
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-32 object-contain mb-4"
                />
              </a>
              <h3 className="text-lg font-semibold text-center">
                {product.name}
              </h3>
              <div className="flex items-center justify-center mb-2">
                {Array.from({ length: product.rating }).map((_, i) => (
                  <FaStar key={i} className="text-yellow-500" />
                ))}
              </div>
              <p className="text-md font-medium text-gray-700 text-center">
                {product.price}
              </p>
              <button
                onClick={() => handleAddToCart(product)}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 mx-auto block"
              >
                <FaShoppingCart className="inline mr-2" /> Kaufen
              </button>
            </div>
          ))}
        </div>
      )}

      <h2 className="text-2xl font-bold mt-4 mb-2 py-8 p-4">Bestseller</h2>
      <div className="relative py-1 p-4">
        <div
          className="flex overflow-x-auto space-x-4 scrollbar-hide"
          ref={scrollRef}
          style={{ maxWidth: "100%", overflowX: "hidden" }}
        >
          {products.map((bestseller, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-lg shadow-md flex-shrink-0 w-48"
            >
              <a href={`/products/${bestseller._id}`}>
                <img
                  src={bestseller.imageUrl}
                  alt={bestseller.name}
                  className="w-full h-32 object-contain mb-4"
                />
              </a>
              <h3 className="text-lg font-semibold text-center">
                {bestseller.name}
              </h3>
              <div className="flex items-center justify-center mb-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <FaStar key={i} className="text-yellow-500" />
                ))}
              </div>
              <p className="text-md font-medium text-gray-700 text-center">
                {bestseller.price}
              </p>
            </div>
          ))}
        </div>
        <button
          className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-gray-200 z-10"
          onClick={handlePrevBestseller}
        >
          <FaArrowLeft />
        </button>
        <button
          className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-gray-200 z-10"
          onClick={handleNextBestseller}
        >
          <FaArrowRight />
        </button>
      </div>

      <h2 className="text-2xl font-bold mt-4 mb-2 py-8 p-4">
        Neueste Bewertungen
      </h2>
      <div className="relative py-1 p-4">
        <div
          className="flex overflow-x-auto space-x-4 scrollbar-hide"
          ref={reviewRef}
          style={{ maxWidth: "100%", overflowX: "hidden" }}
        >
          {reviews.map((review, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-lg shadow-md flex-shrink-0 w-64"
            >
              <div className="flex items-center mb-2">
                <FaCheckCircle className="text-green-500 mr-2" />
                <h3 className="text-md font-semibold">{review.name}</h3>
              </div>
              <p className="text-sm text-gray-500">{review.timeAgo}</p>
              <div className="flex items-center mt-2 mb-4">
                {Array.from({ length: review.rating }).map((_, i) => (
                  <FaStar key={i} className="text-yellow-500" />
                ))}
              </div>
              <p className="text-md text-gray-700">{review.comment}</p>
            </div>
          ))}
        </div>
        <button
          className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-gray-200 z-10"
          onClick={handlePrevReview}
        >
          <FaArrowLeft />
        </button>
        <button
          className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-gray-200 z-10"
          onClick={handleNextReview}
        >
          <FaArrowRight />
        </button>
      </div>
    </div>
  );
};

export default Home;
