import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

export const Details = () => {
  const { state } = useLocation();
  const product = state?.product;
  const navigate = useNavigate();
  const [addedToCart, setAddedToCart] = useState(false);

  const handleAddToCart = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/add-to-cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ itemName: product.name }),
      });

      const data = await response.json();
      if (response.ok) {
        setAddedToCart(true);
        setTimeout(() => setAddedToCart(false), 2000);
      } else {
        alert(data.message || "Failed to add to cart.");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Server error. Please try again later.");
    }
  };

  if (!product) {
    return <div className="p-8 text-red-500">Product not found.</div>;
  }

  return (
    <div className="container mx-auto px-6 py-10">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <img
          src={`/images/${product.imageURL}`}
          alt={product.name}
          className="w-full md:w-1/2 rounded shadow"
        />
        <div className="flex-1">
          <h1 className="text-6xl font-bold mb-2">{product.name}</h1>
          <p className="text-gray-600 mb-2">{product.description}</p>
          <p className="text-3xl text-gray-500 mb-1">
            Category: {product.category}
          </p>
          <p className="text-3xl text-gray-500 mb-1">Brand: {product.brand}</p>
          <p className="text-3xl text-gray-500 mb-1">
            Rating: ⭐ {product.rating?.toFixed(1)}
          </p>
          <p className="text-4xl font-semibold text-blue-700 mt-4">
            Rs. {product.price}
          </p>

          <button
            onClick={handleAddToCart}
            className="mt-6 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg transition"
          >
            Add to Cart
          </button>

          {addedToCart && (
            <p className="mt-2 text-green-600 font-medium">Added to cart!</p>
          )}
        </div>
      </div>
    </div>
  );
};
