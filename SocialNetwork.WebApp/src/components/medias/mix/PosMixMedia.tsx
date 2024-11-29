import { FC } from "react";
import { MixMediaProps } from "./MixMediaProps";
import OneMedia from "./OneMedia";
import TwoMedia from "./TwoMedia";
import ThreeMedia from "./ThreeMedia";
import FourMedia from "./FourMedia";
import FiveMedia from "./FiveMedia";
import MoreThanFiveMedia from "./MoreThanFiveMedia";

const PosMixMedia: FC<MixMediaProps> = ({
    items
}) => {
    switch (items.length) {
        case 1:
            return <OneMedia items={items} />
        case 2:
            return <TwoMedia items={items} />

        case 3:
            return <ThreeMedia items={items} />

        case 4:
            return <FourMedia items={items} />
        case 5:
            return <FiveMedia items={items} />
        default:
            return <MoreThanFiveMedia items={items} />
    }
};

export default PosMixMedia;
