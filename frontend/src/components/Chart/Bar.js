import React from "react";
import { Bar } from "react-chartjs-2";

function BarChart({ chartData, options, onClick }) {
  return <Bar data={chartData} options={options} onClick={onClick} />;
}

export default BarChart;
