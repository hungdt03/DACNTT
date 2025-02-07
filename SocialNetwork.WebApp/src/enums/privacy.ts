export enum PrivacyType {
    PUBLIC = 'PUBLIC',
    FRIENDS = 'FRIENDS',
    PRIVATE = 'PRIVATE',
    GROUP_PUBLIC = 'GROUP_PUBLIC',
    GROUP_PRIVATE = 'GROUP_PRIVATE',
}

export const getPrivacyTitle = (privacy: PrivacyType): string => {
    switch (privacy) {
        case PrivacyType.PUBLIC:
            return 'Công khai';
        case PrivacyType.FRIENDS:
            return 'Bạn bè';
        case PrivacyType.GROUP_PUBLIC:
            return 'Nhóm công khai';
        case PrivacyType.GROUP_PRIVATE:
            return 'Nhóm riêng tư';
        default:
            return 'Chỉ mình tôi';
    }
};
