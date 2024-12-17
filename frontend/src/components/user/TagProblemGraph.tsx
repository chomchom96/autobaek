import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

interface TagStat {
  tag: string;
  count: number;
}

interface TagProblemGraphProps {
  tagStats: TagStat[];
}

export default function TagProblemGraph({ tagStats }: TagProblemGraphProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext("2d");
      if (ctx) {
        const chart = new Chart(ctx, {
          type: "radar",
          data: {
            labels: tagStats.map((stat) => stat.tag),
            datasets: [
              {
                label: "Problems Solved",
                data: tagStats.map((stat) => stat.count),
                backgroundColor: "rgba(54, 162, 235, 0.2)",
                borderColor: "rgb(54, 162, 235)",
                pointBackgroundColor: "rgb(54, 162, 235)",
                pointBorderColor: "#fff",
                pointHoverBackgroundColor: "#fff",
                pointHoverBorderColor: "rgb(54, 162, 235)",
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              r: {
                beginAtZero: true,
                ticks: {
                  display: false,
                },
              },
            },
            plugins: {
              legend: {
                display: false,
              },
              tooltip: {
                callbacks: {
                  label: function (context) {
                    return `${context.label}: ${context.raw} problems solved`;
                  },
                },
              },
            },
          },
        });

        return () => {
          chart.destroy();
        };
      }
    }
  }, [tagStats]);

  return (
    <div className="w-full h-64 md:h-80">
      <canvas ref={chartRef} />
    </div>
  );
}
