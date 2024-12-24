import { FC } from "react";
import { Story } from "react-insta-stories/dist/interfaces";

type StoryItemProps = {
    items: Story[];
    onClick: () => void
}

const StoryItem: FC<StoryItemProps> = ({
    items,
    onClick
}) => {

    return (
        <div
            onClick={onClick}
            className="rounded-xl relative"
            style={{
                backgroundImage:
                    `url(${items[0].url})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                height: '200px',
            }}
        >
            <div className="absolute top-4 left-4">
                <img className="rounded-full border-[3px] border-blue-500" width='40px' height='40px' src='https://scontent.fdad3-4.fna.fbcdn.net/v/t39.30808-6/415026176_367351105878728_9160707036274657793_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=a5f93a&_nc_eui2=AeGbTEdtGKlVJQfRxu_rzcKHnZQwh6N-P12dlDCHo34_Xe8cD09ZBVMoxXYcWoqKajke466jeewyz7TsDyPhYg5F&_nc_ohc=25CwFZ7wAcsQ7kNvgEwFaj7&_nc_zt=23&_nc_ht=scontent.fdad3-4.fna&_nc_gid=AF91PC9lX5tZGZXKasIQ_S1&oh=00_AYBQzyW6nUOmU6EPNtVMDd85_WX34ls1g_caPIKcCn_zOw&oe=677099E2' />
            </div>
        </div>
    )
};

export default StoryItem;
