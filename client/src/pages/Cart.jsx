import { useEffect, useState } from "react";
import axios from "axios";

export const Cart = () => {
  const [cartItems, setCartItems] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      axios
        .get("http://127.0.0.1:8000/cart", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setCartItems(res.data);
        })
        .catch((error) => console.error("Error fetching cart items:", error));
    }
  }, [token]);

  const handleRemove = (itemName) => {
    axios
      .post(
        "http://127.0.0.1:8000/remove-from-cart",
        { itemName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => {
        setCartItems((prevItems) =>
          prevItems.filter((item) => item.name !== itemName)
        );
      })
      .catch((err) => console.error("Error removing item:", err));
  };

  const handlePurchase = () => {
    axios
      .post(
        "http://127.0.0.1:8000/purchase",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        alert("Thank you for your purchase!");
        setCartItems([]); // Clear UI
      })
      .catch((err) => {
        console.error("Error during purchase:", err);
        alert("Purchase failed. Try again.");
      });
  };

  return (
    <main>
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold mb-8">Your Cart</h2>
          {cartItems.length === 0 ? (
            <p className="text-gray-600">Your cart is empty.</p>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {cartItems.map((item, index) => (
                  <div
                    key={index}
                    className="bg-gray-100 p-4 rounded-lg shadow-md"
                  >
                    <img
                      src={`/images/${item.imageURL}`}
                      alt={item.name}
                      className="w-full h-48 object-cover rounded"
                    />
                    <h3 className="text-xl font-semibold mt-4">{item.name}</h3>
                    <p className="text-sm text-gray-700">{item.description}</p>
                    <p className="text-gray-600 mt-2">
                      ⭐ {item.rating ? item.rating.toFixed(1) : "No rating"} |{" "}
                      {item.brand}
                    </p>
                    <p className="text-sm text-gray-500">{item.category}</p>
                    <p className="text-lg font-bold text-blue-700 mt-2">
                      Rs. {item.price}
                    </p>
                    <button
                      onClick={() => handleRemove(item.name)}
                      className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
              <div className="mt-8 text-right">
                <button
                  onClick={handlePurchase}
                  className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Purchase
                </button>
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
};
