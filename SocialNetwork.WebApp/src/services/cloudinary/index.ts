
import axios from 'axios';

type CloudinaryResponse = {
    secure_url: string;
    public_id: string;
    [key: string]: any;
}

export const uploadImage = async (fileImage: File): Promise<CloudinaryResponse> => {
    const formData = new FormData()
    formData.append('file', fileImage)
    formData.append("upload_preset", 'social_network_fe');
    formData.append("cloud_name", import.meta.env.VITE_CLOUD_NAME);
    const response = await axios.post<CloudinaryResponse>(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUD_NAME}/image/upload`,
        formData
    );

    console.log(response)
    return response.data;
};