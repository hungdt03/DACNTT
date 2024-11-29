import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ConfigProvider } from 'antd'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ConfigProvider theme={{
            token: {
                colorPrimary: '#0ea5e9',
                fontFamily: "'Nunito', 'Segoe UI', 'Roboto', 'Arial', sans-serif;"
            },
        }}>

            <App />
        </ConfigProvider>

    </StrictMode>,
)
