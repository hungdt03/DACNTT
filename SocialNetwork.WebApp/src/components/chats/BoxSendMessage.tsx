import { Image, Upload, UploadFile, UploadProps } from "antd";
import { FC, useEffect, useState } from "react";
import { CloseOutlined } from '@ant-design/icons'
import images from "../../assets";
import { SendHorizonal } from "lucide-react";
import cn from "../../utils/cn";

export type BoxMessageType = {
    files: UploadFile[];
    content: string;
}

type BoxSendMessageProps = {
    onFileChange?: (fileList: UploadFile[]) => void;
    onRemoveFileUrl?: (url: string | undefined) => void;
    onContentChange?: (content: string) => void;
    onSubmit?: () => void;
    value?: string;
    files?: UploadFile[]
}

const BoxSendMessage: FC<BoxSendMessageProps> = ({
    onFileChange,
    onRemoveFileUrl,
    onContentChange,
    onSubmit,
    value = '',
    files = []
}) => {

    const [fileList, setFileList] = useState<UploadFile[] | any[]>(files);
    const [content, setContent] = useState<string>(value)

    const handleRemoveFile = (file: UploadFile) => {
        const updatedFileList = [...fileList.filter(item => item.uid !== file.uid)]
        setFileList(updatedFileList)
        onRemoveFileUrl?.(file.url)
    }


    const props: UploadProps = {
        name: 'file',
        multiple: true,
        fileList,
        onChange(info) {
            onFileChange?.(info.fileList)
            setFileList(info.fileList)
        },
        beforeUpload(_) {
            return false;
        },
        showUploadList: false,

    };

    const handleSubmit = () => {
        onSubmit?.()
    }

    const handleContentChange = (messageValue: string) => {
        onContentChange?.(messageValue)
        setContent(messageValue)
    }


    return <div className="flex items-center gap-x-2">
        <div className="flex-shrink-0">
            <Upload {...props}>
                <img alt="upload" className="w-6 h-6" src={images.photo} />
            </Upload>
        </div>

        <div className={cn("bg-gray-100 px-1 rounded-3xl w-full flex items-center justify-between", fileList.length ? 'py-2' : 'py-[2px]')}>
            <div className="flex flex-col gap-y-1">
                {fileList.length > 0 && <div className="w-full flex items-center gap-x-2 px-4 py-1">
                    <Image.PreviewGroup>
                        {fileList.map(file => <div key={file.uid} className="relative">
                            <Image preview={{
                                mask: null
                            }} width='40px' height='40px' className="rounded-lg object-cover" src={URL.createObjectURL(file.originFileObj)} />
                            <button onClick={() => {
                                handleRemoveFile(file); 
                            }} className="absolute -top-2 -right-2 bg-red-400 shadow p-2 w-4 h-4 flex items-center justify-center rounded-full">
                                <CloseOutlined className="text-[10px] text-white font-bold" />
                            </button>
                        </div>)}
                    </Image.PreviewGroup>
                </div>}
                <input onChange={e => handleContentChange(e.target.value)} className="text-sm px-2 flex-1 outline-none border-none bg-gray-100" placeholder="Nhập tin nhắn" />
            </div>
            <button disabled={!content} onClick={handleSubmit} className="w-8 h-8 flex items-center justify-center p-1 rounded-full hover:bg-sky-100">
                <SendHorizonal size={18} className="text-sky-600" />
            </button>
        </div>
    </div>
};

export default BoxSendMessage;
