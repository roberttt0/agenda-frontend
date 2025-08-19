import './app.css'
import Home from "./pages/Home.jsx";
import Test from "./pages/Test.jsx";
import {ConfigProvider} from "antd";

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
                <Home />
                {/*<Test />*/}
            </ConfigProvider>
    )
}

export default App
