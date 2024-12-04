import React, { createContext, useEffect, useMemo, useState } from "react";
import * as signalR from "@microsoft/signalr";
import { getAccessToken } from "../utils/auth";
import { NotificationResource } from "../types/notification";

const URL = "http://localhost:5172/serverHub";

type SignalRContextProps = {
    connection: signalR.HubConnection | null;
    onMessageReceived: (callback: (message: any) => void) => void;
    onNotificationReceived: (callback: (notification: any) => void) => void;
}

// Create a context
export const SignalRContext = createContext<SignalRContextProps>({
    connection: null,
    onMessageReceived: () => {},
    onNotificationReceived: () => {},
});

// SignalRProvider component
export const SignalRProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [connection, setConnection] = useState<signalR.HubConnection | null>(null);

    useEffect(() => {
        const connectSignalR = async () => {
            const hubConnection = new signalR.HubConnectionBuilder()
                .withUrl(URL, {
                    skipNegotiation: true, // prevent warning | error when using different domain with server
                    transport: signalR.HttpTransportType.WebSockets,
                    accessTokenFactory: async () => getAccessToken(),
                })
                .withAutomaticReconnect()
                .configureLogging(signalR.LogLevel.Information)
                .build();

            try {
                await hubConnection.start();
                console.log("Connected to SignalR");
                setConnection(hubConnection);
            } catch (error) {
                console.error("Error connecting to SignalR: ", error);
            }
        };

        connectSignalR();

        return () => {
            console.log('Stop ------')
            connection?.stop();
        };
    }, []); // Empty dependency array ensures the connection is established only once.

    const onMessageReceived = (callback: (message: any) => void) => {
        if (connection) {
            connection.on("NewMessage", callback);
        }
    };

    const onNotificationReceived = (callback: (notification: NotificationResource) => void) => {
        console.log('onNotificationReceived')
        if (connection) {
            console.log('onNotificationReceived ttttt')
            connection.on("NewNotification", (notification: NotificationResource) => {
                console.log('Receive: ')
                console.log(notification)
                callback(notification)
            });
        }
    };

    // Memoize the context value to avoid unnecessary re-renders
    const value = useMemo(
        () => ({
            connection,
            onMessageReceived,
            onNotificationReceived
        }),
        [connection]
    );

    return <SignalRContext.Provider value={value}>
        {children}
    </SignalRContext.Provider>;
};
