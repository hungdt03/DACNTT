import { Avatar, Image, Upload, UploadFile, UploadProps } from "antd";
import { FC, useEffect, useRef, useState } from "react";
import { CloseOutlined } from '@ant-design/icons'
import { CameraIcon, SendHorizonal } from "lucide-react";
import cn from "../../utils/cn";
import images from "../../assets";
import { useSelector } from "react-redux";
import { selectAuth } from "../../features/slices/auth-slice";
import { isVideo } from "../medias/utils";

import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { $createTextNode, $getRoot, $getSelection, $isRangeSelection, EditorState, LexicalEditor, TextNode } from 'lexical';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { FriendResource } from "../../types/friend";
import friendService from "../../services/friendService";
import { extractContentAndStyle, loadContentEmpty } from "../../utils/comment";


// Cấu hình Lexical
const editorConfig = {
    isEditable: true,
    theme: {
        paragraph: 'text-gray-800 my-2',
    },
    namespace: 'CommentEditor',
    onError: (error: Error) => {
        console.error('Lexical error:', error);
    },
    nodes: [TextNode],
};


export type BoxCommentType = {
    file: UploadFile;
    content: string;
    mentionUserIds: []
}

type BoxSendCommentProps = {
    onSubmit?: (data: BoxCommentType) => void;
}

const BoxSendComment: FC<BoxSendCommentProps> = ({
    onSubmit,
}) => {

    const [fileList, setFileList] = useState<UploadFile[] | any[]>([]);
    const [content, setContent] = useState<string>('')
    const { user } = useSelector(selectAuth)

    const [initialEditorState, setInitialEditorState] = useState<string | null>(null);

    const [suggestedFriends, setSuggestedFriends] = useState<FriendResource[]>([]);
    const [mentionFriends, setMentionFriends] = useState<FriendResource[]>([])
    const [isMentioning, setIsMentioning] = useState(false);
    const editorStateRef = useRef<EditorState | null>(null);
    const editorRef = useRef<LexicalEditor | null>(null);


    useEffect(() => {
        const valueEditorState = loadContentEmpty();
        setInitialEditorState(valueEditorState);
    }, [])

    const handleRemoveFile = (file: UploadFile) => {
        const updatedFileList = [...fileList.filter(item => item.uid !== file.uid)]
        setFileList(updatedFileList)
    }


    const props: UploadProps = {
        name: 'file',
        multiple: false,
        fileList,
        onChange(info) {
            setFileList(info.fileList)
        },
        beforeUpload(_) {
            return false;
        },
        showUploadList: false,

    };

    const handleSubmit = () => {
        if (editorStateRef.current && editorRef.current) {
            const nodeContents = (editorStateRef.current?.toJSON().root.children[0] as any).children
            const mentions = extractContentAndStyle(nodeContents);

            onSubmit?.({
                file: fileList[0],
                content: JSON.stringify(mentions),
                mentionUserIds: mentions.map(item => item.id)
            } as BoxCommentType)

            editorRef.current?.update(() => {
                const nodeRoot = $getRoot();
                nodeRoot.clear()

                const selection = $getSelection();
                if ($isRangeSelection(selection)) {
                    selection.insertNodes([$createTextNode('')])
                }
            })

            setContent('')
            setFileList([])
        }
    }

    const fetchFriendSuggestions = async (fullName: string) => {
        const response = await friendService.getAllFriendsByFullName(fullName);
        if (response.isSuccess) {
            setSuggestedFriends(response.data)
        }
    }

    const replaceHighlightUsers = (content: string, mentionFriends: FriendResource[]): string => {
        mentionFriends.forEach(friend => {
            content = content.replace(`@${friend.fullName}`, '');
        });
        return content;
    };

    const extractLastMention = (text: string): string | null => {
        const words = text.split(" ");

        for (let i = words.length - 1; i >= 0; i--) {
            const word = words[i];

            if (word.startsWith("@") && word.length > 1 && word[1] !== " ") {
                return word.slice(1);
            }
        }

        return null;
    };


    const onChange = (editorState: EditorState, editor: LexicalEditor): void => {
        editorStateRef.current = editorState;
        editorRef.current = editor;

        editorState.read(() => {
            const editorRoot = $getRoot();
            setContent(editorRoot.getTextContent());

            const textBeforeCursor = replaceHighlightUsers(editorRoot.getTextContent(), mentionFriends);
            const mentionText = extractLastMention(textBeforeCursor);
            if (mentionText) {
                if (mentionText.trim().includes(" ")) {
                    setIsMentioning(false);
                    return;
                }

                fetchFriendSuggestions(mentionText);
                setIsMentioning(true);
            } else {
                setIsMentioning(false);
            }
        });
    }

    const handleSelectFriend = (friend: FriendResource) => {
        if (editorRef.current) {
            editorRef.current.update(() => {
                const editorRoot = $getRoot();
                const selection = $getSelection();


                if ($isRangeSelection(selection)) {
                    // Lấy vị trí con trỏ hiện tại

                    const textBeforeSelection = '@' + extractLastMention(editorRoot.getTextContent());
                    if (textBeforeSelection) {
                        selection.getNodes().forEach((node) => {
                            if (node instanceof TextNode) {
                                const index = node.getTextContent().lastIndexOf(textBeforeSelection)
                                const newContent = node.getTextContent().substring(0, index);
                                node.setTextContent(newContent);
                            }
                        });

                    }
                    const mentionNode = $createTextNode(`${friend.fullName}`);
                    const newStyle = `content: ${friend.id};background-color: #E0F2FE;color: #0EA5E9;`
                    mentionNode.setStyle(newStyle);
                    // Thêm text tại vị trí con trỏ

                    selection.insertNodes([mentionNode]);
                    const spaceNode = $createTextNode(" ");
                    selection.insertNodes([spaceNode]);

                }
            });
        }

        setIsMentioning(false)
    }


    return <div className="flex flex-col items-start gap-y-2">
        <div className="flex items-center gap-x-4 w-full">
            <div className="relative">
                <Avatar className="flex-shrink-0 w-[25px] h-[25px] sm:w-[35px] sm:h-[35px]" src={user?.avatar ?? images.user} />
                <div className="absolute -bottom-1 right-0 p-1 rounded-full border-[2px] border-white bg-green-500"></div>
            </div>

            <div className={cn("bg-gray-100 px-1 rounded-xl w-full flex items-center justify-between sm:py-[2px]")}>

                {initialEditorState &&
                    <LexicalComposer initialConfig={{
                        ...editorConfig,
                        editorState: initialEditorState
                    }}>
                        <div className="w-full relative">
                            <RichTextPlugin
                                contentEditable={<ContentEditable
                                    className="w-full min-h-[30px] border-none outline-none px-4 z-0"
                                />}
                                placeholder={
                                    <p className="text-xs md:text-sm line-clamp-1 text-gray-400 absolute top-1/2 left-4 -translate-y-1/2 z-10 pointer-events-none">
                                        Nhập bình luận...
                                    </p>
                                }
                                ErrorBoundary={LexicalErrorBoundary}
                            />
                            <OnChangePlugin onChange={onChange} />
                            <HistoryPlugin />
                        </div>
                    </LexicalComposer>}

                {isMentioning && suggestedFriends.length > 0 && (
                    <div className="absolute top-full z-10 bg-white border p-2 rounded-md shadow-lg mt-1">
                        {suggestedFriends.map((friend) => (
                            <div onClick={() => handleSelectFriend(friend)} key={friend.id} className="flex items-center gap-2 p-1 cursor-pointer hover:bg-gray-200">
                                <Avatar src={friend.avatar} size="small" />
                                <span>{friend.fullName}</span>
                            </div>
                        ))}
                    </div>
                )}
                <div className="flex items-center gap-x-2 py-1 px-1">
                    {fileList.length === 0 && <button className="-mb-2">
                        <Upload {...props}>
                            <div className="p-1 rounded-full bg-gray-400">
                                <CameraIcon className="text-white" size={16} strokeWidth={2} />
                            </div>
                        </Upload>
                    </button>}
                    <button disabled={!content.trim() && fileList.length === 0} onClick={handleSubmit} className="w-7 h-7 flex items-center justify-center p-1 rounded-full hover:bg-sky-100">
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

export default BoxSendComment;
