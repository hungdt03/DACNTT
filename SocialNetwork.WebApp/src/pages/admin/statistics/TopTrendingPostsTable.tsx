import { useEffect, useState } from "react";
import { Table, Button, Select, DatePicker, Avatar, Tooltip } from "antd";
import type { ColumnsType } from "antd/es/table";
import { TrendingPostResource } from "../../../types/trending-post";
import adminService from "../../../services/adminService";
import { Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";

const { RangePicker } = DatePicker;

const TopTrendingPostsTable = () => {
    const [trendingPosts, setTrendingPosts] = useState<TrendingPostResource[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [filterType, setFilterType] = useState<string>("");
    const [dateRange, setDateRange] = useState<[Date, Date] | null>(null);

    useEffect(() => {
        fetchTrendingPosts();
    }, [filterType, dateRange]);

    const fetchTrendingPosts = async () => {
        setLoading(true);
        let from: Date | undefined;
        let to: Date | undefined;

        if (filterType === "range" && dateRange) {
            from = dateRange[0];
            to = dateRange[1];
        }

        try {
            const response = await adminService.getTopTrendingPosts(filterType, from, to);
            if (response.isSuccess) {

                setTrendingPosts(response.data);
            }
        } catch (error) {
            console.error("Error fetching trending posts:", error);
        }
        setLoading(false);
    };

    const handleFilterChange = (value: string) => {
        setFilterType(value);
        if (value !== "range") {
            setDateRange(null);
        }
    };

    const handleDateChange = (dates: any) => {
        if (dates) {
            setDateRange([dates[0].toDate(), dates[1].toDate()]);
            setFilterType("range");
        }
    };

    const columns: ColumnsType<TrendingPostResource> = [
        {
            title: "Tác giả",
            dataIndex: "post",
            key: "author",
            render: (value) => {
                return <div className="flex items-center gap-x-2">
                    <Avatar size={"small"} src={value.user.avatar} />
                    <span>{value.user.fullName}</span>
                </div>
            }
        },
        {
            title: "Nội dung",
            dataIndex: ["post", "content"],
            key: "content",
            render: (value) => {
                return <Tooltip title={value}>
                     <p className="line-clamp-1 max-w-[200px]">{value}</p>
                </Tooltip>
            }
        },
        {
            title: "Cảm xúc",
            dataIndex: "reactions",
            key: "reactions",
        },
        {
            title: "Lượt bình luận",
            dataIndex: "comments",
            key: "comments",
        },
        {
            title: "Lượt chia sẻ",
            dataIndex: "shares",
            key: "shares",
        },
        {
            title: "Thao tác",
            key: "actions",
            render: (_, record) => (
                <div className="space-x-2">
                    <Link to={`/admin/posts/${record.post.id}`}>
                        <Button className="!bg-green-500" size="small" type="primary" icon={<Eye size={14} />}>Chi tiết</Button>
                    </Link>
                </div>
            ),
        },
    ];

    return (
        <div className="bg-white p-4 rounded-md">
            <div className="flex items-center justify-between">
                <span className="font-bold text-lg text-gray-700">🔥 Top 5 bài viết trending</span>
                <div className="mb-4 flex gap-4">
                    <Select
                        rootClassName="rounded-md bg-gray-100 hover:bg-gray-200"
                        dropdownStyle={{
                            backgroundColor: 'white'
                        }}
                        variant="borderless"
                        suffixIcon={<FontAwesomeIcon icon={faCaretDown} className="text-gray-500" />}
                        className="w-[200px]"
                        defaultValue=""
                        onChange={handleFilterChange}
                    >
                        <Select.Option value="">Hiện tại</Select.Option>
                        <Select.Option value="today">Hôm nay</Select.Option>
                        <Select.Option value="yesterday">Hôm qua</Select.Option>
                        <Select.Option value="week">7 ngày qua</Select.Option>
                        <Select.Option value="month">Tháng này</Select.Option>
                        <Select.Option value="range">Chọn khoảng ngày</Select.Option>
                    </Select>
                    {filterType === "range" && <RangePicker
                        placeholder={["Từ ngày", "Tới ngày"]}
                        onChange={handleDateChange}
                        variant="borderless"
                        rootClassName="rounded-md bg-gray-100 hover:bg-gray-200"
                    />}
                </div>
            </div>

            <Table
                columns={columns}
                dataSource={trendingPosts}
                loading={loading}
                rowKey={(record) => record.post.id}
                pagination={false}
            />
        </div>
    );
};

export default TopTrendingPostsTable;