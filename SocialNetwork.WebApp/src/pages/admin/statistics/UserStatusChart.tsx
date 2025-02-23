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
        colors: ["#00E676", "#FF1744"], // Xanh lá và đỏ
        fill: {
            type: "gradient",
            gradient: {
                shade: "light",
                type: "radial",
                shadeIntensity: 0.4,
                gradientToColors: ["#00C853", "#D50000"],
                inverseColors: false,
                opacityFrom: 0.8,
                opacityTo: 1,
                stops: [40, 100],
            },
        },
    };

    const chartSeries = [onlines, offlines];

    return (
        <div>
            <Chart options={chartOptions} series={chartSeries} type="donut" height={350} />
        </div>
    );
};

export default UserStatusChart;
