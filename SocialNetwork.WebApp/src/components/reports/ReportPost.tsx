import { FC } from "react";
import { ReportResource } from "../../types/report";
import { Link } from "react-router-dom";
import { Avatar, Button, Tooltip } from "antd";
import images from "../../assets";
import PostOtherTags from "../posts/PostOtherTags";
import { formatTime, formatTimeMessage, formatVietnamDate } from "../../utils/date";
import { getPrivacyPost } from "../../utils/post";
import PostMedia from "../posts/PostMedia";
import { GroupResource } from "../../types/group";

type ReportPostProps = {
    report: ReportResource;
    group: GroupResource
    onKeep: () => void;
    onRemove: () => void;
}

const ReportPost: FC<ReportPostProps> = ({
    report,
    group,
    onKeep,
    onRemove
}) => {
    return <div className="p-4 rounded-md shadow bg-white flex flex-col gap-y-4">
        <span className="text-[14px] text-gray-500 border-[1px] p-2">
            <Link className="font-bold hover:underline text-black" to={`/groups/${group.id}/user/${report.reporter.id}`}>{report.reporter.fullName + ' '}</Link>
            đã báo cáo <strong className="text-black">bài viết</strong> này lúc <strong>{formatTimeMessage(new Date(report.dateCreatedAt))} </strong> vì cho rằng: 
            <strong className="text-black">{' ' + report.reason}</strong>
        </span>

        <div className="flex flex-col gap-y-2">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-x-2">
                    {!report.targetPost?.user.haveStory
                        ? <Avatar className="w-10 h-10 flex-shrink-0" src={report.targetPost?.user.avatar ?? images.user} />
                        : <Link className="p-[1px] border-[2px] border-primary rounded-full" to={`/stories/${report.targetPost?.user.id}`}><Avatar className="w-9 h-9 flex-shrink-0" src={report.targetPost?.user.avatar ?? images.user} /> </Link>
                    }

                    <div className="flex flex-col gap-y-[1px]">
                        <div className="font-bold text-[14px] text-gray-600">
                            <Link to={`/profile/${report.targetPost?.user.id}`}>{report.targetPost?.user?.fullName}</Link>
                            {report.targetPost?.tags?.length > 0 &&
                                (() => {
                                    const maxDisplay = 3;
                                    const displayedTags = report.targetPost?.tags.slice(0, maxDisplay);
                                    const remainingTagsCount = report.targetPost?.tags.length - maxDisplay;
                                    const remainingTags = report.targetPost?.tags.slice(maxDisplay)

                                    return (
                                        <>
                                            {' cùng với '}
                                            {displayedTags?.map((tag, index) => (
                                                <Link className="hover:underline" to={`/profile/${tag.user.id}`} key={tag.id}>
                                                    {tag.user.fullName}
                                                    {index < displayedTags.length - 1 ? ', ' : ''}
                                                </Link>
                                            ))}
                                            {remainingTags && <Tooltip title={<PostOtherTags tags={remainingTags} />}>
                                                {remainingTagsCount > 0 && ` và ${remainingTagsCount} người khác`}
                                            </Tooltip>}
                                        </>
                                    );
                                })()}
                        </div>
                        <div className="flex items-center gap-x-2">
                            <Tooltip title={formatVietnamDate(new Date(report.targetPost?.createdAt))}>
                                <span className="text-[13px] font-semibold text-gray-400 hover:underline transition-all ease-linear duration-75">{formatTime(new Date(report.targetPost?.createdAt))}</span>
                            </Tooltip>
                            {getPrivacyPost(report.targetPost?.privacy)}
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-y-3">
                {report.targetPost?.background ? <div style={{
                    background: report.targetPost?.background,
                    width: '100%',
                    height: 380
                }} className="flex items-center justify-center px-6 py-8 rounded-md">
                    <p className="text-2xl font-bold text-center break-words break-all text-white">{report.targetPost?.content}</p>
                </div> : <p className="text-sm text-gray-700 break-words">{report.targetPost?.content}</p>}
                {report.targetPost?.medias.length > 0 && <PostMedia files={report.targetPost?.medias} />}
            </div>
        </div>

        <div className="flex items-center justify-end gap-x-3">
            <Button onClick={onKeep} type="primary">Giữ lại</Button>
            <button onClick={onRemove} className="py-[6px] text-sm px-4 rounded-md hover:bg-gray-200 bg-gray-100">Gỡ bài viết</button>
        </div>
    </div>
};

export default ReportPost;
