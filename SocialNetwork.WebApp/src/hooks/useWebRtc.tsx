import { useContext } from "react";
import WebRtcContext from '../contexts/webrtc/WebrtcContext'

const useWebRtc = () => {
    const context = useContext(WebRtcContext);

    if (!context) {
        throw new Error("useWebRtc must be used within a WebRtcProvider");
    }

    return context;
};

export default useWebRtc;