import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8000/customers")
      .then((res) => res.json())
      .then((data) => setCustomers(data))
      .catch((err) => console.error("Error fetching customers:", err));
  }, []);

  const handleCustomerClick = (name) => {
    navigate(`/customers/charts/${encodeURIComponent(name)}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Customer List
        </h2>

        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {customers.map((name, index) => (
            <div
              key={index}
              onClick={() => handleCustomerClick(name)}
              className="cursor-pointer bg-white shadow-lg rounded-2xl p-5 hover:scale-105 transition-transform duration-300"
            >
              <p className="text-lg font-semibold text-gray-700">{name}</p>
            </div>
          ))}
        </div>

        {customers.length === 0 && (
          <p className="text-center text-gray-500 mt-8">No customers found.</p>
        )}
      </div>
    </div>
  );
};

export default Customers;
