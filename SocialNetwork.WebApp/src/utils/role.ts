import { MemberRole } from "../enums/member-role";

export const getRoleGroupTitle = (role: MemberRole) : string => {
    if(role === MemberRole.ADMIN) return 'Quản trị viên'
    if(role === MemberRole.MODERATOR) return 'Người kiểm duyệt'
    return 'Thành viên'
}