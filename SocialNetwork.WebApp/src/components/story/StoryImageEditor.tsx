import { FC, useRef, useState } from "react";

// react-pintura
import { PinturaEditor } from "@pqina/react-pintura";

// pintura
import "@pqina/pintura/pintura.css";
import {
    // editor

    locale_en_gb,
    createDefaultImageReader,
    createDefaultImageWriter,
    createDefaultShapePreprocessor,

    // plugins
    setPlugins,
    plugin_crop,
    plugin_crop_locale_en_gb,
    plugin_finetune,
    plugin_finetune_locale_en_gb,
    plugin_finetune_defaults,
    plugin_filter,
    plugin_filter_locale_en_gb,
    plugin_filter_defaults,
    plugin_annotate,
    plugin_annotate_locale_en_gb,
    markup_editor_defaults,
    markup_editor_locale_en_gb,
} from "@pqina/pintura";
import { uploadImage } from "../../services/cloudinary";

setPlugins(plugin_crop, plugin_finetune, plugin_filter, plugin_annotate);


const editorDefaults = {
    imageReader: createDefaultImageReader(),
    imageWriter: createDefaultImageWriter(),
    shapePreprocessor: createDefaultShapePreprocessor(),
    ...plugin_finetune_defaults,
    ...plugin_filter_defaults,
    ...markup_editor_defaults,
    locale: {
        ...locale_en_gb,
        ...plugin_crop_locale_en_gb,
        ...plugin_finetune_locale_en_gb,
        ...plugin_filter_locale_en_gb,
        ...plugin_annotate_locale_en_gb,
        ...markup_editor_locale_en_gb,
    },
};

type StoryImageEditorProps = {
    fileImage: string;
    onFinish?: (backgroundUrl: string) => void
}

const StoryImageEditor: FC<StoryImageEditorProps> = ({
    fileImage,
    onFinish
}) => {
    const editorRef = useRef<PinturaEditor>(null);

    const handleProcess = async (dest: any) => {
        const response = await uploadImage(dest);
        onFinish?.(response.secure_url)
    }

    return (
        <div style={{ height: "100%", width: '100%' }}>
            <PinturaEditor
                {...editorDefaults}
                ref={editorRef}
                src={fileImage}
                utils={["crop", "finetune", "filter", "annotate",]}
                onLoad={(res: any) => {
                    console.log("Did load image", res);
                    if (!editorRef.current) return;

                    // Example using editor ref
                    const { editor } = editorRef.current;

                    // Now we can access properties and methods
                    editor.imageCropAspectRatio = 9 / 16;
                }}
                onProcess={({ dest }: any) => handleProcess(dest)}
            />
        </div>
    );
}

export default StoryImageEditor