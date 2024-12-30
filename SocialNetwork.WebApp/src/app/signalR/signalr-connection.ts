import * as signalR from "@microsoft/signalr";
import { getAccessToken } from "../../utils/auth";
import { NotificationResource } from "../../types/notification";
import { MessageRequest } from "../../components/chats/ChatPopup";
import { AnswerPayload, CallPayload, IncomingCallPayload } from "../../contexts/webrtc/WebrtcProvider";
import { MessageResource } from "../../types/message";

const URL = import.meta.env.VITE_SERVER_HUB_URL;

class SignalRConnector {

    private readonly connection: signalR.HubConnection;

    // Event handlers
    public onTypingMessage?: (groupName: string, content: string) => void;
    public onStopTypingMessage?: (groupName: string) => void;
    public onMessageReceived?: (message: MessageResource) => void;
    public onReadStatusReceived?: (message: MessageResource, userId: string) => void;
    public onNotificationReceived?: (notification: NotificationResource) => void;
    public onIncomingCall?: (payload: IncomingCallPayload) => void;
    public onCallAccepted?: (signalData: any) => void;
    public onLeaveCall?: () => void;

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
        this.registerEvents();

    }

    private registerEvents() {
        this.connection.on("NewMessage", (message: MessageResource) => {
            this.onMessageReceived?.(message);
        });

        this.connection.on("NewRead", (message: MessageResource, userId: string) => {
            this.onReadStatusReceived?.(message, userId);
        });

        this.connection.on("TypingMessage", (groupName: string, content: string) => {
            this.onTypingMessage?.(groupName, content)
        })

        this.connection.on("StopTypingMessage", (groupName: string) => {
            this.onStopTypingMessage?.(groupName)
        })


        this.connection.on("NewNotification", (notification: NotificationResource) => {
            this.onNotificationReceived?.(notification);
        });

        this.connection.on("CallFriend", (payload: IncomingCallPayload) => {
            this.onIncomingCall?.(payload);
        });

        this.connection.on("AcceptCall", (signalData: any) => {
            this.onCallAccepted?.(signalData);
        });

        this.connection.on("LeaveCall", () => {
            this.onLeaveCall?.();
        });
    }

    public sendMessage = async (message: MessageRequest) => {
        if (this.connection && this.connection.state === signalR.HubConnectionState.Connected) {
            await this.connection.send("SendMessage", message)
        } else {
            console.error("Chưa kết nối tới Server SignalR");
        }

    }

    public startTypingMessage = async (groupName: string, fullName: string) => {
        if (this.connection && this.connection.state === signalR.HubConnectionState.Connected) {
            await this.connection.send("TypingMessage", groupName, fullName)
        } else {
            console.error("Chưa kết nối tới Server SignalR");
        }

    }

    public stopTypingMessage = async (groupName: string) => {
        if (this.connection && this.connection.state === signalR.HubConnectionState.Connected) {
            await this.connection.send("StopTypingMessage", groupName)
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

export default SignalRConnector.getInstance();