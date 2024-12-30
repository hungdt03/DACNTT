import { FC, ReactNode, useEffect, useMemo, useRef, useState } from "react";
import Peer from 'simple-peer';
import WebRtcContext from './WebrtcContext'
import SignalRConnector from '../../app/signalR/signalr-connection'
import useModal from "../../hooks/useModal";
import { Button, Modal } from "antd";
import { PhoneOutlined, CloseOutlined, CameraOutlined } from '@ant-design/icons'
import images from "../../assets";
import { UserResource } from "../../types/user";

export type CallPayload = {
    userToCall: string;
    signalData: any
}

export type IncomingCallPayload = {
    from: UserResource;
    signalData: any
}

export type AnswerPayload = {
    userToAnswer: string;
    signalData: any
}

export type CallInfo = {
    isReceivingCall: boolean;
    from: UserResource;
    signalData: any
}

type WebRtcProviderProps = {
    children: ReactNode
}

const WebRtcProvider: FC<WebRtcProviderProps> = ({
    children
}) => {

    const { handleOk, handleCancel, isModalOpen, showModal } = useModal()
    const { handleOk: okCall, handleCancel: cancelCall, isModalOpen: openCall, showModal: showCall } = useModal()

    const [userToCall, setUserToCall] = useState<UserResource>()

    const [callAccepted, setCallAccepted] = useState(false);
    const [callEnded, setCallEnded] = useState(false);
    const [stream, setStream] = useState<MediaStream>();
    const [call, setCall] = useState<CallInfo>();

    const localVideo = useRef<HTMLVideoElement>(null);
    const remoteVideo = useRef<HTMLVideoElement>(null);
    const connectionRef = useRef<Peer.Instance>();

    useEffect(() => {
        SignalRConnector.onIncomingCall = (payload: IncomingCallPayload) => {
            showModal()
            setCall({ isReceivingCall: true, from: payload.from, signalData: payload.signalData });
        }

        SignalRConnector.onLeaveCall =  () => {
            console.log('RECEIVE SIGNAL LEAVING CALL');
            okCall();
            handleOk();

            if (connectionRef.current) {
                connectionRef.current.destroy();
                connectionRef.current = undefined;
            }

            // Stop stream tracks and reset video elements
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
                setStream(undefined);
            }

            if (localVideo.current) {
                localVideo.current.srcObject = null;
            }

            if (remoteVideo.current) {
                remoteVideo.current.srcObject = null;
            }

            // Reset call state
            setCall(undefined);
            setCallAccepted(false);
        }
       
    }, []);

    useEffect(() => {
        if (localVideo.current && stream) {
            localVideo.current.srcObject = stream;
        }
    }, [stream])

    const handleAnswerCall = async () => {
        const dataStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })

        setStream(dataStream)
        setCallAccepted(true);

        const peer = new Peer({
            initiator: false, trickle: false, stream: dataStream
        });

        peer.on('signal', (data) => {
            SignalRConnector.answerCall({
                signalData: data,
                userToAnswer: call?.from.email
            } as AnswerPayload)

        });

        peer.on('stream', (currentStream) => {
            if (remoteVideo.current)
                remoteVideo.current.srcObject = currentStream;
        });

        peer.signal(call?.signalData);

        connectionRef.current = peer;
    };

    const handleCallUser = async (user: UserResource) => {
        setUserToCall(user)
        showCall()
        try {
            const dataStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            setStream(dataStream)

            const peer = new Peer({ initiator: true, trickle: false, stream: dataStream });

            peer.on('signal', (data) => {
                SignalRConnector.callFriend({
                    userToCall: user?.email,
                    signalData: data
                } as CallPayload)
    
            });
    
            peer.on('stream', (currentStream) => {
                if (remoteVideo.current) {
                    remoteVideo.current.srcObject = currentStream;
                }
            });
    
            SignalRConnector.onCallAccepted = (signal: any) => {
                setCallAccepted(true);
                peer.signal(signal);
            }
    
            connectionRef.current = peer;
        } catch {
            alert('Cannot access camera')
        }
       
    };

    const handleLeaveCall = () => {
        console.log('SEND LEAVE CALL SIGNAL')
        setCallEnded(true);

        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(undefined);
        }

        if (connectionRef.current) {
            connectionRef.current.destroy();
            connectionRef.current = undefined;
        }

        if (userToCall) {
            SignalRConnector.leaveCall(userToCall?.email);
        } else {
            SignalRConnector.leaveCall(call?.from.email!);
        }

        handleCancel();
        cancelCall();

        setCall(undefined);
        setCallAccepted(false);
        setUserToCall(undefined);
    };

    const contextValue = useMemo(
        () => ({
            handleCallUser,
        }),
        [handleCallUser]
    );

    return (
        <WebRtcContext.Provider value={contextValue}>
            {children}
            <Modal
                style={{ top: 20 }}
                centered
                title='Gọi điện thoại'
                open={openCall}
                width='700px'
                onOk={okCall}
                onClose={() => handleLeaveCall()}
                footer={[]}
                onCancel={cancelCall}
            >

                <div className="w-full relative">
                    {stream && <video className="absolute top-4 right-4 border-2 border-primary" width='160px' ref={localVideo} autoPlay />}
                    {(callAccepted && !callEnded) ? <video className="w-full h-full" ref={remoteVideo} autoPlay muted /> : <div className="flex items-center justify-center">
                        <div className="flex flex-col items-center gap-y-1 py-20">
                            <img width='100' height='100' src={userToCall?.avatar ?? images.user} />
                            <span className="text-xl font-semibold">{userToCall?.fullName}</span>
                            <p>Đang gọi...</p>
                        </div>
                    </div>}

                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-x-3">
                        <Button onClick={() => {
                            handleLeaveCall()
                            okCall()
                        }} danger type="primary" icon={<PhoneOutlined />} shape="round"></Button>
                    </div>
                </div>
            </Modal>

            <Modal
                style={{ top: 20 }}
                centered
                title={<p className="text-center">Cuộc gọi đến</p>}
                open={isModalOpen}
                width={callAccepted ? '700px' : '350px'}
                footer={[]}
                onClose={() => handleLeaveCall()}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <div className="px-4 py-2">
                    {(call?.isReceivingCall && !callAccepted) ? <div className="flex flex-col gap-y-4 items-center">
                        <div className="flex flex-col items-center gap-y-1">
                            <img width='70' height='70' src={call.from.avatar ?? images.user} />
                            <span className="text-xl font-semibold text-center">{call.from.fullName} đang gọi cho bạn</span>
                        </div>

                        <div className="flex items-center justify-center gap-x-8 w-full">
                            <div className="flex flex-col gap-y-1">
                                <Button danger type="primary" icon={<CloseOutlined />} shape="round"></Button>
                                <span>Từ chối</span>
                            </div>
                            <div onClick={handleAnswerCall} className="flex flex-col gap-y-1">
                                <Button className="bg-green-500" type="primary" icon={<CameraOutlined />} shape="round"></Button>
                                <span>Chấp nhận</span>
                            </div>
                        </div>
                    </div> : <div className="w-full relative">
                        {stream && <video className="absolute top-4 right-4 border-2 border-primary" width='120px' ref={localVideo} autoPlay muted />}
                        {callAccepted && !callEnded && <video className="w-full h-full" ref={remoteVideo} autoPlay muted />}

                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-x-3">
                            <Button onClick={() => {
                                handleLeaveCall()
                                handleOk()
                            }} danger type="primary" icon={<PhoneOutlined />} shape="round"></Button>
                        </div>
                    </div>}
                </div>
            </Modal>
        </WebRtcContext.Provider>
    );
}

export default WebRtcProvider;