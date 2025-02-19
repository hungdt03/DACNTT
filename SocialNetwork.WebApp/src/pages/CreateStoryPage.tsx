import { FC, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import CreateStorySidebar from "../components/story/editors/CreateStorySidebar";
import CreateStoryOption from "../components/story/editors/CreateStoryOption";
import StoryTextPreview from "../components/story/editors/StoryTextPreview";
import Loading from "../components/Loading";
import dataBackgroundStory from '../data/data-background-story.json';
import { PrivacyType } from "../enums/privacy";
import storyService from "../services/storyService";
import { StoryType } from "../enums/story-type.";
import CropperImageEditor from "../components/story/editors/CropperImageEditor";
import useTitle from "../hooks/useTitle";

export type StoryOption = "text" | "image" | undefined;
export type StoryRequest = {
    background: string;
    fontFamily: string;
    content: string;
    privacy: PrivacyType
}

const CreateStoryPage: FC = () => {
    useTitle('Tạo tin mới')
    const [option, setOption] = useState<StoryOption>(undefined);
    const [image, setImage] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [openTool, setOpenTool] = useState(false);

    const [storyData, setStoryData] = useState<StoryRequest>({
        background: dataBackgroundStory[0].background,
        fontFamily: "",
        content: "",
        privacy: PrivacyType.PUBLIC,
    });

    const navigate = useNavigate();

    const handleCreateStory = useCallback(async (type: StoryType, backgroundUrl?: string) => {
        setLoading(true);
        const payload = {
            ...storyData,
            background: backgroundUrl ?? storyData.background,
            type,
        };

        const response = await storyService.createStory(payload);
        setLoading(false);

        if (response.isSuccess) {
            message.success(response.message);
            navigate("/");
        } else {
            message.error(response.message);
        }
    }, [storyData, navigate]);

    return (
        <div className="h-screen w-screen grid grid-cols-12 gap-4 overflow-hidden">
            {loading && <Loading />}

            {/* Sidebar chỉnh sửa story */}
            <div className="lg:col-span-4 xl:col-span-3 lg:block hidden">
                <CreateStorySidebar
                    onSubmit={() => handleCreateStory(StoryType.STORY_TEXT)}
                    onFontFamilySelect={(fontFamily) => setStoryData(prev => ({ ...prev, fontFamily }))}
                    onSelectBackground={(background) => setStoryData(prev => ({ ...prev, background }))}
                    onPrivacySelect={(privacy) => setStoryData(prev => ({ ...prev, privacy }))}
                    content={storyData.content}
                    onChange={(value) => setStoryData(prev => ({ ...prev, content: value }))}
                    option={option}
                    isOpenTool={openTool}
                    onCloseTool={() => setOpenTool(false)}
                />
            </div>

            {/* Nội dung chính */}
            <div className="lg:col-span-8 xl:col-span-9 col-span-12 flex items-center justify-center">
                {!option && (
                    <CreateStoryOption
                        onImage={(file) => {
                            setOption("image");
                            setImage(file);
                        }}
                        onText={() => setOption("text")}
                    />
                )}

                {option === "text" && (
                    <StoryTextPreview 
                        onOpenTool={() => setOpenTool(true)} 
                        fontFamily={storyData.fontFamily} 
                        background={storyData.background} 
                        content={storyData.content} 
                    />
                )}

                {option === "image" && image && (
                    <CropperImageEditor
                        fileImage={URL.createObjectURL(image)}
                        onFinish={(backgroundUrl) => handleCreateStory(StoryType.STORY_IMAGE, backgroundUrl)}
                    />
                )}
            </div>
        </div>
    );
};

export default CreateStoryPage;
