import { Image, Upload, UploadFile, UploadProps } from "antd";
import { InboxOutlined } from '@ant-design/icons'
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { FileType, getBase64, isValidImage, isValidVideo } from "../../utils/file";
import UploadButton from "./UploadButton";
import { RcFile } from "antd/es/upload";
import { MediaType } from "../../enums/media";

const MAX_SIZE_MB_UPLOAD = 50;
const MAX_SIZE_IN_BYTES = MAX_SIZE_MB_UPLOAD * 1024 * 1024;

export type UploadFileBinding = {
    url: string;
    type: MediaType
}

type UploadMultipleFileProps = {
    onChange?: (fileList: UploadFile[]) => void;
    valueUrls?: UploadFileBinding[];
    onRemoveFileUrl?: (url: string | undefined) => void;
}


type UploadMultipleFileRef = {
    clear: () => void;
};

const { Dragger } = Upload;

const UploadMultipleFile = forwardRef<UploadMultipleFileRef, UploadMultipleFileProps>((
    { onChange, valueUrls, onRemoveFileUrl }, ref
) => {
    const [fileList, setFileList] = useState<UploadFile[] | any[]>([]);
    const [previewImageOpen, setPreviewImageOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleImagePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as FileType);
        }

        setPreviewImage(file.url ?? (file.preview as string));
        setPreviewImageOpen(true);
    };

    const handleImageChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
        const isValidFile = (file: UploadFile) => {
            return isValidImage(file.originFileObj as File) || isValidVideo(file.originFileObj as File);
        };

        const filterFiles = newFileList.filter(file => file.name);
        const totalSize = filterFiles.reduce((acc, file) => acc + (file.originFileObj as File).size, 0);
        const invalidFile = filterFiles.find(file => !isValidFile(file));

        if (invalidFile) {
            setErrorMessage('Vui lòng chọn tệp ảnh hoặc video hợp lệ!');
            return;
        } else if (totalSize > MAX_SIZE_IN_BYTES) {
            setErrorMessage('Tổng kích thước các tệp vượt quá 50MB!');
            return;
        } else {
            setErrorMessage(null);
        }

        // Cập nhật fileList
        onChange?.(newFileList);
        setFileList(newFileList);
    };

    const handleRemoveFile = (file: UploadFile) => {
        if (!file.name) {
            onRemoveFileUrl?.(file.url)
        }
    }

    const props: UploadProps = {
        name: 'file',
        fileList: fileList,
        multiple: true,
        onChange(info) {
            const isValidFile = (file: UploadFile) => {
                return isValidImage(file.originFileObj as File) || isValidVideo(file.originFileObj as File);
            };

            const totalSize = info.fileList.reduce((acc, file) => acc + (file.originFileObj as File).size, 0);
            const invalidFile = info.fileList.find(file => !isValidFile(file));

            if (invalidFile) {
                setErrorMessage('Vui lòng chọn tệp ảnh hoặc video hợp lệ!');
                return;
            } else if (totalSize > MAX_SIZE_IN_BYTES) {
                setErrorMessage('Tổng kích thước các tệp vượt quá 50MB!');
                return;
            } else {
                setErrorMessage(null);
            }

            onChange?.(info.fileList)
            setFileList(info.fileList)
        },
        onRemove: handleRemoveFile,
        beforeUpload: (_) => false
    };

    useEffect(() => {
        if (valueUrls) {
            setFileList([...valueUrls.map(item => ({
                url: item.url,
                type: item.type
            }))])
        }

    }, [valueUrls])

    useImperativeHandle(ref, () => ({
        clear() {
            setFileList([]);
        },
    }));

    return <>
        {fileList?.length === 0 ? (

            <Dragger {...props} style={{ marginBottom: '20px' }}>
                <p className="ant-upload-drag-icon">
                    <InboxOutlined className="!text-sky-500" />
                </p>
                <p className="ant-upload-text">Thêm ảnh</p>
                <p className="ant-upload-hint">
                    Ấn hoặc kéo thả ảnh vào khu vực này
                </p>
            </Dragger>
        ) : (
            <div className="mb-4">
                <Upload
                    beforeUpload={_ => false}
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={handleImagePreview}
                    onChange={handleImageChange}
                    onRemove={handleRemoveFile}
                    iconRender={(file) => {
                        // Binding
                        if (file.type === MediaType.VIDEO) {
                            console.log(file)
                            return (
                                <video
                                    src={file.url}
                                    className="aspect-square object-cover"
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                    }}
                                />
                            );
                        }

                        const fileObj = file.originFileObj as RcFile;
                        if (fileObj && isValidVideo(fileObj)) {
                            const videoUrl = URL.createObjectURL(fileObj);
                            return (
                                <video
                                    src={videoUrl}
                                    className="aspect-square object-cover"
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                    }}
                                    onLoadedData={() => URL.revokeObjectURL(videoUrl)}
                                />
                            );
                        }

                        return <Image src={file.url} />
                    }}
                >
                    {(fileList?.length ?? 0) >= 8 ? null : <UploadButton />}
                </Upload>
                {previewImage && (
                    <Image
                        wrapperStyle={{ display: 'none' }}
                        preview={{
                            visible: previewImageOpen,
                            onVisibleChange: (visible) => setPreviewImageOpen(visible),
                            afterOpenChange: (visible) => !visible && setPreviewImage(''),
                        }}
                        src={previewImage}
                    />
                )}
            </div>
        )}

        {errorMessage && (
            <div style={{ color: 'red', marginTop: 10 }}>
                {errorMessage}
            </div>
        )}

    </>
});

export default UploadMultipleFile;