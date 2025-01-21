import { FC, useState } from "react";
import CreateStorySidebar from "../components/story/editors/CreateStorySidebar";
import CreateStoryOption from "../components/story/editors/CreateStoryOption";
import StoryTextPreview from "../components/story/editors/StoryTextPreview";
import dataBackgroundStory from '../data/data-background-story.json'
import StoryImageEditor from "../components/story/editors/StoryImageEditor";
import { StoryType } from "../enums/story-type.";
import { PrivacyType } from "../enums/privacy";
import storyService from "../services/storyService";
import { message } from "antd";
import Loading from "../components/Loading";
import { useNavigate } from "react-router-dom";

export type StoryOption = 'text' | 'image' | undefined;

export type StoryRequest = {
    content?: string;
    background: string;
    fontFamily?: string;
    type: StoryType;
    privacy: PrivacyType;
}

const CreateStoryPage: FC = () => {
    const [option, setOption] = useState<StoryOption>(undefined);
    const [background, setBackground] = useState<string>(dataBackgroundStory[0].background)
    const [fontFamily, setFontFamily] = useState<string>('');
    const [content, setContent] = useState<string>('');
    const [image, setImage] = useState<File>();
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()

    const handleCreateStory = async () => {
        const payload: StoryRequest = {
            background,
            content,
            fontFamily,
            privacy: PrivacyType.PUBLIC,
            type: StoryType.STORY_TEXT
        };

        setLoading(true)
        const response = await storyService.createStory(payload);
        setLoading(false)
        if(response.isSuccess) {
            message.success(response.message)
            navigate('/')
        } else {
            message.error(response.message)
        }
    }

    const handleCreateStoryImage = async (backgroundUrl: string) => {
        const payload: StoryRequest = {
            background: backgroundUrl,
            privacy: PrivacyType.PUBLIC,
            type: StoryType.STORY_IMAGE
        };

        setLoading(true)
        const response = await storyService.createStory(payload);
        setLoading(false)
        if(response.isSuccess) {
            navigate('/')
            message.success(response.message)
        } else {
            message.error(response.message)
        }
    }

    return <div className="h-screen w-screen grid grid-cols-12 gap-4">
        {loading && <Loading />}
        <div className="col-span-3">
            <CreateStorySidebar 
                onSubmit={() => handleCreateStory()} 
                onFontFamilySelect={(fontFamily) => setFontFamily(fontFamily)} 
                onSelectBackground={(background: string) => setBackground(background)} 
                content={content} 
                onChange={(value) => setContent(value)} 
                option={option}
            />
        </div>
        <div className="col-span-9 flex items-center justify-center">
            {!option && <CreateStoryOption
                onImage={(fileImage) => {
                    setOption('image')
                    setImage(fileImage)
                }}
                onText={() => setOption('text')}
            />}

            {option === 'text' && <StoryTextPreview fontFamily={fontFamily} background={background} content={content} />}
            {option === 'image' && image && <StoryImageEditor onFinish={handleCreateStoryImage} fileImage={URL.createObjectURL(image)} />}
        </div>

    </div>
};

export default CreateStoryPage;
