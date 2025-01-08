import { TextNode } from "lexical";

export class CustomTextNode extends TextNode {
    private __dataKey: string;

    constructor(text: string, dataKey: string) {
        super(text);
        this.__dataKey = dataKey;
    }

    static getType(): string {
        return "custom-text";
    }

    static clone(node: CustomTextNode): CustomTextNode {
        return new CustomTextNode(node.__text, node.__dataKey);
    }

    getDataKey(): string {
        return this.__dataKey;
    }

    setDataKey(dataKey: string): void {
        this.__dataKey = dataKey;
    }
}
