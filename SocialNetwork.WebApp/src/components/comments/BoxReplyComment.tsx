import { Avatar, Image, Popover, Upload, UploadFile, UploadProps } from "antd";
import { FC, useEffect, useRef, useState } from "react";
import { CloseOutlined } from '@ant-design/icons'
import { CameraIcon, SendHorizonal } from "lucide-react";
import cn from "../../utils/cn";
import images from "../../assets";
import { useSelector } from "react-redux";
import { selectAuth } from "../../features/slices/auth-slice";
import { isVideo } from "../medias/utils";

export type BoxReplyCommentType = {
    file: UploadFile;
    content: string;
}

type BoxReplyCommentProps = {
    onFileChange?: (fileList: UploadFile) => void;
    onRemoveFileUrl?: (url: string | undefined) => void;
    onContentChange?: (content: string) => void;
    replyToUsername?: string;
    onSubmit?: (data: BoxReplyCommentType) => void;
    value?: string;
    files?: UploadFile[];
}

const BoxReplyComment: FC<BoxReplyCommentProps> = ({
    onFileChange,
    onRemoveFileUrl,
    onContentChange,
    onSubmit,
    value = '',
    replyToUsername,
    files = []
}) => {

    const [fileList, setFileList] = useState<UploadFile[] | any[]>(files);
    const [content, setContent] = useState<string>(value)
    const { user } = useSelector(selectAuth)
    const [isMentioning, setIsMentioning] = useState(false);

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
            file: fileList[0],
            content
        } as BoxReplyCommentType)

        setContent('')
        setFileList([])
    }

    const handleContentChange = (messageValue: string) => {
        console.log(messageValue)
        setContent(messageValue)
        onContentChange?.(messageValue)

        if (messageValue.includes('@')) {
            setIsMentioning(true);
        } else {
            setIsMentioning(false);
        }
    }


    return <div className="flex flex-col items-start gap-y-2 mb-2">
        <div className="flex items-center gap-x-2 w-full">
            <Avatar size='small' className="flex-shrink-0" src={user?.avatar ?? images.user} />
            <div className={cn("bg-gray-100 px-1 rounded-3xl w-full flex items-center justify-between py-[2px]")}>

                {/* <input onChange={e => handleContentChange(e.target.value)} value={content} className="px-2 flex-1 outline-none border-none bg-gray-100" placeholder="Nhập bình luận" /> */}
                <div className="relative px-2 flex-1 flex gap-x-1 flex-wrap outline-none border-none bg-gray-100" onInput={e => handleContentChange(e.currentTarget.innerText)} contentEditable style={{ backgroundColor: 'transparent' }}>
                    <span contentEditable={false}>
                        <button className="py-[1px] bg-gray-300 text-sm">{replyToUsername}</button>
                    </span>
                    <span contentEditable>
                        {/* Nội dung bình luận được gõ tại đây */}
                    </span>

                    {isMentioning && <div className="absolute top-10 w-[200px] h-[300px] bg-white shadow-lg">
                        </div>}
                </div>
                <div className="flex items-center gap-x-2 py-1 px-1">
                    {fileList.length === 0 && <button className="-mb-2">
                        <Upload {...props}>
                            <div className="p-1 rounded-full bg-gray-400">
                                <CameraIcon className="text-white" size={16} strokeWidth={2} />
                            </div>
                        </Upload>
                    </button>}
                    <button disabled={!content && fileList.length === 0} onClick={handleSubmit} className="w-7 h-7 flex items-center justify-center p-1 rounded-full hover:bg-sky-100">
                        <SendHorizonal size={18} className="text-sky-500" />
                    </button>
                </div>
            </div>
        </div>

        {fileList.length > 0 && <div className="w-full flex items-center gap-x-2 px-8 py-1">
            {fileList.map(file => <div key={file.uid} className="relative">
                {isVideo(file.name) ?
                    <video
                        src={URL.createObjectURL(file.originFileObj)}
                        className="w-[60px] h-[60px] object-cover"
                        controls
                    />
                    : <Image preview={{
                        mask: null
                    }} width='60px' height='60px' className="rounded-lg object-cover border-[1px] border-gray-100" src={URL.createObjectURL(file.originFileObj)} />}
                <button onClick={() => {
                    handleRemoveFile(file);
                }} className="absolute -top-2 -right-2 bg-red-400 shadow p-2 w-4 h-4 flex items-center justify-center rounded-full">
                    <CloseOutlined className="text-[10px] text-white font-bold" />
                </button>
            </div>)}
        </div>}
    </div>
};

export default BoxReplyComment;
