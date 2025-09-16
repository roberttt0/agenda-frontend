import React, {createContext, useState} from "react";
import './app.css'
import Home from "./pages/Home.jsx";
import {ConfigProvider} from "antd";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Info from "./pages/Info.jsx";
import Test from "./pages/Test.jsx";
import WorkPoints from "./pages/WorkPoints.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";

export const UserContext = createContext(null)

function App() {

    const [user, setUser] = useState(() => {
        const storedName = localStorage.getItem("name") || sessionStorage.getItem("name");
        const storedToken = localStorage.getItem("token") || sessionStorage.getItem("token");

        if (storedName && storedToken) {
            return {
                name: storedName,
                token: storedToken
            };
        }
        return {};
    });

    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimaryBorder: null
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
            <UserContext.Provider value={{user, setUser}}>
                <BrowserRouter>
                    <Routes>
                        <Route path={'/'} element={<Home/>}/>
                        <Route path={'/info'} element={<Info/>}/>
                        <Route path={'/test'} element={<Test/>}/>
                        <Route path={'/work-points'} element={<WorkPoints/>}/>
                        <Route path={'/login'} element={<LoginPage/>}/>
                        <Route path={'/register'} element={<RegisterPage />} />
                    </Routes>
                </BrowserRouter>
            </UserContext.Provider>
        </ConfigProvider>
    )
}

export default App
