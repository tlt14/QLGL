"use client";
import React from "react";
import Chart, { CategoryScale } from "chart.js/auto";
import { Bar } from "react-chartjs-2";
Chart.register(CategoryScale);
const BarChart = ({ dataChart }: { dataChart: any }) => {
  const labels = dataChart?.map((item:any) => item.className);
  const data = {
    labels: labels,
    datasets: [
      {
        label: "My First dataset",
        backgroundColor: "rgb(255, 99, 132)",
        borderColor: "rgb(255, 99, 132)",
        data: dataChart.map((item:any) => item.numberOfStudents),
      },
    ],
  };
  return (
    <div>
      <Bar data={data} />
    </div>
  );
};

export default BarChart;
