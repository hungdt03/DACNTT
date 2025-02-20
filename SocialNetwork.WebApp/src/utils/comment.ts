import { TextNode } from "lexical";
import { NodeContent } from "../components/comments/BoxReplyComment";
import { UserResource } from "../types/user";

export const loadContentEmpty = () =>
    `{
        "root": {
        "children": [
            {
            "children": [
                {
                    "detail": 0,
                    "format": 0,
                    "mode": "normal",
                    "style": "", 
                    "text": "",
                    "type": "text",
                    "version": 1
                }
            ],
            "direction": "ltr",
            "format": "",
            "indent": 0,
            "type": "paragraph",
            "version": 1
            }
        ],
        "direction": "ltr",
        "format": "",
        "indent": 0,
        "type": "root",
        "version": 1
        }
    }`;

export function extractContentAndStyle(data: any): NodeContent[] {
    return data.map((item: any) => {
        if (item.style) {
            const splitStyle = item.style.split(';');
            const userIdPart = splitStyle[0].split(' ')[1];
            const backgroundPart = splitStyle[1].split(' ')[1];

            return {
                id: userIdPart,
                content: item.text,
                style: backgroundPart
            };
        } else {
            return {
                id: '',
                content: item.text,
                style: ''
            };
        }
    });
}


export const loadContent = (user: UserResource) =>
    `{
        "root": {
        "children": [
            {
            "children": [
                {
                    "detail": 0,
                    "format": 0,
                    "mode": "normal",
                    "style": "content: ${user.id};background-color: #E0F2FE;color: #0EA5E9;",
                    "text": "${user.fullName}",
                    "type": "text",
                    "version": 1
                },
                {
                    "detail": 0,
                    "format": 0,
                    "mode": "normal",
                    "style": "", 
                    "text": " ",
                    "type": "text",
                    "version": 1
                }
            ],
            "direction": "ltr",
            "format": "",
            "indent": 0,
            "type": "paragraph",
            "version": 1
            }
        ],
        "direction": "ltr",
        "format": "",
        "indent": 0,
        "type": "root",
        "version": 1
        }
    }`;



// Cấu hình Lexical
export const editorConfig = {
    isEditable: true,
    theme: {
        paragraph: 'text-gray-800 my-2',
    },
    namespace: 'CommentEditor',
    onError: (error: Error) => {
        console.error('Lexical error:', error);
    },
    nodes: [TextNode],
};

