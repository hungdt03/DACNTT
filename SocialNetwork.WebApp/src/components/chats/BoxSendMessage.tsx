import { Image, Upload, UploadFile, UploadProps } from "antd";
import { FC, useState } from "react";
import { CloseOutlined } from '@ant-design/icons'
import images from "../../assets";
import { CameraIcon, SendHorizonal } from "lucide-react";
import cn from "../../utils/cn";

export type BoxMessageType = {
    files: UploadFile<any>[];
    content: string;
}

type BoxSendMessageProps = {
    onSubmit?: () => void;
    onFocus?: () => void;
    onChange?: (value: BoxMessageType) => void;
    value?: string;
}

const BoxSendMessage: FC<BoxSendMessageProps> = ({
    onSubmit,
    onFocus,
    onChange,
    value = ''
}) => {
    const [state, setState] = useState<BoxMessageType>({
        content: value,
        files: []
    })

    const handleRemoveFile = (file: UploadFile) => {
        const updatedFileList = [...state.files.filter(item => item.uid !== file.uid)]
        const updateState: BoxMessageType = {
            ...state,
            files: updatedFileList
        }
        setState(updateState)
        onChange?.(updateState)
    }


    const props: UploadProps = {
        name: 'file',
        multiple: true,
        fileList: state.files,
        onChange(info) {
            const updateState: BoxMessageType = {
                ...state,
                files: info.fileList
            }
            setState(updateState)
            onChange?.(updateState)
        },
        beforeUpload(_) {
            return false;
        },
        showUploadList: false,

    };

    const handleSubmit = () => {
        onSubmit?.()
        setState({
            ...state,
            content: '',
            files: []
        })
    }

    const handleContentChange = (messageValue: string) => {
        const updateState: BoxMessageType = {
            ...state,
            content: messageValue
        }
        setState(updateState)
        onChange?.(updateState)
    }


    return <div className="flex items-center gap-x-2">
        <div className="flex-shrink-0">
            <Upload {...props}>
                <div className="p-1 rounded-full bg-gray-400 hover:bg-gray-500 cursor-pointer">
                    <CameraIcon className="text-white" size={16} strokeWidth={2} />
                </div>
            </Upload>
        </div>

        <div className={cn("bg-gray-100 px-1 rounded-3xl w-full overflow-hidden", state.files.length ? 'py-2' : 'py-[2px]')}>
            <div className={cn("flex flex-col items-start overflow-x-hidden", state.files.length > 0 && 'gap-y-1')}>
                <div className="w-full overflow-x-auto custom-scrollbar">
                    {state.files.length > 0 && <div className="flex items-center gap-x-2 px-4 py-2">
                        <Image.PreviewGroup>
                            {state.files.map(file => <div key={file.uid} className="relative">
                                <Image preview={{
                                    mask: null
                                }} width='40px' height='40px' className="rounded-lg object-cover" src={URL.createObjectURL(file.originFileObj!)} />
                                <button onClick={() => {
                                    handleRemoveFile(file);
                                }} className="absolute -top-2 -right-2 bg-red-400 shadow p-2 w-4 h-4 flex items-center justify-center rounded-full">
                                    <CloseOutlined className="text-[10px] text-white font-bold" />
                                </button>
                            </div>)}
                        </Image.PreviewGroup>
                    </div>}
                </div>
                <div className="flex items-center justify-between w-full">
                    <input onFocus={onFocus} value={state.content} onChange={e => handleContentChange(e.target.value)} className="text-sm px-2 flex-1 outline-none border-none bg-gray-100" placeholder="Nhập tin nhắn" />
                    <button disabled={!state.content && state.files.length === 0} onClick={handleSubmit} className="flex-shrink-0 w-8 h-8 flex items-center justify-center p-1 rounded-full hover:bg-sky-100">
                        <SendHorizonal size={18} className="text-sky-500" />
                    </button>
                </div>
            </div>

        </div>
    </div>
};

export default BoxSendMessage;
