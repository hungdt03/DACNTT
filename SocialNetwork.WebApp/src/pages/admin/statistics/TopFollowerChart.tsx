import React from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { UserFollow } from "../../../types/statistic";

type TopFollowersChartProps = {
    data: UserFollow[];
};

const TopFollowersChart: React.FC<TopFollowersChartProps> = ({ data }) => {
    const chartOptions: ApexOptions = {
        chart: {
            type: "bar",
            toolbar: { show: false },
        },
        plotOptions: {
            bar: {
                horizontal: true,
                distributed: true,
                borderRadius: 6,
                barHeight: "40%",
            },
        },
        colors: [
            "#FF5733", "#FF8D1A", "#FFC300", "#28A745", "#17A2B8",
            "#6610F2", "#E83E8C", "#6C757D", "#20C997", "#FD7E14"
        ],
        dataLabels: {
            enabled: true,
            style: {
                colors: ["#fff"],
                fontWeight: "bold",
            },
            formatter: (val) => `${val} 👥`,
            offsetX: 10,
        },
        xaxis: {
            categories: data.map((item) => item.user.fullName),
            labels: {
                style: { fontSize: "12px", fontFamily: "'Nunito', 'Segoe UI', 'Roboto', 'Arial', sans-serif" }
            },
        },
        yaxis: {
            labels: {
                style: { fontSize: "12px", fontFamily: "'Nunito', 'Segoe UI', 'Roboto', 'Arial', sans-serif" }
            },
        },
        tooltip: {
            y: {
                formatter: (value, { dataPointIndex }) => {
                    const user = data[dataPointIndex].user;
                    return `
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <img src="${user.avatar}" alt="${user.fullName}" 
                                style="width: 28px; height: 28px; border-radius: 50%;" />
                            <span>${user.fullName}</span>
                        </div>
                        <div style="margin-top: 6px;">👥<strong>${value}</strong></div>
                    `;
                },
                
            },
            style: { fontSize: "14px", fontFamily: "'Nunito', 'Segoe UI', 'Roboto', 'Arial', sans-serif" }
        },
        grid: {
            borderColor: "#e7e7e7",
            strokeDashArray: 4,
        },
    };

    const chartSeries = [
        {
            name: "Followers",
            data: data.map((item) => item.follow),
            style: { fontSize: "14px", fontFamily: "'Nunito', 'Segoe UI', 'Roboto', 'Arial', sans-serif" }
        },
    ];

    return (
        <div className="bg-white p-5 rounded-lg shadow-md">
            <h2 className="text-lg font-bold text-gray-700 mb-4">Top người dùng có nhiều người theo dõi nhất</h2>
            <Chart options={chartOptions} series={chartSeries} type="bar" height={400} />
        </div>
    );
};

export default TopFollowersChart;
