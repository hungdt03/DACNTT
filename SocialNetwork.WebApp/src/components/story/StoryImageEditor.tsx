import { useRef, useState } from "react";

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


export default function StoryImageEditor() {
    // inline
    const [result, setResult] = useState("");
    const editorRef = useRef<PinturaEditor>(null);

    return (
        <div style={{ height: "100vh" }}>

            <div style={{ height: "100%" }}>
                <PinturaEditor
                    {...editorDefaults}
                    ref={editorRef}
                    src={"https://scontent.fdad3-1.fna.fbcdn.net/v/t39.30808-6/471250552_1222607853000037_7336190192426045200_n.jpg?_nc_cat=1&ccb=1-7&_nc_sid=833d8c&_nc_aid=0&_nc_eui2=AeGvsWFYABRRNwHjLzahWql5Edmi_hIRaToR2aL-EhFpOoWY1lYzSNmh_KnzfYrYIm-LZf239dzm01jynjCksHxV&_nc_ohc=mpVgFTLgKR4Q7kNvgHLERBx&_nc_zt=23&_nc_ht=scontent.fdad3-1.fna&_nc_gid=AwqL-RzZmOr-IUPjpFzfIAw&oh=00_AYBbDI7OyLImpfSzLA87YVf82a9QII0NpvUIggqquN55OA&oe=6771B9E2"}
                    utils={["crop", "finetune", "filter", "annotate", ]}
                    onLoad={(res: any) => {
                        console.log("Did load image", res);

                        // not yet set
                        if (!editorRef.current) return;

                        // Example using editor ref
                        const { editor } = editorRef.current;

                        // Now we can access properties and methods
                        editor.imageCropAspectRatio = 9 / 16;
                    }}
                    onProcess={({ dest }: any) => setResult(URL.createObjectURL(dest))}
                />
            </div>

            {!!result.length && (
                <p>
                    <img src={result} alt="" />
                </p>
            )}
        </div>
    );
}