import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { getOrderStats } from "../../Api";
import "./Saleschart.css";

const SalesChart = () => {
  const [data, setData] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchSales = async (start, end) => {
    try {
      const res = await getOrderStats(start, end); // pass dates to API
      setData(res.data.monthlySales);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSales(); // initial load without filters
  }, []);

  const handleFilter = () => {
    if (startDate && endDate) {
      fetchSales(startDate, endDate);
    }
  };

  return (
    <div className="sales-chart-container">
      <h2 className="chart-title">Monthly Sales Overview</h2>

      <div className="chart-filters">
        <label>
          Start Date: 
          <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
        </label>
        <label>
          End Date: 
          <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
        </label>
        <button onClick={handleFilter}>Filter</button>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
          <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
          <Tooltip />
          <Legend />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="revenue"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
            name="Revenue (GHS)"
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="orders"
            stroke="#82ca9d"
            name="Orders"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalesChart;
