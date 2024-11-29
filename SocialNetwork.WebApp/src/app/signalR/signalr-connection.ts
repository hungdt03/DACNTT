import * as signalR from "@microsoft/signalr";

const URL = "https://localhost:7000/notificationHub";

class Connector {

    private connection: signalR.HubConnection;
    public events: (
        onMessageReceived?: (message: any) => void,
    ) => void;

    static instance: Connector;

    constructor() {
        this.connection = new signalR.HubConnectionBuilder()
            .withUrl(URL, {
                skipNegotiation: true, // prevent warning | error when using diffenrent domain with server
                transport: signalR.HttpTransportType.WebSockets,
            })
            .withAutomaticReconnect()
            .configureLogging(signalR.LogLevel.Information)
            .build();

        this.connection.start()
        .then(() => console.log("Connected to SignalR"))
        .catch(err => console.error("Error connecting to SignalR: ", err));

        this.events = (onMessageReceived) => {
            this.connection.on("ReceiveGeneralNotification", (data) => {
                onMessageReceived?.(data);
            });

        };
    }
  

    public static getInstance(): Connector {
        if (!Connector.instance)
            Connector.instance = new Connector();
        return Connector.instance;
    }
}
export default Connector.getInstance;