import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import { MonthlyRegistrationStatsResource } from "../../../types/monthly-registration-stats";
import adminService from "../../../services/adminService";

const MonthlyRegistrationChart: React.FC = () => {
    const currentYear = new Date().getFullYear();
    const [data, setData] = useState<MonthlyRegistrationStatsResource[]>([]);
    const [selectedYear, setSelectedYear] = useState<number>(currentYear);

    useEffect(() => {
        const fetchData = async (year: number) => {
            const response = await adminService.GetRegistrationStatsByYear(year);
            if (response.isSuccess) {
                setData(response.data);
            }
        };
        fetchData(selectedYear);
    }, [selectedYear]); // Re-fetch khi selectedYear thay đổi

    const handleYearChange = (date: dayjs.Dayjs | null) => {
        if (date) {
            setSelectedYear(date.year());
        }
    };

    const chartOptions = {
        chart: {
            type: "bar" as const,
            height: 350,
            toolbar: {
                show: false,
            },
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: "50%",
                borderRadius: 4,
            },
        },
        dataLabels: {
            enabled: false,
        },
        stroke: {
            show: true,
            width: 2,
            colors: ["transparent"],

        },
        xaxis: {
            categories: data.map((item) => `Tháng ${item.month}`),
            labels: {
                style: { fontSize: "14px", fontFamily: "'Nunito', 'Segoe UI', 'Roboto', 'Arial', sans-serif" }
            }
        },
        yaxis: {
            title: {
                text: "Số lượng đăng ký",
                style: { fontSize: "14px", fontWeight: "bold", fontFamily: "'Nunito', 'Segoe UI', 'Roboto', 'Arial', sans-serif" }
            },
            labels: { style: { fontSize: "14px", fontFamily: "'Nunito', 'Segoe UI', 'Roboto', 'Arial', sans-serif" } }, 
        },
        fill: {
            opacity: 1,
            colors: ["#1E90FF"], // Màu xanh dương đẹp mắt
        },
        tooltip: {
            y: {
                formatter: (val: number) => `${val} người đăng ký`,
            },
        },
    };

    const series = [
        {
            name: "Số lượng đăng ký",
            data: data.map((item) => item.count),
        },
    ];

    return (
        <div className="bg-white p-4 shadow-md rounded-xl">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-800">Lượt đăng ký tài khoản trong năm {selectedYear}</h2>
                <DatePicker
                    picker="year"
                    value={dayjs(`${selectedYear}`)}
                    onChange={handleYearChange}
                    className="border rounded px-2 py-1"
                />
            </div>
            <Chart options={chartOptions} series={series} type="bar" height={350} />
        </div>
    );
};

export default MonthlyRegistrationChart;
