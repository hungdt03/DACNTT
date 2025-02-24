import { FC } from "react";
import ReactApexChart from "react-apexcharts";
import { TopReactionResource } from "../../../types/top-reaction";
import { formatDateStandard } from "../../../utils/date";

interface TopReactionAreaChartProps {
    data: TopReactionResource[];
}

const reactionIcons: Record<string, string> = {
    LIKE: "👍",
    LOVE: "❤️",
    HAHA: "😂",
    WOW: "😲",
    SAD: "😢",
    ANGRY: "😡",
    CARE: "🤗",
};

const TopReactionAreaChart: FC<TopReactionAreaChartProps> = ({ data }) => {
    // Nhóm dữ liệu theo ngày
    const groupedData: Record<string, Record<string, number>> = {};

    data.forEach(({ date, type, count }) => {
        const dateKey = formatDateStandard(new Date(date));
        if (!groupedData[dateKey]) groupedData[dateKey] = {};
        groupedData[dateKey][type] = (groupedData[dateKey][type] || 0) + count;
    });

    const categories = Object.keys(groupedData).sort();

    const reactionTypes = ["LIKE", "LOVE", "HAHA", "WOW", "SAD", "ANGRY", "CARE"];

    const series = reactionTypes.map((type) => ({
        name: type.toUpperCase(),
        data: categories.map((date) => groupedData[date][type] || 0),
    }));

    const options: ApexCharts.ApexOptions = {
        chart: {
            type: "area",
            height: 350,
            toolbar: { show: false },
            
        },
        yaxis: {
            labels: {
                style: { fontSize: "14px", fontFamily: "'Nunito', 'Segoe UI', 'Roboto', 'Arial', sans-serif" }
            }
        },
        xaxis: {
            categories,
            labels: { rotate: -45, style: { fontSize: "14px", fontFamily: "'Nunito', 'Segoe UI', 'Roboto', 'Arial', sans-serif" } },
            
        },
        legend: {
            position: "top",
            labels: {
                useSeriesColors: true,
                colors: "#333",
            },
            formatter: function (seriesName) {
                return `${reactionIcons[seriesName]} ${seriesName}`; 
            },
        },
        stroke: { curve: "smooth" },
        fill: { opacity: 0.3 },
        
    };

    return (
        <div className="w-full p-4 bg-white shadow rounded-lg">
            <h2 className="text-lg font-semibold mb-4">🔥 Top Reactions trong tuần</h2>
            <ReactApexChart options={options} series={series} type="area" height={350} />
        </div>
    );
};

export default TopReactionAreaChart;
