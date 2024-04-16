"use client";
import { ArcElement, CategoryScale, Chart } from "chart.js";
import { Pie } from "react-chartjs-2";
Chart.register(ArcElement);
export default function PieChart({ className ,dataChart}: { className?: string ,dataChart:any}) {
  const data = {
    labels: dataChart.map((item:any) => item.className),
    datasets: [
      {
        label: "Sỉ số các lớp",
        data: dataChart.map((item:any) => item.numberOfStudents),
        backgroundColor: dataChart.map((item:any) => `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)})`),
        hoverOffset: 4,
        borderColor: "green",
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
