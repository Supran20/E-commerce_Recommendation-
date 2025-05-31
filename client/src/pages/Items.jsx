import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; 

export const Items = () => {
  const [allProducts, setAllProducts] = useState([]);
  const navigate = useNavigate(); 

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/items")
      .then((res) => {
        console.log("Items API response:", res.data);
        setAllProducts(res.data);
      })
      .catch((error) => console.error("Error Fetching Products", error));
  }, []);

  const handleClick = (product) => {
    navigate(`/details/${product.product_id}`, { state: { product } });
  };

  return (
    <main>
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold mb-8">Our Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {allProducts.map((item, index) => (
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
                  ⭐ {item.rating ? item.rating.toFixed(1) : "No rating"} |{" "}
                  {item.brand}
                </p>
                <p className="text-sm text-gray-500">{item.category}</p>
                <p className="text-lg font-bold text-blue-700 mt-2">
                  Rs. {item.price}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};
