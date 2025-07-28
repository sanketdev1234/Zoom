import React from 'react';
import { useState } from "react";
import { Camera } from 'lucide-react';
import './VideoCallLauncher.css';

function VideoCallLauncher({ meetid, joinid }) {
    const [isjoined, setisjoined] = useState(false);

    const handleVideoCall = () => {
        const videoUrl = `/videomeet/${meetid}/${joinid}`;
        // Always open in a new tab/window for both mobile and desktop
        window.open(videoUrl, '_blank', 'width=1200,height=800,scrollbars=yes,resizable=yes');
        setisjoined(true);
    };

    return (
        <div className="video-call-launcher">
            <button 
                className="video-call-btn"
                onClick={handleVideoCall}
                title="Start Video Call"
                disabled={isjoined}
            >
                <div className="btn-content">
                    <Camera className="video-icon" size={24} />
                    <span className="btn-text">Join Video Call</span>
                </div>
            </button>
        </div>
    );
}

export default VideoCallLauncher; 