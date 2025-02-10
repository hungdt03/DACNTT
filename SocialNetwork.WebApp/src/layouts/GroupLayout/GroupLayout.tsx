import { FC, useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import MyGroupManageSidebar from "../../components/groups/components/MyGroupManageSidebar";
import cn from "../../utils/cn";
import groupService from "../../services/groupService";
import { GroupResource } from "../../types/group";
import GroupHeader from "../../components/groups/GroupHeader";
import { JoinGroupRequestResource } from "../../types/join-group";
import Loading from "../../components/Loading";
import NotAllowedComponent from "../../components/NotAllowedComponent";

const NOT_ALLOWED_ROUTES = ['/pending-reports', '/pending-posts', '/pending-members']

const GroupLayout: FC = () => {
    const { id } = useParams();
    const [group, setGroup] = useState<GroupResource>();
    const [requestJoin, setRequestJoin] = useState<JoinGroupRequestResource>();
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const [loadingRequest, setLoadingRequest] = useState(false)
    
    const navigate = useNavigate();

    const fetchRequestJoin = async () => {
        if (id) {
            setLoadingRequest(true)
            const response = await groupService.getJoinGroupRequestByGroupId(id);
            setLoadingRequest(false)
            if (response.isSuccess) {
                setRequestJoin(response.data)
            }
        }
    }

    const fetchGroup = async () => {
        if (id) {
            setLoading(true)
            const response = await groupService.getGroupById(id);
            setLoading(false)
            if (response.isSuccess) {
                setGroup(response.data)
            }
        }
    }

    useEffect(() => {
        fetchGroup();
        fetchRequestJoin();
    }, [id])

    useEffect(() => {
        if (group && !group.isMember || (group?.isMember && NOT_ALLOWED_ROUTES.some(route => location.pathname.includes(route))))
            navigate(`/groups/${group?.id}`)
    }, [group])

    if (loading || loadingRequest) return <Loading />

    return group?.isHidden && !requestJoin && !group.isMember ? <NotAllowedComponent /> : <div className="grid grid-cols-12 w-full h-full overflow-hidden">
        {group?.isMine && <MyGroupManageSidebar group={group} />}
        <div id="group-layout" className={cn("w-full flex flex-col h-full bg-slate-100 overflow-y-auto", group?.isMine ? 'col-span-9' : 'col-span-12')}>
            {group && <GroupHeader onFetchRequest={fetchRequestJoin} onFetch={fetchGroup} requestJoin={requestJoin} group={group} />}
            <Outlet />
        </div>
    </div>
};

export default GroupLayout;
