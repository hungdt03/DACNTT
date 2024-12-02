import { Image, Upload, UploadFile, UploadProps } from "antd";
import { InboxOutlined } from '@ant-design/icons'
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { FileType, getBase64 } from "../../utils/file";
import UploadButton from "./UploadButton";


type UploadMultipleFileProps = {
    onChange?: (fileList: UploadFile[]) => void;
    valueUrls?: string[];
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

    const handleImagePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as FileType);
        }

        setPreviewImage(file.url ?? (file.preview as string));
        setPreviewImageOpen(true);
    };

    const handleImageChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
        onChange?.(newFileList)
        setFileList(newFileList)
    }

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
            onChange?.(info.fileList)
            setFileList(info.fileList)
        },
        onRemove: handleRemoveFile,
        beforeUpload(_) {
            return false;
        }
    };

    useEffect(() => {
        if (valueUrls) {
            setFileList([...valueUrls.map(item => ({
                url: item
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
                    beforeUpload={() => false}
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={handleImagePreview}
                    onChange={handleImageChange}
                    onRemove={handleRemoveFile}
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
    </>
});

export default UploadMultipleFile;