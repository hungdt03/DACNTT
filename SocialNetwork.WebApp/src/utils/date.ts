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

const formatVietnamDate = (date: Date): string => {
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

const formatTimeMessage = (date: Date): string => {
    return date.toTimeString().split(" ")[0];
}

const formatDateStandard = (date: Date): string => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString();

    return `${day}/${month}/${year}`;
};

const formatDateTimeStandard = (date: Date): string => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
};


export { formatTime, formatVietnamDate, formatTimeMessage, formatDateStandard, formatDateTimeStandard };