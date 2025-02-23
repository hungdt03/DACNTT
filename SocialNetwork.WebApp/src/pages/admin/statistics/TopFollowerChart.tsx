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
            type: "bar" as const,
        },
        plotOptions: {
            bar: {
                horizontal: true, // Biểu đồ ngang
                distributed: true, // Mỗi cột có màu khác nhau
            },
        },
        xaxis: {
            categories: data.map((item) => item.user.fullName), // Chỉ đặt tên ở đây
        },
        colors: ["#FF4560", "#008FFB", "#00E396", "#FEB019", "#775DD0"], // Màu sắc khác nhau
        tooltip: {
            y: {
                formatter: (value, { dataPointIndex }) => {
                    const user = data[dataPointIndex].user;
                    return `
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <img src="${user.avatar}" alt="${user.fullName}" 
                                style="width: 24px; height: 24px; border-radius: 50%;" />
                            <span>${user.fullName}</span>
                        </div>
                        <div>Followers: ${value}</div>
                    `;
                },
            },
        },
    };

    const chartSeries = [
        {
            name: "Followers",
            data: data.map((item) => item.follow),
        },
    ];

    return (
        <div>
            <Chart options={chartOptions} series={chartSeries} type="bar" height={350} />
        </div>
    );
};

export default TopFollowersChart;
