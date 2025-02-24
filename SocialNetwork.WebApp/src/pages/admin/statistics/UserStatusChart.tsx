import React from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

type UserStatusChartProps = {
    onlines: number;
    offlines: number
}


const UserStatusChart: React.FC<UserStatusChartProps> = ({
    onlines,
    offlines
}) => {
    const chartOptions: ApexOptions = {
        chart: {
            type: "donut",
            
        },
        labels: ['Trực tuyến', 'Ngoại tuyến'],
        legend: {
            position: "bottom", // Chú thích hiển thị bên dưới
            horizontalAlign: "center",
            
        },

    };

    const chartSeries = [onlines, offlines];

    return (
        <div className="flex flex-col items-start">
            <span className="text-lg font-bold text-gray-700">Trạng thái hoạt động</span>
            <Chart options={chartOptions} series={chartSeries} type="donut" height={350} />
        </div>
    );
};

export default UserStatusChart;
