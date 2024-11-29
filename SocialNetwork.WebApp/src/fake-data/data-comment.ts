import { Comment } from "../types/comment";

const comments: Comment[] = [
    {
        id: 1,
        content: "Mình đã phát cơm tró hôm qua, các bạn thấy sao?",
        user: "Bùi Việt",
        createdAt: "1 giờ trước",
        commentParentId: null,
        children: [
            {
                id: 2,
                content: "Haha, mình không dám xem vì sợ bị tổn thương.",
                user: "Nguyễn Thảo",
                createdAt: "30 phút trước",
                commentParentId: 1,
                children: [
                    {
                        id: 3,
                        content: "Thế thì để mình phát cơm tró lần nữa cho bạn xem nha! 😄",
                        user: "Bùi Việt",
                        createdAt: "15 phút trước",
                        commentParentId: 2,
                    },
                    {
                        id: 31,
                        content: "Thế thì để mình phát cơm tró lần nữa cho bạn xem nha! 😄",
                        user: "Bùi Việt",
                        createdAt: "15 phút trước",
                        commentParentId: 2,
                    },
                    {
                        id: 32,
                        content: "Thế thì để mình phát cơm tró lần nữa cho bạn xem nha! 😄",
                        user: "Bùi Việt",
                        createdAt: "15 phút trước",
                        commentParentId: 2,
                    },
                    {
                        id: 34,
                        content: "Thế thì để mình phát cơm tró lần nữa cho bạn xem nha! 😄",
                        user: "Bùi Việt",
                        createdAt: "15 phút trước",
                        commentParentId: 2,
                    },

                ],
            },
            {
                id: 23,
                content: "Haha, mình không dám xem vì sợ bị tổn thương. Haha, mình không dám xem vì sợ bị tổn thương.Haha, mình không dám xem vì sợ bị tổn thương.Haha, mình không dám xem vì sợ bị tổn thương.Haha, mình không dám xem vì sợ bị tổn thương.Haha, mình không dám xem vì sợ bị tổn thương.Haha, mình không dám xem vì sợ bị tổn thương.Haha, mình không dám xem vì sợ bị tổn thương.Haha, mình không dám xem vì sợ bị tổn thương.Haha, mình không dám xem vì sợ bị tổn thương.Haha, mình không dám xem vì sợ bị tổn thương.Haha, mình không dám xem vì sợ bị tổn thương.Haha, mình không dám xem vì sợ bị tổn thương.Haha, mình không dám xem vì sợ bị tổn thương.Haha, mình không dám xem vì sợ bị tổn thương.",
                user: "Nguyễn Thảo",
                createdAt: "30 phút trước",
                commentParentId: 1,
            },
            {
                id: 24,
                content: "Haha, mình không dám xem vì sợ bị tổn thương.",
                user: "Nguyễn Thảo",
                createdAt: "30 phút trước",
                commentParentId: 1,
            },
            {
                id: 25,
                content: "Haha, mình không dám xem vì sợ bị tổn thương.",
                user: "Nguyễn Thảo",
                createdAt: "30 phút trước",
                commentParentId: 1,
            }
        ],
    },
    {
        id: 4,
        content: "Cơm tró hôm nay ngon không mọi người?",
        user: "Ngọc Lan",
        createdAt: "2 giờ trước",
        commentParentId: null,
        children: [],
    },
    {
        id: 5,
        content: "Trời hôm nay nóng thật, các bạn uống đủ nước nhé!",
        user: "Minh Hằng",
        createdAt: "3 giờ trước",
        commentParentId: null,
        children: [
            {
                id: 6,
                content: "Mình đã uống nước nhưng vẫn thấy khát 😅.",
                user: "Đăng Khoa",
                createdAt: "2 giờ 30 phút trước",
                commentParentId: 5,
            },
        ],
    },
    {
        id: 7,
        content: "Có ai muốn đi phượt cuối tuần này không?",
        user: "Thanh Tùng",
        createdAt: "5 giờ trước",
        commentParentId: null,
        children: [
            {
                id: 8,
                content: "Mình muốn đi nhưng chưa biết điểm đến.",
                user: "Lan Hương",
                createdAt: "4 giờ 45 phút trước",
                commentParentId: 7,
                children: [
                    {
                        id: 9,
                        content: "Sao không thử đi Đà Lạt? Khí hậu mát mẻ lắm!",
                        user: "Thanh Tùng",
                        createdAt: "4 giờ 30 phút trước",
                        commentParentId: 8,
                    },
                ],
            },
        ],
    },
    {
        id: 10,
        content: "Có ai đang làm bài tập nhóm không? Mình cần giúp đỡ.",
        user: "Hải Nam",
        createdAt: "6 giờ trước",
        commentParentId: null,
        children: [],
    },
    {
        id: 11,
        content: "Hôm nay có phim hay chiếu ngoài rạp không nhỉ?",
        user: "Mai Lan",
        createdAt: "7 giờ trước",
        commentParentId: null,
        children: [
            {
                id: 12,
                content: "Phim mới của Marvel đó, nghe nói khá hay!",
                user: "Anh Quân",
                createdAt: "6 giờ 30 phút trước",
                commentParentId: 11,
            },
        ],
    },
    {
        id: 13,
        content: "Mình mới học nấu món bánh xèo, mọi người có thích không?",
        user: "Thu Phương",
        createdAt: "8 giờ trước",
        commentParentId: null,
        children: [
            {
                id: 14,
                content: "Thích chứ, mình muốn thử món bánh xèo của bạn!",
                user: "Văn Hùng",
                createdAt: "7 giờ 45 phút trước",
                commentParentId: 13,
            },
        ],
    },
    {
        id: 15,
        content: "Mọi người có biết tiệm sửa xe tốt nào không?",
        user: "Duy Anh",
        createdAt: "10 giờ trước",
        commentParentId: null,
        children: [
            {
                id: 16,
                content: "Có tiệm ở gần trường mình, sửa khá nhanh.",
                user: "Hoài An",
                createdAt: "9 giờ 30 phút trước",
                commentParentId: 15,
                children: [
                    {
                        id: 17,
                        content: "Bạn có thể cho mình địa chỉ cụ thể được không?",
                        user: "Duy Anh",
                        createdAt: "9 giờ 15 phút trước",
                        commentParentId: 16,
                    },
                ],
            },
        ],
    },
];


export { comments }