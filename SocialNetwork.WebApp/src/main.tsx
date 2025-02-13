import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Provider } from 'react-redux'
import { ConfigProvider } from 'antd'
import store from './app/store.ts'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

createRoot(document.getElementById('root')!).render(
    //<StrictMode>
    <ConfigProvider theme={{
        token: {
            colorPrimary: '#0ea5e9',
            fontFamily: "'Nunito', 'Segoe UI', 'Roboto', 'Arial', sans-serif;"
        },
    }}>
        <Provider store={store}>
            <App />
            <ToastContainer />
        </Provider>

    </ConfigProvider>

    // </StrictMode>,
)
