import { GetProp, UploadProps } from "antd";

export type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const getBase64 = (file: FileType): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });

const imageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp', 'image/webp', 'image/jpg'];
const videoTypes = ['video/mp4', 'video/avi', 'video/mkv', 'video/webm'];

const isValidImage = (file: File): boolean => file.type.startsWith("image/");
const isValidVideo = (file: File): boolean => file.type.startsWith("video/");


export { getBase64, imageTypes, videoTypes, isValidImage, isValidVideo }