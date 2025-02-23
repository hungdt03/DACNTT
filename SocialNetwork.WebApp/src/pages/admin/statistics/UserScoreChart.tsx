import React from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { UserScore } from "../../../types/statistic";

type UserScoreChartProps = {
    data: UserScore[]
}

const UserScoreChart: React.FC<UserScoreChartProps> = ({
    data
}) => {
    const chartOptions: ApexOptions = {
        chart: {
            type: "bar",
            toolbar: { show: false }
        },
        xaxis: {
            categories: data.map((u) => u.user.fullName),
            title: { text: "Người dùng" }
        },
        yaxis: {
            title: { text: "Điểm số" }
        },
        colors: ["#4CAF50"], // Màu xanh lá cây
        plotOptions: {
            bar: {
                borderRadius: 8, // Bo góc cột cho mềm mại
                horizontal: false,
                columnWidth: "55%" // Điều chỉnh độ rộng cột
            }
        },
        dataLabels: {
            enabled: true,
            style: {
                colors: ["#333"], // Màu chữ hiển thị trên cột
                fontSize: "12px",
                fontWeight: "bold"
            }
        }
    };

    const chartSeries = [
        {
            name: "Điểm số",
            data: data.map((u) => u.score)
        }
    ];

    return (
        <div className="w-[600px] mx-auto p-4 bg-white shadow-lg rounded-xl">
            <h2 className="text-center font-bold text-2xl text-gray-700 mb-4">
                📊 Top người dùng có tương tác nhiều nhất
            </h2>
            <Chart options={chartOptions} series={chartSeries} type="bar" height={350} />
        </div>
    );
};

export default UserScoreChart;
