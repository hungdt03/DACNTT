import { Image, message, Popover, Upload, UploadFile, UploadProps } from "antd";
import { FC, useState } from "react";
import { CloseOutlined } from '@ant-design/icons'
import { CameraIcon, Laugh, SendHorizonal } from "lucide-react";
import cn from "../../utils/cn";
import { isValidImage, isValidVideo } from "../../utils/file";
import { RcFile } from "antd/es/upload";
import data from '@emoji-mart/data'; // Dữ liệu emoji được bundled
import Picker from '@emoji-mart/react';

export const FILE_IMAGE_MAX_SIZE_IN_BYTES = 10 * 1024 * 1024;

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
            const isValidFile = (file: UploadFile) => {
                return isValidImage(file.originFileObj as File) || isValidVideo(file.originFileObj as File);
            };

            const invalidFile = info.fileList.find(file => !isValidFile(file));

            if (invalidFile) {
                message.error('Vui lòng chọn tệp ảnh hoặc video hợp lệ!');
                return;
            }

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
        const isValidFile = (file: UploadFile) => {
            return isValidImage(file.originFileObj as File) || isValidVideo(file.originFileObj as File);
        };

        const totalSize = state.files.reduce((acc, file) => acc + (file.originFileObj as File).size, 0);
        const invalidFile = state.files.find(file => !isValidFile(file));

        if (invalidFile) {
            message.error('Vui lòng chọn tệp ảnh hoặc video hợp lệ!');
            return;
        } else if (totalSize > FILE_IMAGE_MAX_SIZE_IN_BYTES) {
            message.error('Vui lòng chỉ chọn tối đa 10MB');
            return;
        }

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

    const handleEmojiSelect = (emoji: { native: string }) => {
        const updateState: BoxMessageType = {
            ...state,
            content: state.content + emoji.native
        }

        setState(updateState)
        onChange?.(updateState)
    };

    return <div className="flex items-center gap-x-2">
        <div className="flex-shrink-0 -mb-2">
            <Upload {...props}>
                <div className="p-1 rounded-full bg-gray-400 hover:bg-gray-500 cursor-pointer">
                    <CameraIcon className="text-white" size={16} strokeWidth={2} />
                </div>
            </Upload>
        </div>

        <Popover content={<Picker onEmojiSelect={handleEmojiSelect} theme='light' data={data} />} trigger={'click'}>
            <button className="p-1 rounded-full bg-gray-200 hover:bg-gray-300 cursor-pointer">
                <Laugh size={16} />
            </button>
        </Popover>

        <div className={cn("bg-gray-100 px-1 rounded-3xl w-full overflow-hidden", state.files.length ? 'py-2' : 'py-[2px]')}>
            <div className={cn("flex flex-col items-start overflow-x-hidden", state.files.length > 0 && 'gap-y-1')}>
                <div className="w-full overflow-x-auto custom-scrollbar">
                    {state.files.length > 0 && (
                        <div className="flex items-center flex-wrap gap-2 px-4 py-2 max-h-[100px] overflow-y-auto custom-scrollbar">
                            {state.files.map((file) => {
                                const fileUrl = URL.createObjectURL(file.originFileObj!);
                                const isImage = isValidImage(file as RcFile);
                                const isVideo = isValidVideo(file as RcFile);

                                return (
                                    <div key={file.uid} className="relative">
                                        {isImage ? (
                                            <Image
                                                preview={{ mask: null }}
                                                width="40px"
                                                height="40px"
                                                className="rounded-lg object-cover"
                                                src={fileUrl}
                                            />
                                        ) : isVideo ? (
                                            <video width="40" height="40" className="rounded-lg aspect-square object-cover">
                                                <source src={fileUrl} type={file.type} />
                                            </video>
                                        ) : null}

                                        <button
                                            onClick={() => handleRemoveFile(file)}
                                            className="absolute -top-2 -right-2 bg-red-400 shadow p-2 w-4 h-4 flex items-center justify-center rounded-full"
                                        >
                                            <CloseOutlined className="text-[10px] text-white font-bold" />
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                </div>
                <div className="flex items-center justify-between w-full">

                    <input onFocus={onFocus} value={state.content} onChange={e => handleContentChange(e.target.value)} className="text-sm px-2 flex-1 outline-none border-none bg-gray-100" placeholder="Nhập tin nhắn" />
                    <button disabled={!state.content.trim() && state.files.length === 0} onClick={handleSubmit} className="flex-shrink-0 w-8 h-8 flex items-center justify-center p-1 rounded-full hover:bg-sky-100">
                        <SendHorizonal size={18} className="text-sky-500" />
                    </button>
                </div>
            </div>

        </div>
    </div>
};

export default BoxSendMessage;
