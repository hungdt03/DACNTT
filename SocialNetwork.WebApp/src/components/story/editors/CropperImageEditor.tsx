import React, { useRef, useState } from "react";
import Cropper, { ReactCropperElement } from "react-cropper";
import "cropperjs/dist/cropper.css";
import { Button } from "antd";
import { uploadBase64Image } from "../../../services/cloudinary";
import LoadingIndicator from "../../LoadingIndicator";
import Loading from "../../Loading";

type CropperImageEditorProps = {
    fileImage: string;
    onFinish: (backgroundUrl: string) => void
}

const CropperImageEditor: React.FC<CropperImageEditorProps> = ({
    fileImage,
    onFinish
}) => {
    const cropperRef = useRef<ReactCropperElement>(null);
    const [loading, setLoading] = useState(false)

    const handleDone = (): void => {
        const cropper = cropperRef.current?.cropper;
        if (cropper) {
            const croppedCanvas = cropper.getCroppedCanvas();
            if (croppedCanvas) {
                // Chuyển đổi canvas thành ảnh base64
                const imageUrl = croppedCanvas.toDataURL("image/png");
                handleProcess(imageUrl)
            }
        }
    };

    const handleProcess = async (base64Url: string) => {
        setLoading(true)
        const response = await uploadBase64Image(base64Url);
        setLoading(false)
        onFinish?.(response.secure_url)
    }

    return <div className="relative w-full h-full">
        <Cropper
            src={fileImage}
            style={{ height: '100%', width: "100%" }}
            initialAspectRatio={9 / 16}
            guides={true}
            allowFullScreen
            ref={cropperRef}
            aspectRatio={9 / 16}
        />

        <div className="absolute top-4 right-4">
            {/* Nút "Xong" */}
            <Button
                onClick={handleDone}
                type="primary"
            >
                Chia sẻ lên tin
            </Button>
        </div>

        {loading && <Loading title="Đang tải ảnh lên" />}
    </div>
};

export default CropperImageEditor;
