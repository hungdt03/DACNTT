const formatTime = (date: Date): string => {
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (seconds < 60) {
        return 'vài giây trước';
    } else if (minutes < 60) {
        return `${minutes} phút trước`;
    } else if (hours < 24) {
        return `${hours} giờ trước`;
    } else if (days < 30) {
        return `${days} ngày trước`;
    } else if (months < 12) {
        return `${months} tháng trước`;
    } else {
        return `${years} năm trước`;
    }
}

const formatVietnamDate = (date: Date) : string => {
    const optionsDate: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    };
    const optionsTime: Intl.DateTimeFormatOptions = {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false, // Định dạng 24 giờ
    };

    // Formatter cho ngày và giờ
    const datePart = new Intl.DateTimeFormat('vi-VN', optionsDate).format(date);
    const timePart = new Intl.DateTimeFormat('vi-VN', optionsTime).format(date);

    // Kết hợp ngày và giờ
    return `${datePart} lúc ${timePart}`;
}

export { formatTime, formatVietnamDate };