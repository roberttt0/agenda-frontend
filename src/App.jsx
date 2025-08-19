import './app.css'
import Home from "./pages/Home.jsx";
import {ConfigProvider} from "antd";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Info from "./pages/Info.jsx";

function App() {

    return (
        <ConfigProvider
            theme={{
                components: {
                    Button: {
                        defaultHoverColor: "#004990",
                        defaultActiveBorderColor: "#004990",
                        defaultActiveColor: "#004990",
                        defaultHoverBorderColor: "#004990"
                    },
                    Select: {
                        hoverBorderColor: "#004990",
                        activeBorderColor: "#004990"
                    }
                }
            }
            }
        >
            <BrowserRouter>
                <Routes>
                    <Route path={'/'} element={<Home />} />
                    <Route path={'/info'} element={<Info />} />
                </Routes>
            </BrowserRouter>
        </ConfigProvider>
    )
}

export default App
