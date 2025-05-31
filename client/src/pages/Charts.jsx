import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export const Charts = () => {
  const { name } = useParams();
  const [items, setItems] = useState([]);
  const [recommendData, setRecommendData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/charts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    })
      .then((res) => res.json())
      .then((data) => {
        setItems(data.purchases || []);
        const rec = data.recommend || {};
        const formatted = Object.entries(rec).map(([category, count]) => ({
          category,
          count,
        }));
        setRecommendData(formatted);
      })
      .catch((err) => console.error("Error fetching purchases:", err));
  }, [name]);

  if (!items || items.length === 0) {
    return (
      <p className="text-center text-gray-500 mt-4">
        No purchase history found for {name}.
      </p>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h3 className="text-2xl font-semibold text-center text-gray-800 mb-6">
        Last 10 Purchases by {name}
      </h3>
      <div className="overflow-x-auto mb-10">
        <table className="min-w-full bg-white border rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-200 text-gray-700 text-left">
              <th className="p-3">Name</th>
              <th className="p-3">Category</th>
              <th className="p-3">Brand</th>
              <th className="p-3">Price</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <tr key={idx} className="border-t">
                <td className="p-3">{item.name}</td>
                <td className="p-3">{item.category}</td>
                <td className="p-3">{item.brand}</td>
                <td className="p-3">Rs. {item.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {recommendData.length > 0 && (
        <>
          <h4 className="text-xl font-semibold text-center mb-4">
            Recommended Category Frequencies
          </h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={recommendData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8" barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </>
      )}
    </div>
  );
};

export default Charts;
