import * as signalR from "@microsoft/signalr";
import { getAccessToken } from "../../utils/auth";
import { NotificationResource } from "../../types/notification";

const URL = "http://localhost:5172/serverHub";

class SignalRConnector {

    private connection: signalR.HubConnection;
    public events: (
        onMessageReceived?: (message: any) => void,
        onNotificationReceived?: (notification: NotificationResource) => void,
    ) => void;

    static instance: SignalRConnector;

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

        this.events = (onMessageReceived, onNotificationReceived) => {
            this.connection.on("NewMessage", (message: any) => {
                onMessageReceived?.(message);
            });

            this.connection.on("NewNotification", (notification: NotificationResource) => {
                onNotificationReceived?.(notification);
            });
        };
    }

    // public sendMessage = async (message: MessageRequest) => {
    //     if (this.connection && this.connection.state === signalR.HubConnectionState.Connected) {
    //         await this.connection.send("SendMessage", message)
    //     } else {
    //         console.error("Chưa kết nối tới Server SignalR");
    //     }

    // }

    public static getInstance(): SignalRConnector {
        if (!SignalRConnector.instance)
            SignalRConnector.instance = new SignalRConnector();
        return SignalRConnector.instance;
    }
}
export default SignalRConnector.getInstance;