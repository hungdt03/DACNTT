// src/components/ImageEditor.tsx

import React, { useEffect, useRef } from 'react';
import 'tui-image-editor/dist/tui-image-editor.css';
import TuiImageEditor from 'tui-image-editor';
import images from '../../assets';

interface ImageEditorProps {
    imageUrl: string;
}

const ImageEditor: React.FC<ImageEditorProps> = ({ imageUrl }) => {
    const editorRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (editorRef.current) {
            const editor = new TuiImageEditor(editorRef.current, {
                includeUI: {
                    loadImage: {
                        path: imageUrl,
                        name: 'SampleImage',
                    },
                    theme: {
                        'common.bi.image': images.facebook,
                        'common.bisize.height': '40px',
                        'common.bisize.width': '40px',
                        'downloadButton.backgroundColor': 'green',
                        'downloadButton.border': 'green',

                    },
                    uiSize: {
                        width: '100%',
                        height: '100%',
                    },
                    menuBarPosition: 'left',
                    usageStatistics: true
                },
                cssMaxWidth: 500,
                cssMaxHeight: 500,
                selectionStyle: {
                    
                },
            });

            return () => {
                editor.destroy();
            };
        }
    }, [imageUrl]);

    return <div ref={editorRef} className='w-full h-full overflow-hidden' />;
};

export default ImageEditor;
