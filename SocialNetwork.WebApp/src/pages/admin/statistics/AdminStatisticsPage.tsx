import { FC, useEffect, useState } from "react";
import { StatisticResource } from "../../../types/statistic";
import adminService from "../../../services/adminService";
import adminImages from "../../../assets/adminImage";
import UserScoreChart from "./UserScoreChart";
import TopFollowersChart from "./TopFollowerChart";
import UserStatusChart from "./UserStatusChart";
import LoadingIndicator from "../../../components/LoadingIndicator";
import MonthlyRegistrationChart from "./MonthlyRegistrationChart";
import TopTrendingPostsTable from "./TopTrendingPostsTable";
import TopReactionAreaChart from "./TopReactionChart";
import images from "../../../assets";
import notis from "../../../assets/noti";


const AdminStatisticsPage: FC = () => {
    const [data, setData] = useState<StatisticResource>();
    const [loading, setLoading] = useState(false);

    const fetchData = async () => {
        setLoading(true)
        const response = await adminService.getStatistics();
        setLoading(false)
        if (response.isSuccess) {
            setData(response.data)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    return loading ? <LoadingIndicator title="Đang tải dữ liệu" /> : <div className="flex flex-col gap-y-4">
        <div className="grid grid-cols-4 gap-4">
            <div className="px-4 py-8 rounded-md bg-white shadow flex items-center justify-between">
                <img width={40} src={adminImages.post} />
                <div className="flex flex-col items-end">
                    <span className="text-3xl font-bold">{data?.countPosts}</span>
                    <span>Bài viết</span>
                </div>
            </div>
            <div className="px-4 py-8 rounded-md bg-white shadow flex items-center justify-between">
                <img width={50} src={adminImages.members} />
                <div className="flex flex-col items-end">
                    <span className="text-3xl font-bold">{data?.countUsers}</span>
                    <span>Người dùng</span>
                </div>
            </div>
            <div className="px-4 py-8 rounded-md bg-white shadow flex items-center justify-between">
                <img width={60} src={images.group} />
                <div className="flex flex-col items-end">
                    <span className="text-3xl font-bold">{data?.countGroups}</span>
                    <span>Nhóm</span>
                </div>
            </div>
            <div className="px-4 py-8 rounded-md bg-white shadow flex items-center justify-between">
                <img width={50} src={notis.notiReport} />
                <div className="flex flex-col items-end">
                    <span className="text-3xl font-bold">{data?.countReports}</span>
                    <span>Báo cáo</span>
                </div>
            </div>
        </div>

        <TopTrendingPostsTable />
        {}
        <div className="grid grid-cols-12 gap-4">
            <div className="col-span-8 bg-white shadow p-4 rounded-md">
                <TopFollowersChart data={data?.top5Followers ?? []} />
            </div>
            <div className="col-span-4 bg-white shadow p-4 rounded-md">
                <UserStatusChart offlines={data?.countOfflineUsers ?? 0} onlines={data?.countOnlineUsers ?? 0} />
            </div>

        </div>
        <UserScoreChart data={data?.top10UserScores ?? []} />
        <TopReactionAreaChart data={data?.topReactionWeeks ?? []} />
        <MonthlyRegistrationChart />
    </div>
};

export default AdminStatisticsPage;
