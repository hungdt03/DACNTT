export type ContentTypeKey = 'MEDIA' | 'TEXT' | 'BACKGROUND' | 'SHARE' | 'ALL';
export type SortOrderKey = 'asc' | 'desc';

export interface ContentType {
    key: ContentTypeKey;
    label: string;
}

interface SortOrder {
    key: SortOrderKey;
    label: string;
}

export const CONTENT_TYPES: ContentType[] = [
    { key: 'ALL', label: 'Tất cả' },
    { key: 'MEDIA', label: 'Ảnh/video' },
    { key: 'TEXT', label: 'Văn bản' },
    { key: 'BACKGROUND', label: 'Phông nền' },
    { key: 'SHARE', label: 'Chia sẻ lại' },
];

export const SORT_ORDER: SortOrder[] = [
    { key: 'asc', label: 'Cũ nhất trước' },
    { key: 'desc', label: 'Mới nhất trước' },
];