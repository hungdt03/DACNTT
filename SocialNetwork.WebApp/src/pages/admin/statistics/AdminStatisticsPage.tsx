import { FC, useEffect, useState } from "react";
import { StatisticResource } from "../../../types/statistic";
import adminService from "../../../services/adminService";
import adminImages from "../../../assets/adminImage";
import UserScoreChart from "./UserScoreChart";
import TopFollowersChart from "./TopFollowerChart";
import UserStatusChart from "./UserStatusChart";

const AdminStatisticsPage: FC = () => {
    const [data, setData] = useState<StatisticResource>();

    const fetchData = async () => {
        const response = await adminService.getStatistics();
        if (response.isSuccess) {
            setData(response.data)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    return <div className="flex flex-col gap-y-4">
        <div className="grid grid-cols-4 gap-4">
            <div className="px-4 py-8 rounded-md bg-white shadow flex items-center justify-between">
                <img width={40} src={adminImages.dateCreated} />
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
                <img width={40} src={adminImages.post} />
                <div className="flex flex-col items-end">
                    <span className="text-3xl font-bold">{data?.countGroups}</span>
                    <span>Nhóm</span>
                </div>
            </div>
            <div className="px-4 py-8 rounded-md bg-white shadow flex items-center justify-between">
                <img width={40} src={adminImages.onlyToday} />
                <div className="flex flex-col items-end">
                    <span className="text-3xl font-bold">{data?.countReports}</span>
                    <span>Báo cáo</span>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-12 gap-4">
            <div className="col-span-8 bg-white shadow p-4 rounded-md">
                <UserScoreChart data={data?.top10UserScores ?? []}  />
            </div>
            <div className="col-span-4 bg-white flex items-center justify-center shadow p-4 rounded-md">
                <UserStatusChart offlines={data?.countOfflineUsers ?? 0} onlines={data?.countOnlineUsers ?? 0} />
            </div>
            <div className="col-span-12">
                <TopFollowersChart data={data?.top5Followers ?? []} />
            </div>
        </div>
    </div>
};

export default AdminStatisticsPage;
