import { Avatar, Image, Upload, UploadFile, UploadProps } from "antd";
import { FC, useEffect, useState } from "react";
import { CloseOutlined } from '@ant-design/icons'
import { SendHorizonal } from "lucide-react";
import cn from "../../utils/cn";
import images from "../../assets";
import { useSelector } from "react-redux";
import { selectAuth } from "../../features/slices/auth-slice";
import { isVideo } from "../medias/utils";

export type BoxCommentType = {
    file: UploadFile;
    content: string;
}

type BoxSendCommentProps = {
    onFileChange?: (fileList: UploadFile) => void;
    onRemoveFileUrl?: (url: string | undefined) => void;
    onContentChange?: (content: string) => void;
    onSubmit?: (data: BoxCommentType) => void;
    value?: string;
    files?: UploadFile[]
}

const BoxSendComment: FC<BoxSendCommentProps> = ({
    onFileChange,
    onRemoveFileUrl,
    onContentChange,
    onSubmit,
    value = '',
    files = []
}) => {

    const [fileList, setFileList] = useState<UploadFile[] | any[]>(files);
    const [content, setContent] = useState<string>(value)
    const { user } = useSelector(selectAuth)

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
        } as BoxCommentType)

        setFileList([])
        setContent('')
    }

    const handleContentChange = (messageValue: string) => {
        setContent(messageValue)
        onContentChange?.(messageValue)
    }

    useEffect(() => {
        setContent(value)
    }, [value])

    useEffect(() => {
       setFileList(files)
    }, [files])

    return <div className="flex flex-col items-start gap-y-2">
        <div className="flex items-center gap-x-4 w-full">
            <Avatar size='default' className="flex-shrink-0" src={user?.avatar ?? images.user} />

            <div className={cn("bg-gray-100 px-1 rounded-3xl w-full flex items-center justify-between py-[2px]")}>

                <input value={content} onChange={e => handleContentChange(e.target.value)} className="px-2 flex-1 outline-none border-none bg-gray-100" placeholder="Nhập bình luận" />
                <div className="flex items-center gap-x-2">
                    {fileList.length === 0 && <button className="-mb-2">
                        <Upload {...props}>
                            <img alt="upload" className="w-5 h-5" src={images.photo} />
                        </Upload>
                    </button>}
                    <button disabled={!content && fileList.length === 0} onClick={handleSubmit} className="w-9 h-9 flex items-center justify-center p-1 rounded-full hover:bg-sky-100">
                        <SendHorizonal size={24} className="text-sky-600" />
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

export default BoxSendComment;
