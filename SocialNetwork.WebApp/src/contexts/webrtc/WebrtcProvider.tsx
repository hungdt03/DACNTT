import { FC, ReactNode, useEffect, useMemo, useRef, useState } from "react";
import Peer from 'simple-peer';
import WebRtcContext from './WebrtcContext'
import SignalRConnector from '../../app/signalR/signalr-connection'
import useModal from "../../hooks/useModal";
import { Button, Modal } from "antd";
import { PhoneOutlined, CloseOutlined, CameraOutlined } from '@ant-design/icons'
import images from "../../assets";
import { UserResource } from "../../types/user";
import { ChatRoomResource } from "../../types/chatRoom";

export type CallPayload = {
    chatRoomName: string;
    signalData: any
}

export type IncomingCallPayload = {
    from: UserResource;
    chatRoomName: string;
    signalData: any
}

export type AnswerPayload = {
    chatRoomName: string;
    signalData: any
}

export type CallAcceptedPayload = {
    from: UserResource;
    signalData: any
}

export type CallInfo = {
    isReceivingCall: boolean;
    from: UserResource;
    chatRoomName: string;
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
    const [chatRoom, setChatRoom] = useState<ChatRoomResource>();

    const [callAccepted, setCallAccepted] = useState(false);
    const [callEnded, setCallEnded] = useState(false);
    const [stream, setStream] = useState<MediaStream>();
    const [call, setCall] = useState<CallInfo>();

    const localVideo = useRef<HTMLVideoElement>(null);
    const remoteVideo = useRef<HTMLVideoElement>(null);
    const connectionRef = useRef<Peer.Instance>();

    useEffect(() => {
        SignalRConnector.events(
            undefined,
            undefined,
            undefined,
            undefined,
            undefined,
            (payload: IncomingCallPayload) => {
                showModal()
                setCall({ isReceivingCall: true, from: payload.from, signalData: payload.signalData, chatRoomName: payload.chatRoomName });
            },
            undefined,
            () => {
                setCallEnded(true)
                stream?.getTracks().forEach(track => track.stop())
                if (connectionRef.current) {
                    connectionRef.current.destroy()
                }
                // Reset call state
                setCallAccepted(false);
                handleOk()
                okCall()
                window.location.reload()
            }
        )
    }, [stream]);

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
                chatRoomName: call?.chatRoomName
            } as AnswerPayload)

        });

        peer.on('stream', (currentStream) => {
            if (remoteVideo.current) {
                remoteVideo.current.srcObject = currentStream;
            }
        });

        peer.signal(call?.signalData);
        connectionRef.current = peer;
    };

    const handleCall = async (callChatRoom: ChatRoomResource) => {
        setChatRoom(callChatRoom)
        showCall()

        try {
            const dataStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            setStream(dataStream)

            const peer = new Peer({ initiator: true, trickle: false, stream: dataStream });

            peer.on('signal', (data) => {
                SignalRConnector.callFriend({
                    chatRoomName: callChatRoom.uniqueName,
                    signalData: data
                } as CallPayload)
            });

            peer.on('stream', (currentStream) => {
                if (remoteVideo.current) {
                    remoteVideo.current.srcObject = currentStream;
                }
            });

            SignalRConnector.events(
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                undefined,
                (acceptedPayload: CallAcceptedPayload) => {
                    setCallAccepted(true);
                    peer.signal(acceptedPayload.signalData);
                },
                undefined
            );

            connectionRef.current = peer;
        } catch {
            alert('Cannot access camera')
        }

    };

    useEffect(() => {
        if (openCall && !callAccepted) {
            const timer = setTimeout(() => {
                if (!callAccepted) {
                    handleLeaveCall();
                }
            }, 60000); // 1 phút

            return () => clearTimeout(timer);
        }
    }, [openCall, callAccepted]);

    const handleLeaveCall = () => {
        if (chatRoom) {
            setChatRoom(undefined);
            SignalRConnector.leaveCall(chatRoom.uniqueName);
        } else if (call?.from) {
            setCall(undefined);
            SignalRConnector.leaveCall(call.chatRoomName);
        }

    };

    const contextValue = useMemo(
        () => ({
            handleCall,
        }),
        [handleCall]
    );

    return (
        <WebRtcContext.Provider value={contextValue}>
            {children}
            <Modal
                style={{ top: 20 }}
                centered
                title={<p className="text-center">Cuộc gọi đi</p>}
                open={openCall}
                width='700px'
                onOk={okCall}
                onClose={() => handleLeaveCall()}
                onCancel={cancelCall}
                maskClosable={false}
                classNames={{
                    footer: 'hidden'
                }}
            >

                <div className="w-full relative">
                    {stream && <video className="absolute top-4 right-4 border-2 border-primary" width='160px' ref={localVideo} autoPlay />}
                    {(callAccepted && !callEnded) ? <video className="w-full h-full" ref={remoteVideo} autoPlay muted /> : <div className="flex items-center justify-center">
                        <div className="flex flex-col items-center gap-y-1 py-20">
                            <img className="w-[100px] h-[100px] object-cover rounded-full" src={chatRoom?.isPrivate ? chatRoom.friend?.avatar : images.group} />
                            <span className="text-xl font-semibold">{chatRoom?.isPrivate ? chatRoom.friend?.fullName : chatRoom?.name}</span>
                            <p>Đang gọi...</p>
                        </div>
                    </div>}

                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-x-3">
                        <Button onClick={() => {
                            handleLeaveCall()
                            okCall()
                        }} danger type="primary" icon={<PhoneOutlined />} shape="circle"></Button>
                    </div>
                </div>
            </Modal>

            <Modal
                style={{ top: 20 }}
                centered
                title={<p className="text-center">Cuộc gọi đến</p>}
                open={isModalOpen}
                width={callAccepted ? '700px' : '350px'}
                classNames={{
                    footer: 'hidden'
                }}
                onClose={() => handleLeaveCall()}
                onOk={handleOk}
                maskClosable={false}
                onCancel={handleCancel}
            >
                <div className="px-4 py-2">
                    {(call?.isReceivingCall && !callAccepted) ? <div className="flex flex-col gap-y-4 items-center">
                        <div className="flex flex-col items-center gap-y-1">
                            <img className="w-[70px] h-[70px] object-cover rounded-full" src={call.from.avatar ?? images.user} />
                            <span className="text-lg font-semibold text-center">{call.from.fullName} đang gọi cho bạn</span>
                        </div>

                        <div className="flex items-center justify-center gap-x-4 w-full">
                            <div className="flex flex-col items-center gap-y-1">
                                <Button danger type="primary" icon={<CloseOutlined />} shape="circle"></Button>
                                <span>Từ chối</span>
                            </div>
                            <div onClick={handleAnswerCall} className="flex flex-col items-center gap-y-1">
                                <Button className="bg-green-500" type="primary" icon={<CameraOutlined />} shape="circle"></Button>
                                <span>Chấp nhận</span>
                            </div>
                        </div>
                    </div> : <div className="w-full relative">
                        {stream && <video className="absolute top-4 right-4 border-2 border-primary" width='160px' ref={localVideo} autoPlay muted />}
                        {callAccepted && !callEnded && <video className="w-full h-full" ref={remoteVideo} autoPlay muted />}

                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-x-3">
                            <Button onClick={() => {
                                handleLeaveCall()
                                handleOk()
                            }} danger type="primary" icon={<PhoneOutlined />} shape="circle"></Button>
                        </div>
                    </div>}
                </div>
            </Modal>
        </WebRtcContext.Provider>
    );
}

export default WebRtcProvider;