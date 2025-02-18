import * as signalR from "@microsoft/signalr";
import { getAccessToken } from "../../utils/auth";
import { NotificationResource } from "../../types/notification";
import { MessageRequest } from "../../components/chats/ChatPopup";
import { MessageResource } from "../../types/message";

const URL = import.meta.env.VITE_SERVER_HUB_URL;

class SignalRConnector {

    private readonly connection: signalR.HubConnection;
    public events: (
        // Event handlers
        onMessageReceived?: (message: MessageResource) => void,
        onReadStatusReceived?: (message: MessageResource, userId: string) => void,
        onTypingMessage?: (groupName: string, content: string) => void,
        onStopTypingMessage?: (groupName: string) => void,
        onNotificationReceived?: (notification: NotificationResource) => void,
        onBlockSignalReceive?: (chatRoomId: string) => void,
        onActionGroupSignalReceive?: (chatRoomId: string) => void,
    ) => void

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

        this.events = (onMessageReceived, onReadStatusReceived, onTypingMessage, onStopTypingMessage, onNotificationReceived, onBlockSignalReceive, onActionGroupSignalReceive) => {
            this.connection.on("NewMessage", (message: MessageResource) => {
                onMessageReceived?.(message);
            });

            this.connection.on("NewRead", (message: MessageResource, userId: string) => {
                onReadStatusReceived?.(message, userId);
            });

            this.connection.on("TypingMessage", (groupName: string, content: string) => {
                onTypingMessage?.(groupName, content)
            })

            this.connection.on("StopTypingMessage", (groupName: string) => {
                onStopTypingMessage?.(groupName)
            })

            this.connection.on("NewNotification", (notification: NotificationResource) => {
                onNotificationReceived?.(notification);
            });

            this.connection.on("FetchBlock", (chatRoomId: string) => {
                onBlockSignalReceive?.(chatRoomId)
            })

            this.connection.on("FetchChatRoom", (chatRoomId: string) => {
                onActionGroupSignalReceive?.(chatRoomId);
            });
        };


    }

    public unsubscribeEvents = () => {
        this.connection.off("NewMessage");
        this.connection.off("NewRead");
        this.connection.off("TypingMessage");
        this.connection.off("StopTypingMessage");
        this.connection.off("NewNotification");
    };

    public sendMessage = async (message: MessageRequest) => {
        if (this.connection && this.connection.state === signalR.HubConnectionState.Connected) {
            await this.connection.send("SendMessage", message)
                .catch(err => {
                    console.log(err)
                })
           
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

    public static getInstance(): SignalRConnector {
        if (!SignalRConnector.instance)
            SignalRConnector.instance = new SignalRConnector();
        return SignalRConnector.instance;
    }
}

export default SignalRConnector.getInstance();