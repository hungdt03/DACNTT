import { FC } from "react";
import { ImageProps } from "./ImageProps";
import OneImage from "./OneImage";
import TwoImage from "./TwoImage";
import ThreeImage from "./ThreeImage";
import FourImage from "./FourImage";
import FiveImage from "./FiveImage";
import MoreThanFiveImage from "./MoreThanFiveImage";
import { Image } from "antd";

const PostImage: FC<ImageProps> = ({
    items
}) => {
    let ImageComponent = OneImage;
    switch (items.length) {
        case 1:
            ImageComponent = OneImage;
            break;
        case 2:
            ImageComponent = TwoImage;
            break;
        case 3:
            ImageComponent = ThreeImage;
            break;

        case 4:
            ImageComponent = FourImage;
            break;
        case 5:
            ImageComponent = FiveImage;
            break;
        default:
            ImageComponent = MoreThanFiveImage;
            break;
    }

    return <Image.PreviewGroup>
        <ImageComponent items={items} />
    </Image.PreviewGroup>
};

export default PostImage;