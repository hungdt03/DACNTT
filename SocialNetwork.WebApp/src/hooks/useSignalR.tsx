import { useContext } from "react";
import { SignalRContext } from "../contexts/SignalRProvider";

export const useSignalR = () => {
    const context = useContext(SignalRContext);
    if (!context) {
        throw new Error("useSignalR must be used within a SignalRProvider");
    }
    return context;
};