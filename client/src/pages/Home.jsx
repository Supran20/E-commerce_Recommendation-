import { useEffect, useState } from "react";
import Carousel from "react-bootstrap/Carousel";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const Home = () => {
  const [topRated, setTopRated] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/")
      .then((res) => setTopRated(res.data))
      .catch((err) => console.log(err));
  }, []);

  const handleClick = (product) => {
    navigate(`/details/${product.product_id}`, { state: { product } });
  };

  return (
    <main>
      <section className="relative w-full">
        <Carousel fade>
          {[
            "/images/corousel1.jpg",
            "/images/corousel2.jpg",
            "/images/corousel3.jpg",
            "/images/corousel4.jpg",
          ].map((src, index) => (
            <Carousel.Item key={index}>
              <img
                src={src}
                alt={`Slide ${index + 1}`}
                className="w-full h-[500px] object-cover"
              />
              <Carousel.Caption className="absolute bottom-12 left-10 text-white text-left">
                <div className="space-y-4">
                  <h1 className="text-5xl font-extrabold tracking-wide uppercase">
                    Elevate Your Everyday.
                  </h1>
                  <a
                    href="/items"
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg uppercase font-semibold tracking-wide shadow-md hover:bg-blue-700 transition"
                  >
                    Shop Now
                  </a>
                </div>
              </Carousel.Caption>
            </Carousel.Item>
          ))}
        </Carousel>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold mb-8">Top Rated Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {topRated.map((item, index) => (
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
                  ⭐ {item.rating.toFixed(1)} | {item.brand}
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
