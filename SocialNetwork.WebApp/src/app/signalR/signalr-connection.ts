import * as signalR from "@microsoft/signalr";
import { getAccessToken } from "../../utils/auth";
import { NotificationResource } from "../../types/notification";
import { MessageRequest } from "../../components/chats/ChatPopup";
import { AnswerPayload, CallPayload, IncomingCallPayload } from "../../contexts/webrtc/WebrtcProvider";

const URL = import.meta.env.VITE_SERVER_HUB_URL;

class SignalRConnector {

    private readonly connection: signalR.HubConnection;
    public events: (
        onMessageReceived?: (message: any) => void,
        onNotificationReceived?: (notification: NotificationResource) => void,
        onIncomingCall?: (payload: IncomingCallPayload) => void,
        onCallAccepted?: (signalData: any) => void,
        onLeaveCall?: () => void
    ) => void;

    private static instance: SignalRConnector;

    constructor() {
        this.connection = new signalR.HubConnectionBuilder()
            .withUrl(URL, {
                skipNegotiation: true, // prevent warning | error when using diffenrent domain with server
                transport: signalR.HttpTransportType.WebSockets,
                accessTokenFactory: async () => getAccessToken() ?? '',
            })
            .withAutomaticReconnect()
            .configureLogging(signalR.LogLevel.Information)
            .build();

        this.connection.start().catch(err => console.log(err));

        this.events = (onMessageReceived, onNotificationReceived, onIncomingCall, onCallAccepted, onLeaveCall) => {
            this.connection.on("NewMessage", (message: any) => {
                onMessageReceived?.(message);
            });

            this.connection.on("NewNotification", (notification: NotificationResource) => {
                onNotificationReceived?.(notification);
            });

            this.connection.on("CallFriend", (payload: IncomingCallPayload) => {
                onIncomingCall?.(payload)
            })

            this.connection.on("AcceptCall", (signalData: any) => {
                onCallAccepted?.(signalData)
            })

            this.connection.on("LeaveCall", () => {
                onLeaveCall?.()
            })

        };
    }

    public sendMessage = async (message: MessageRequest) => {
        if (this.connection && this.connection.state === signalR.HubConnectionState.Connected) {
            await this.connection.send("SendMessage", message)
        } else {
            console.error("Chưa kết nối tới Server SignalR");
        }

    }

    public callFriend = async (payload: CallPayload) => {
        if (this.connection && this.connection.state === signalR.HubConnectionState.Connected) {
            await this.connection.send("CallFriend", payload)
        } else {
            console.error("Chưa kết nối tới Server SignalR");
        }
    }

    public answerCall = async (payload: AnswerPayload) => {
        if (this.connection && this.connection.state === signalR.HubConnectionState.Connected) {
            await this.connection.send("AnswerCall", payload)
        } else {
            console.error("Chưa kết nối tới Server SignalR");
        }
    }

    public leaveCall = async (username: string) => {
        if (this.connection && this.connection.state === signalR.HubConnectionState.Connected) {
            await this.connection.send("LeaveCall", username)
        } else {
            console.error("Chưa kết nối tới Server SignalR");
        }
    }

    public static getInstance(): SignalRConnector {
        if (!SignalRConnector.instance)
            SignalRConnector.instance = new SignalRConnector();
        return SignalRConnector.instance;
    }
}

export default SignalRConnector.getInstance;