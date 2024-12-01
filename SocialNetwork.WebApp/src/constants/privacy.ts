export enum PrivacyType {
    PUBLIC = 'PUBLIC',
    FRIENDS = 'FRIENDS',
    PRIVATE = 'PRIVATE',
}

export const getPrivacyTitle = (privacy: PrivacyType): string => {
    switch (privacy) {
        case PrivacyType.PUBLIC:
            return 'Công khai';
        case PrivacyType.FRIENDS:
            return 'Bạn bè';
        default:
            return 'Chỉ mình tôi';
    }
};
