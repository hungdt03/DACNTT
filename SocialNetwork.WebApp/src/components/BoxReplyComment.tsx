import { Avatar, Image, Upload, UploadFile, UploadProps } from "antd";
import { FC, useState } from "react";
import { CloseOutlined } from '@ant-design/icons'
import { SendHorizonal } from "lucide-react";
import cn from "../utils/cn";
import images from "../assets";

export type BoxReplyCommentType = {
    files: UploadFile;
    content: string;
}

type BoxReplyCommentProps = {
    onFileChange?: (fileList: UploadFile) => void;
    onRemoveFileUrl?: (url: string | undefined) => void;
    onContentChange?: (content: string) => void;
    onSubmit?: (data: BoxReplyCommentType) => void;
}

const BoxReplyComment: FC<BoxReplyCommentProps> = ({
    onFileChange,
    onRemoveFileUrl,
    onContentChange,
    onSubmit
}) => {

    const [fileList, setFileList] = useState<UploadFile[] | any[]>([]);
    const [content, setContent] = useState<string>('')

    const handleRemoveFile = (file: UploadFile) => {
        const updatedFileList = [...fileList.filter(item => item.uid !== file.uid)]
        setFileList(updatedFileList)
        onRemoveFileUrl?.(file.url)
    }


    const props: UploadProps = {
        name: 'file',
        multiple: false,
        fileList,
        onChange(info) {
            onFileChange?.(info.fileList[0])
            setFileList(info.fileList)
        },
        beforeUpload(_) {
            return false;
        },
        showUploadList: false,

    };

    const handleSubmit = () => {
        onSubmit?.({
            files: fileList[0],
            content
        } as BoxReplyCommentType)
    }

    const handleContentChange = (messageValue: string) => {
        onContentChange?.(messageValue)
        setContent(messageValue)
    }

    return <div className="flex flex-col items-start gap-y-2 mb-2">
        <div className="flex items-center gap-x-2 w-full">
            <Avatar size='small' className="flex-shrink-0" src={images.user} />
            <div className={cn("bg-gray-100 px-1 rounded-3xl w-full flex items-center justify-between py-[2px]")}>
                <input onChange={e => handleContentChange(e.target.value)} className="px-2 flex-1 outline-none border-none bg-gray-100" placeholder="Nhập bình luận" />
                <div className="flex items-center gap-x-2">
                   {fileList.length === 0 &&  <button className="-mb-2">
                        <Upload {...props}>
                            <img alt="upload" className="w-5 h-5" src={images.photo} />
                        </Upload>
                    </button>}
                    <button disabled={!content} onClick={handleSubmit} className="w-9 h-9 flex items-center justify-center p-1 rounded-full hover:bg-sky-100">
                        <SendHorizonal size={24} className="text-sky-600" />
                    </button>
                </div>
            </div>
        </div>

        {fileList.length > 0 && <div className="w-full flex items-center gap-x-2 px-8 py-1">
            <Image.PreviewGroup>
                {fileList.map(file => <div key={file.uid} className="relative">
                    <Image preview={{
                        mask: null
                    }} width='60px' height='60px' className="rounded-lg object-cover border-[1px] border-gray-100" src={URL.createObjectURL(file.originFileObj)} />
                    <button onClick={() => {
                        handleRemoveFile(file);
                    }} className="absolute -top-2 -right-2 bg-red-400 shadow p-2 w-4 h-4 flex items-center justify-center rounded-full">
                        <CloseOutlined className="text-[10px] text-white font-bold" />
                    </button>
                </div>)}
            </Image.PreviewGroup>
        </div>}
    </div>
};

export default BoxReplyComment;
