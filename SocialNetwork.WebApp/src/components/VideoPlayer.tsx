import React, { useRef, useState, useEffect } from "react";

// Types
interface VideoPlayerProps {
    src: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ src }) => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [playing, setPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [videoTime, setVideoTime] = useState(0);
    const [progress, setProgress] = useState(0);

    // Play/Pause video
    const togglePlayPause = () => {
        if (playing) {
            videoRef.current?.pause();
        } else {
            videoRef.current?.play();
        }
        setPlaying(!playing);
    };

    // Fast forward 5 seconds
    const fastForward = () => {
        if (videoRef.current) {
            videoRef.current.currentTime += 5;
        }
    };

    // Rewind 5 seconds
    const rewind = () => {
        if (videoRef.current) {
            videoRef.current.currentTime -= 5;
        }
    };

    // Update current time and progress bar
    useEffect(() => {
        const video = videoRef.current;
        if (video) {
            setVideoTime(video.duration);
            const interval = setInterval(() => {
                setCurrentTime(video.currentTime);
                setProgress((video.currentTime / video.duration) * 100);
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [playing]);

    return (
        <div className="flex flex-col items-center w-full h-full relative">
            <video
                ref={videoRef}
                className="w-full h-full object-cover"
                src={src}
                onClick={togglePlayPause}
            />

            <div className="absolute bottom-8 w-full flex justify-between items-center px-4 z-10">
                {/* Controls */}
                <div className="flex items-center space-x-6">
                    <button onClick={rewind}>
                        <img
                            className="w-8 h-8 cursor-pointer"
                            src="/backward-5.svg"
                            alt="Rewind"
                        />
                    </button>
                    <button onClick={togglePlayPause}>
                        <img
                            className="w-12 h-12 cursor-pointer"
                            src={playing ? "/pause.svg" : "/play.svg"}
                            alt={playing ? "Pause" : "Play"}
                        />
                    </button>
                    <button onClick={fastForward}>
                        <img
                            className="w-8 h-8 cursor-pointer"
                            src="/forward-5.svg"
                            alt="Fast Forward"
                        />
                    </button>
                </div>

                {/* Time and Progress bar */}
                <div className="flex items-center space-x-4">
                    <p className="text-white">
                        {Math.floor(currentTime / 60)}:
                        {("0" + Math.floor(currentTime % 60)).slice(-2)}
                    </p>
                    <div className="w-3/4 bg-gray-700 rounded-full h-2 relative">
                        <div
                            style={{ width: `${progress}%` }}
                            className="bg-indigo-600 h-full rounded-full"
                        />
                    </div>
                    <p className="text-white">
                        {Math.floor(videoTime / 60)}:
                        {("0" + Math.floor(videoTime % 60)).slice(-2)}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default VideoPlayer;
