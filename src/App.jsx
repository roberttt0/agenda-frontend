import './app.css'
import Home from "./pages/Home.jsx";
import {ConfigProvider} from "antd";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Info from "./pages/Info.jsx";
import Test from "./pages/Test.jsx";

function App() {

    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimaryBorder: "null"
                },
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
                    },
                    Modal: {
                        contentBg: "#2C2C2C",
                        colorPrimaryBorder: "red"
                    }
                }
            }
            }
        >
            <BrowserRouter>
                <Routes>
                    <Route path={'/'} element={<Home />} />
                    <Route path={'/info'} element={<Info />} />
                    <Route path={'/test'} element={<Test />} />
                </Routes>
            </BrowserRouter>
        </ConfigProvider>
    )
}

export default App
