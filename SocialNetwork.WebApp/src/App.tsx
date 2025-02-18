import { RouterProvider } from "react-router-dom"
import appRouter from "./routes"
import { AppDispatch } from "./app/store";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { getAccessToken } from "./utils/auth";
import { initialize } from "./features/slices/auth-slice";
import authService from "./services/authService";

function App() {
    
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        (async () => {
            const accessToken = getAccessToken();
            if (!accessToken) {
                return dispatch(initialize({
                    isAuthenticated: false, user: undefined
                }));
            }
            
            try {
                const response = await authService.getPrincipal();
                if (response.isSuccess) {
                    dispatch(initialize({ isAuthenticated: true, user: response.data }));
                } else {
                    dispatch(initialize({
                        isAuthenticated: false, user: undefined
                    }));
                }

            } catch {
                dispatch(initialize({ isAuthenticated: false, user: undefined }));
            }
        })();


    }, []);

    return <RouterProvider router={appRouter} />
    
}
export default App;
