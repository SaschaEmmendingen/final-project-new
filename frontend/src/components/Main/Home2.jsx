// import { useState, useRef } from "react";
// import { FaArrowLeft, FaArrowRight, FaShoppingCart, FaStar, FaCheckCircle } from "react-icons/fa";
// // import { useCart } from "../components/CartContext"; // Importiere useCart für den Warenkorb (separate componente für den Warenkorb)
// import { useCart } from "../CartContext";

// // Importiere die Bilder für die Produkte und Bestseller (bitte später outsorcen)
// import ryzenProductImage from "../../media/ryzen.webp";
// // import ryzenProductImage from "../../media/ryzen.webp"
// import UbiquiutiProductImage from "../../media/Ubiquiuti.webp";
// import AsusPrimeProductImage from "../../media/AsusPrime.webp";
// import Huami_GTR_PRO_ProductImage from "../../media/Huami_GTR_Pro.webp";
// import Xiaomi_TV_Box_S2nd_Gen from "../../media/Xiaomi TV Box S 2nd Gen.webp";
// import Xiaomi_Redmi_12_4GB_128GB_midnight_black from "../../media/Xiaomi Redmi 12 4GB 128GB midnight black.webp";

// import FirstBanner from "../../banner/FirstBanner.jpg";
// import SecondBanner from "../../banner/SecondBanner.jpg";
// import ThirdBanner from "../../banner/ThirdBanner.jpg";
// import FourthBanner from "../../banner/FourthBanner.jpg";
// import FifthBanner from "../../banner/FifthBanner.jpg";
// import SixthBanner from "../../banner/SeventhBanner.jpg";

// import firstBestseller from "../../Bestseller/firstBestseller.webp";
// import secondBestseller from "../../Bestseller/secondBestseller.webp";
// import thirdBestseller from "../../Bestseller/thirdBestseller.webp";
// import fourthBestseller from "../../Bestseller/fourthBestseller.webp";
// import fifthBestseller from "../../Bestseller/fifthBestseller.webp";
// import sixthBestseller from "../../Bestseller/sixthBestseller.webp";
// import seventhBestseller from "../../Bestseller/seventhBestseller.webp";
// import eigthBestseller from "../../Bestseller/eigthBestseller.webp";
// import ninethBestseller from "../../Bestseller/ninethBestseller.webp";
// import tenBestseller from "../../Bestseller/tenBestseller.webp";

// // Sternebewertungen für empfohlene Produkte
// const productRatings = [5, 4, 4, 3, 5, 4]; // Beispielbewertungen für die Produkte

// const images = [
//     FirstBanner,
//     SecondBanner,
//     ThirdBanner,
//     FourthBanner,
//     FifthBanner,
//     SixthBanner,
// ];

// const products = [
//     {
//         name: "Ubiquiti U6+ (PLUS)",
//         price: "101,90 €",
//         image: UbiquiutiProductImage,
//     },
//     {
//         name: "ASUS PRIME B660-PLUS DDR4",
//         price: "101,90 €",
//         image: AsusPrimeProductImage,
//     },
//     {
//         name: "Xiaomi Redmi 12",
//         price: "106,90 €",
//         image: Xiaomi_Redmi_12_4GB_128GB_midnight_black,
//     },
//     {
//         name: "Xiaomi TV Box S 2nd Gen",
//         price: "47,90 €",
//         image: Xiaomi_TV_Box_S2nd_Gen,
//     },
//     {
//         name: "AMD Ryzen 7 5800X3D",
//         price: "302,90 €",
//         image: ryzenProductImage,
//     },
//     {
//         name: "Huami GTR 3 Pro GPS",
//         price: "134,90 €",
//         image: Huami_GTR_PRO_ProductImage,
//     },
// ];

// const bestsellers = [
//     {
//         name: "Samsung Galaxy S21",
//         price: "899,90 €",
//         image: firstBestseller,
//     },
//     {
//         name: "Apple MacBook Pro",
//         price: "2199,90 €",
//         image: secondBestseller,
//     },
//     {
//         name: "Sony WH-1000XM4",
//         price: "299,90 €",
//         image: thirdBestseller,
//     },
//     {
//         name: "Dyson V11 Absolute",
//         price: "649,90 €",
//         image: fourthBestseller,
//     },
//     {
//         name: "GoPro HERO9",
//         price: "429,90 €",
//         image: fifthBestseller,
//     },
//     {
//         name: "Nintendo Switch",
//         price: "329,90 €",
//         image: sixthBestseller,
//     },
//     {
//         name: "Dell XPS 13",
//         price: "1499,90 €",
//         image: seventhBestseller,
//     },
//     {
//         name: "Bose QuietComfort 35 II",
//         price: "299,90 €",
//         image: eigthBestseller,
//     },
//     {
//         name: "Apple iPad Pro",
//         price: "1199,90 €",
//         image: ninethBestseller,
//     },
//     {
//         name: "Fitbit Versa 3",
//         price: "229,90 €",
//         image: tenBestseller,
//     },
// ];

// const reviews = [
//     {
//         name: "Max Mustermann",
//         timeAgo: "2 hours ago",
//         rating: 5,
//         comment: "Great product! Highly recommended.",
//     },
//     {
//         name: "Anna Schmidt",
//         timeAgo: "1 hour ago",
//         rating: 4,
//         comment: "Very good, but could be cheaper.",
//     },
//     {
//         name: "John Doe",
//         timeAgo: "30 minutes ago",
//         rating: 5,
//         comment: "Excellent quality and fast delivery.",
//     },
//     {
//         name: "Maria Müller",
//         timeAgo: "10 minutes ago",
//         rating: 4,
//         comment: "Satisfied with the purchase. Would buy again.",
//     },
// ];

// const Home = () => {
//     const [currentIndex, setCurrentIndex] = useState(0);
//     const [hoveredProduct, setHoveredProduct] = useState(null);
//     const [bestsellerIndex, setBestsellerIndex] = useState(0);
//     const [reviewIndex, setReviewIndex] = useState(0);

//     // Refs für die Scroll-Container
//     const scrollRef = useRef(null);
//     const reviewRef = useRef(null);

//     const { addToCart } = useCart(); // Verwende den Warenkorb-Kontext

//     const handleNext = () => {
//         setCurrentIndex((prevIndex) =>
//             prevIndex === images.length - 1 ? 0 : prevIndex + 1
//         );
//     };

//     const handlePrev = () => {
//         setCurrentIndex((prevIndex) =>
//             prevIndex === 0 ? images.length - 1 : prevIndex - 1
//         );
//     };

//     const handleNextBestseller = () => {
//         if (scrollRef.current) {
//             scrollRef.current.scrollBy({ left: 300, behavior: "smooth" }); // Scrollt 300px nach rechts
//         }
//         setBestsellerIndex((prevIndex) =>
//             prevIndex === bestsellers.length - 1 ? 0 : prevIndex + 1
//         );
//     };

//     const handlePrevBestseller = () => {
//         if (scrollRef.current) {
//             scrollRef.current.scrollBy({ left: -300, behavior: "smooth" }); // Scrollt 300px nach links
//         }
//         setBestsellerIndex((prevIndex) =>
//             prevIndex === 0 ? bestsellers.length - 1 : prevIndex - 1
//         );
//     };

//     const handleNextReview = () => {
//         if (reviewRef.current) {
//             reviewRef.current.scrollBy({ left: 300, behavior: "smooth" }); // Scrollt 300px nach rechts
//         }
//         setReviewIndex((prevIndex) =>
//             prevIndex === reviews.length - 1 ? 0 : prevIndex + 1
//         );
//     };

//     const handlePrevReview = () => {
//         if (reviewRef.current) {
//             reviewRef.current.scrollBy({ left: -300, behavior: "smooth" }); // Scrollt 300px nach links
//         }
//         setReviewIndex((prevIndex) =>
//             prevIndex === 0 ? reviews.length - 1 : prevIndex - 1
//         );
//     };

//     const handleAddToCart = (product) => {
//         addToCart(product); // Produkt zum Warenkorb hinzufügen
//     };

//     return (
//         <div className="relative z-30 w-4/5 md:w-3/4 lg:w-2/3 xl:w-1/2 mx-auto mt-4">
//             {/* Image Slider */}
//             <div className="relative">
//                 <img
//                     src={images[currentIndex]}
//                     alt={`Bild ${currentIndex + 1}`}
//                     className="w-full h-[300px] object-cover rounded-2xl shadow-lg"
//                 />

//                 <button
//                     className="absolute top-1/2 left-2 transform -translate-y-1/2 text-lg text-black bg-white p-2 rounded-full shadow-md hover:bg-gray-200 z-10"
//                     onClick={handlePrev}
//                 >
//                     <FaArrowLeft />
//                 </button>

//                 <button
//                     className="absolute top-1/2 right-2 transform -translate-y-1/2 text-lg text-black bg-white p-2 rounded-full shadow-md hover:bg-gray-200 z-10"
//                     onClick={handleNext}
//                 >
//                     <FaArrowRight />
//                 </button>
//             </div>

//             {/* Empfehlungen */}
//             <h2 className="text-2xl font-bold mt-4 mb-2 py-8 p-4">Empfohlene Produkte</h2>
//             <div className="space-y-4">
//                 {/* Erste Reihe - 3 Produkte */}
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                     {products.slice(0, 3).map((product, index) => (
//                         <div
//                             key={index}
//                             className="bg-white border border-gray-200 rounded-lg shadow-md p-4"
//                         >
//                             <img
//                                 src={product.image}
//                                 alt={product.name}
//                                 className="w-full h-32 object-contain mb-4"
//                             />
//                             <h3 className="text-lg font-semibold text-center">{product.name}</h3>
//                             <div className="flex items-center justify-center mb-2">
//                                 {Array.from({ length: productRatings[index] }).map((_, i) => (
//                                     <FaStar
//                                         key={i}
//                                         className="text-yellow-500"
//                                     />
//                                 ))}
//                             </div>
//                             <p className="text-md font-medium text-gray-700 text-center">{product.price}</p>
//                             <button
//                                 onClick={() => handleAddToCart(product)}
//                                 className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 mx-auto block"
//                             >
//                                 <FaShoppingCart className="inline mr-2" /> Kaufen
//                             </button>
//                         </div>
//                     ))}
//                 </div>

//                 {/* Zweite Reihe - Übrige Produkte */}
//                 <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
//                     {products.slice(3).map((product, index) => (
//                         <div
//                             key={index}
//                             className="bg-white border border-gray-200 rounded-lg shadow-md p-4"
//                         >
//                             <img
//                                 src={product.image}
//                                 alt={product.name}
//                                 className="w-full h-32 object-contain mb-4"
//                             />
//                             <h3 className="text-lg font-semibold text-center">{product.name}</h3>
//                             <div className="flex items-center justify-center mb-2">
//                                 {Array.from({ length: productRatings[index + 3] }).map((_, i) => (
//                                     <FaStar
//                                         key={i}
//                                         className="text-yellow-500"
//                                     />
//                                 ))}
//                             </div>
//                             <p className="text-md font-medium text-gray-700 text-center">{product.price}</p>
//                             <button
//                                 onClick={() => handleAddToCart(product)}
//                                 className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 mx-auto block"
//                             >
//                                 <FaShoppingCart className="inline mr-2" /> Kaufen
//                             </button>
//                         </div>
//                     ))}
//                 </div>
//             </div>

//             {/* Bestseller */}
//             <h2 className="text-2xl font-bold mt-4 mb-2 py-8 p-4">Bestseller</h2>
//             <div className="relative py-1 p-4"> {/* Vergrößere Y-Achse */}
//                 <div
//                     className="flex overflow-x-auto space-x-4 scrollbar-hide"
//                     ref={scrollRef}
//                     style={{ maxWidth: "100%", overflowX: "hidden" }}
//                 >
//                     {bestsellers.map((bestseller, index) => (
//                         <div
//                             key={index}
//                             className="bg-white p-4 rounded-lg shadow-md flex-shrink-0 w-56" // Verkleinere Breite und Höhe
//                         >
//                             <img
//                                 src={bestseller.image}
//                                 alt={bestseller.name}
//                                 className="w-full h-25 object-cover mb-2" // Verkleinere die Bildhöhe
//                             />
//                             <h3 className="text-lg font-semibold text-center">{bestseller.name}</h3>
//                             <div className="flex items-center justify-center mb-2">
//                                 {Array.from({ length: 4 }).map((_, i) => (
//                                     <FaStar
//                                         key={i}
//                                         className="text-yellow-500"
//                                     />
//                                 ))}
//                             </div>
//                             <p className="text-md font-medium text-gray-700 text-center">{bestseller.price}</p>
//                         </div>
//                     ))}
//                 </div>
//                 <button
//                     className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-gray-200 z-10"
//                     onClick={handlePrevBestseller}
//                 >
//                     <FaArrowLeft />
//                 </button>
//                 <button
//                     className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-gray-200 z-10"
//                     onClick={handleNextBestseller}
//                 >
//                     <FaArrowRight />
//                 </button>
//             </div>

//             {/* Kundenbewertungen */}
//             <h2 className="text-2xl font-bold mt-4 mb-2 mt-8 py-8 p-4">Kundenbewertungen</h2>
//             <div className="relative">
//                 <div
//                     className="flex overflow-x-auto space-x-4 scrollbar-hide p-4"
//                     ref={reviewRef}
//                     style={{ maxWidth: "100%", overflowX: "hidden" }}
//                 >
//                     {reviews.map((review, index) => (
//                         <div
//                             key={index}
//                             className="bg-white p-4 rounded-lg shadow-md flex-shrink-0 w-96" // Vergrößere Breite der Karte
//                         >
//                             <div className="flex items-center mb-2">
//                                 <h3 className="text-lg font-semibold mr-2">{review.name}</h3>
//                                 <FaCheckCircle className="text-blue-500" /> {/* Blauer Checkmark */}
//                             </div>
//                             <p className="text-sm text-gray-600">{review.timeAgo}</p>
//                             <div className="flex items-center mt-1">
//                                 {Array.from({ length: 5 }).map((_, i) => (
//                                     <FaStar
//                                         key={i}
//                                         className={`text-yellow-500 ${
//                                             i < review.rating ? "text-yellow-400" : "text-gray-300"
//                                         }`}
//                                     />
//                                 ))}
//                             </div>
//                             <p className="mt-2 text-sm text-gray-700">{review.comment}</p>
//                         </div>
//                     ))}
//                 </div>
//                 <button
//                     className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-gray-200 z-10"
//                     onClick={handlePrevReview}
//                 >
//                     <FaArrowLeft />
//                 </button>
//                 <button
//                     className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-gray-200 z-10"
//                     onClick={handleNextReview}
//                 >
//                     <FaArrowRight />
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default Home;

import { useState, useEffect, useRef } from "react";
import {
  FaArrowLeft,
  FaArrowRight,
  FaShoppingCart,
  FaStar,
  FaCheckCircle,
} from "react-icons/fa";
import { useCart } from "../CartContext";
import { Link } from "react-router-dom";
import FirstBanner from "../../banner/FirstBanner.jpg";
import SecondBanner from "../../banner/SecondBanner.jpg";
import ThirdBanner from "../../banner/ThirdBanner.jpg";
import FourthBanner from "../../banner/FourthBanner.jpg";
import FifthBanner from "../../banner/FifthBanner.jpg";
import SixthBanner from "../../banner/SeventhBanner.jpg";

// Placeholder für Bestseller-Daten
const placeholderBestsellers = [
  {
    name: "Samsung Galaxy S21",
    price: "899,90 €",
  },
  // ... (weitere Placeholder-Daten)
];

const reviews = [
  {
    name: "Max Mustermann",
    timeAgo: "2 hours ago",
    rating: 5,
    comment: "Great product! Highly recommended.",
  },
  // ... (weitere Reviews)
];

const productRatings = [5, 4, 4, 3, 5, 4]; // Beispielbewertungen für die Produkte

const images = [
  FirstBanner,
  SecondBanner,
  ThirdBanner,
  FourthBanner,
  FifthBanner,
  SixthBanner,
];

const Home = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [bestsellerIndex, setBestsellerIndex] = useState(0);
  const [reviewIndex, setReviewIndex] = useState(0);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Refs für die Scroll-Container
  const scrollRef = useRef(null);
  const reviewRef = useRef(null);

  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:1312/api/products");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        console.log(data); // Überprüfe die Struktur der zurückgegebenen Daten
        setProducts(data);
      } catch (error) {
        setError(error.message);
      } finally {
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

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="relative z-30 w-4/5 md:w-3/4 lg:w-2/3 xl:w-1/2 mx-auto mt-4">
      {/* Image Slider */}
      <div className="relative">
        <img
          src={images[currentIndex]}
          alt={`Bild ${currentIndex + 1}`}
          className="w-full h-[300px] object-cover rounded-2xl shadow-lg"
        />

        <button
          className="absolute top-1/2 left-2 transform -translate-y-1/2 text-lg text-black bg-white p-2 rounded-full shadow-md hover:bg-gray-200 z-10"
          onClick={handlePrev}
        >
          <FaArrowLeft />
        </button>

        <button
          className="absolute top-1/2 right-2 transform -translate-y-1/2 text-lg text-black bg-white p-2 rounded-full shadow-md hover:bg-gray-200 z-10"
          onClick={handleNext}
        >
          <FaArrowRight />
        </button>
      </div>

      {/* Empfehlungen */}
      <h2 className="text-2xl font-bold mt-4 mb-2 py-8 p-4">
        Empfohlene Produkte
      </h2>
      <div className="space-y-4">
        {/* Erste Reihe - 3 Produkte */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {products.slice(0, 3).map((product, index) => {
            return (
              <div
                key={product.id || index} // Verwende die ID oder den Index als Fallback
                className="bg-white border border-gray-200 rounded-lg shadow-md p-4"
              >
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-32 object-contain mb-4"
                />
                <h3 className="text-lg font-semibold text-center">
                  {product.name}
                </h3>
                <div className="flex items-center justify-center mb-2">
                  {Array.from({ length: productRatings[index] }).map((_, i) => (
                    <FaStar key={i} className="text-yellow-500" />
                  ))}
                </div>
                <p className="text-md font-medium text-gray-700 text-center">
                  {product.price}€
                </p>
                <button
                  onClick={() => handleAddToCart(product)}
                  className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 mx-auto block"
                >
                  <FaShoppingCart className="inline mr-2" /> Kaufen
                </button>
                <Link to={`/products/${product._id || product.id}`}>
                  <button className="mt-4 bg-blue-500 text-white px-4 py-1 rounded-lg shadow-md hover:bg-blue-600 mx-auto block">
                    Details
                  </button>
                </Link>
              </div>
            );
          })}
        </div>

        {/* Zweite Reihe - Weitere 6 Produkte */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {products.slice(3, 9).map((product, index) => (
            <div
              key={product.id || index} // Verwende die ID oder den Index als Fallback
              className="bg-white border border-gray-200 rounded-lg shadow-md p-4"
            >
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-32 object-contain mb-4"
              />
              <h3 className="text-lg font-semibold text-center">
                {product.name}
              </h3>
              <div className="flex items-center justify-center mb-2">
                {Array.from({ length: productRatings[index + 3] }).map(
                  (_, i) => (
                    <FaStar key={i} className="text-yellow-500" />
                  )
                )}
              </div>
              <p className="text-md font-medium text-gray-700 text-center">
                {product.price}€
              </p>
              <button
                onClick={() => handleAddToCart(product)}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 mx-auto block"
              >
                <FaShoppingCart className="inline mr-2" /> Kaufen
              </button>
              <Link to={`/products/${product._id || product.id}`}>
                  <button className="mt-4 bg-blue-500 text-white px-4 py-1 rounded-lg shadow-md hover:bg-blue-600 mx-auto block">
                    Details
                  </button>
                </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Bestseller */}
      <h2 className="text-2xl font-bold mt-4 mb-2 py-8 p-4">Bestseller</h2>
      <div className="relative py-1 p-4">
        <div
          className="flex overflow-x-auto space-x-4 scrollbar-hide"
          ref={scrollRef}
          style={{ maxWidth: "100%", overflowX: "hidden" }}
        >
          {products.slice(9, 18).map((bestseller, index) => (
            <div
              key={bestseller.id || index} // Verwende die ID oder den Index als Fallback
              className="bg-white p-4 rounded-lg shadow-md flex-shrink-0 w-56"
            >
              <img
                src={bestseller.imageUrl}
                alt={bestseller.name}
                className="w-full h-25 object-cover mb-2"
              />
              <h3 className="text-lg font-semibold text-center">
                {bestseller.name}
              </h3>
              <div className="flex items-center justify-center mb-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <FaStar key={i} className="text-yellow-500" />
                ))}
              </div>
              <p className="text-md font-medium text-gray-700 text-center">
                {bestseller.price}€
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

      {/* Kundenbewertungen */}
      <h2 className="text-2xl font-bold mt-4 mb-2 mt-8 py-8 p-4">
        Kundenbewertungen
      </h2>
      <div className="relative">
        <div
          className="flex overflow-x-auto space-x-4 scrollbar-hide p-4"
          ref={reviewRef}
          style={{ maxWidth: "100%", overflowX: "hidden" }}
        >
          {reviews.map((review, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-lg shadow-md flex-shrink-0 w-96"
            >
              <div className="flex items-center mb-2">
                <h3 className="text-lg font-semibold mr-2">{review.name}</h3>
                <FaCheckCircle className="text-blue-500" />
              </div>
              <p className="text-sm text-gray-600">{review.timeAgo}</p>
              <div className="flex items-center mt-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <FaStar
                    key={i}
                    className={`text-yellow-500 ${
                      i < review.rating ? "text-yellow-400" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <p className="mt-2 text-sm text-gray-700">{review.comment}</p>
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
