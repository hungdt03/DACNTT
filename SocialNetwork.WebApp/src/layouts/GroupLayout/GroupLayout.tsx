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
import { GroupInvitationResource } from "../../types/group-invitation";
import useTitle from "../../hooks/useTitle";

const NOT_ALLOWED_ROUTES = ['/pending-reports', '/pending-posts', '/pending-members', '/pending-invites', '/user']

const GroupLayout: FC = () => {
    
    const { id } = useParams();
    const location = useLocation();

    const [group, setGroup] = useState<GroupResource>();
    const [requestJoin, setRequestJoin] = useState<JoinGroupRequestResource>();
    const [inviteJoin, setInviteJoin] = useState<GroupInvitationResource>()

    const [loading, setLoading] = useState(false);
    const [loadingRequest, setLoadingRequest] = useState(false);
    const [loadingInvite, setLoadingInvite] = useState(false)

    const navigate = useNavigate();

    useTitle(group?.name ?? 'Nhóm')

    const fetchRequestJoin = async () => {
        if (id) {
            setLoadingRequest(true)
            const response = await groupService.getJoinGroupRequestByGroupId(id);

            setLoadingRequest(false)
            if (response.isSuccess) {
                setRequestJoin(response.data)
            } else {
                setRequestJoin(undefined)
            }
        }
    }

    const fetchInviteJoin = async () => {
        if (id) {
            setLoadingInvite(true)
            const response = await groupService.getInviteJoinGroup(id);
            setLoadingInvite(false)
            if (response.isSuccess) {
                setInviteJoin(response.data)
            } else {
                setInviteJoin(undefined)
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
            } else {
                navigate('/404')
            }
        }
    }

    useEffect(() => {
        fetchGroup();
        fetchRequestJoin();
        fetchInviteJoin()
    }, [id])

    useEffect(() => {
        if (group && !group.isMember || (group?.isMember && NOT_ALLOWED_ROUTES.some(route => location.pathname.includes(route))))
            navigate(`/groups/${group?.id}`)
    }, [group])

    if (loading || loadingRequest || loadingInvite) return <Loading />

    return !location.pathname.includes('/my-content') && group?.isHidden && !inviteJoin && !group.isMember ? <NotAllowedComponent /> : <div className="grid grid-cols-12 w-full h-full overflow-hidden">
        {(group?.isMine || group?.isModerator) &&
            <div className="lg:col-span-3 lg:block hidden bg-white h-full overflow-y-auto w-full shadow border-r-[1px] border-gray-200">
                <MyGroupManageSidebar group={group} />
            </div>
        }

        <div id="group-layout" className={cn("w-full flex flex-col h-full bg-slate-100 overflow-y-auto", (group?.isMine || group?.isModerator) ? 'lg:col-span-9 col-span-12' : 'col-span-12')}>
            {!location.pathname.includes('/my-content') && group && !NOT_ALLOWED_ROUTES.some(route => location.pathname.includes(route)) && <GroupHeader onFetchGroup={fetchGroup} onFetchRequest={fetchRequestJoin} onFetchInvite={fetchInviteJoin} inviteJoin={inviteJoin} requestJoin={requestJoin} group={group} />}
            <Outlet />
        </div>
    </div>
};

export default GroupLayout;
