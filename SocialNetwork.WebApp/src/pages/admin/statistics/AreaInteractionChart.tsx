import React from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

const WeeklyInteractionChart: React.FC = () => {
    const chartOptions: ApexOptions = {
        chart: {
            type: "area",
            toolbar: { show: false }
        },
        xaxis: {
            categories: ["01/08", "02/08", "03/08", "04/08", "05/08", "06/08", "07/08"], // 7 ngày trong tuần
            title: { text: "Ngày" }
        },
        yaxis: {
            title: { text: "Lượt tương tác" }
        },
        colors: ["#1677ff", "#28a745", "#ff9800"], // Like - xanh dương, Comment - xanh lá, Share - cam
        dataLabels: { enabled: false },
        stroke: { curve: "smooth" },
        legend: { position: "top" },
        fill: { type: "gradient", gradient: { shadeIntensity: 0.4, opacityFrom: 0.8, opacityTo: 0.3 } }
    };

    const chartSeries = [
        { name: "Like", data: [2000, 2500, 3200, 2800, 3100, 3300, 3500] },
        { name: "Comment", data: [500, 700, 900, 850, 870, 950, 1000] },
        { name: "Share", data: [150, 200, 250, 220, 230, 270, 300] }
    ];

    return (
        <div className="w-[700px] mx-auto">
            <h2 className="text-center font-bold text-xl mb-3">Thống kê tương tác theo tuần</h2>
            <Chart options={chartOptions} series={chartSeries} type="area" height={350} />
        </div>
    );
};

export default WeeklyInteractionChart;
