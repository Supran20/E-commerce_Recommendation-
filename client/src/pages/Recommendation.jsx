import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const Recommendation = () => {
  const [recommendations, setRecommendations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://127.0.0.1:8000/recommendation",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("Recommendations API response:", response.data);
        setRecommendations(response.data.recommendations);
      } catch (error) {
        console.error("Error fetching recommendations:", error);
      }
    };

    fetchRecommendations();
  }, []);

  const handleClick = (product) => {
    navigate(`/details/${product.product_id}`, { state: { product } });
  };

  const parseNumber = (value) => {
    if (typeof value === "object" && value?.$numberDouble) {
      return parseFloat(value.$numberDouble);
    }
    if (typeof value === "number") {
      return value;
    }
    return NaN;
  };

  return (
    <main>
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold mb-8">Your recommendations:</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {recommendations.map((item, index) => (
              <div
                key={index}
                className="bg-gray-100 p-4 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition"
                onClick={() => handleClick(item)}
              >
                <img
                  src={`/images/${item.imageURL}`}
                  alt={item.name}
                  className="w-full h-48 object-cover rounded"
                />
                <h3 className="text-xl font-semibold mt-4">{item.name}</h3>
                <p className="text-sm text-gray-700">{item.description}</p>
                <p className="text-gray-600 mt-2">
                  ⭐{" "}
                  {!isNaN(parseNumber(item.rating))
                    ? parseNumber(item.rating).toFixed(1)
                    : "No rating"}{" "}
                  | {item.brand}
                </p>
                <p className="text-sm text-gray-500">{item.category}</p>
                <p className="text-lg font-bold text-blue-700 mt-2">
                  Rs.{" "}
                  {!isNaN(parseNumber(item.price))
                    ? parseNumber(item.price).toFixed(2)
                    : "N/A"}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};
