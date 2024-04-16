"use client";
import { ArcElement, CategoryScale, Chart } from "chart.js";
import { Pie } from "react-chartjs-2";
Chart.register(ArcElement);
export default function PieChart({ className }: { className?: string }) {
  const data = {
    labels: ["Red", "Blue", "Yellow", "quần què"],
    datasets: [
      {
        label: "My First Dataset",
        data: [300, 50, 100, 500],
        backgroundColor: [
          "rgb(255, 99, 132)",
          "rgb(54, 162, 235)",
          "rgb(255, 205, 86)",
          "rgb(255, 205, 0)",
        ],
        hoverOffset: 4,
        borderColor: "rgb(255, 99, 132)",
      },
    ],
  };
  const config = {
    type: "pie",
    data: data,
  };
  return (
    <div className={className}>
      <Pie
        options={{
          plugins: {
            title: {
              display: true,
              text: "Users Gained between 2016-2020",
              color: "white",
            },
            legend: {
              position: "top" as const,
            },
          },
        }}
        data={config.data}
      />
    </div>
  );
}
