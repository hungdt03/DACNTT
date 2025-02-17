import React, { useState } from 'react';
import data from '@emoji-mart/data'; // Dữ liệu emoji được bundled
import Picker from '@emoji-mart/react';

const EmojiPickerComponent: React.FC = () => {
    // State để lưu emoji đã chọn
    const [selectedEmoji, setSelectedEmoji] = useState<string>('');

    // Hàm xử lý khi chọn emoji
    const handleEmojiSelect = (emoji: { native: string }) => {
        setSelectedEmoji(emoji.native); // Cập nhật emoji đã chọn
    };

    return (
        <div>
            <h3>Chọn emoji</h3>
            <Picker data={data} onEmojiSelect={handleEmojiSelect} />
            <div>
                <h4>Emoji đã chọn:</h4>
                <p>{selectedEmoji}</p>
            </div>
        </div>
    );
};

export default EmojiPickerComponent;
