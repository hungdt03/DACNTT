import { FC, useEffect, useState } from "react";
import { Outlet, useParams } from "react-router-dom";
import MyGroupManageSidebar from "../../components/groups/components/MyGroupManageSidebar";
import cn from "../../utils/cn";
import groupService from "../../services/groupService";
import { GroupResource } from "../../types/group";

const GroupLayout: FC = () => {
    const { id } = useParams();
    const [group, setGroup] = useState<GroupResource>();

    const fetchGroup = async () => {
        if (id) {
            const response = await groupService.getGroupById(id);
            if (response.isSuccess) {
                setGroup(response.data)
            }
        }
    }

    useEffect(() => {
        fetchGroup();
    }, [id])

    return <div className="grid grid-cols-12 w-full h-full overflow-hidden">
        {group?.isMine && <MyGroupManageSidebar group={group} />}
        <div className={cn("w-full flex flex-col h-full bg-slate-100 overflow-y-auto", group?.isMine ? 'col-span-9' : 'col-span-12')}>
            <Outlet />
        </div>
    </div>
};

export default GroupLayout;
