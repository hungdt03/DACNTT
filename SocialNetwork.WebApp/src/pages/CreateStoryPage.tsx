import { FC } from "react";
import ImageEditor from "../components/story/ImageEditor";

const CreateStoryPage: FC = () => {
    return  <div className="h-screen overflow-hidden">
        <ImageEditor imageUrl={'https://scontent.fdad3-1.fna.fbcdn.net/v/t39.30808-6/471419505_1021173453388566_5824609632911878772_n.jpg?_nc_cat=1&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeGnlWWSAxdoOiypsYFI1Af47sUoL3BEbqLuxSgvcERuopiFu0lrk58kd250YjAV6JS15dxHNpSrtCdPTz6MsQt3&_nc_ohc=kHk6lNijxH8Q7kNvgGEwLHV&_nc_zt=23&_nc_ht=scontent.fdad3-1.fna&_nc_gid=APbugHTEDbgBzCoAVt-Nx2t&oh=00_AYBcuMVW6LrtbldCwyYImy6G8PqdA8MWwT7chc_5XWRN4Q&oe=67709B5C'} />
    </div>
};

export default CreateStoryPage;
