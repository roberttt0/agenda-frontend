import React, {useContext} from "react";
import {Navigate} from "react-router-dom";
import {Button, Layout} from "antd";
import styles from "../styles/auth.module.css";
import {FileTextOutlined, UserOutlined} from "@ant-design/icons";
import {useIsMobile} from "../services/AppService.jsx";
import LoginForm from "../components/LoginForm.jsx";
import {UserContext} from "../App.jsx";
import logo from "../assets/dedeman_logo.png";

export default function LoginPage() {

    const {user, setUser} = useContext(UserContext)
    const currentYear = new Date().getFullYear();
    const isMobile = useIsMobile()

    return (
        !user.name ? (
            <Layout style={{height: "100vh"}}>
                <Layout.Header className={styles.infoHeader}>
                    <div className={styles.logo}>
                        <Button
                            style={{
                                backgroundImage: `url(${logo})`, backgroundSize: "cover", backgroundPosition: "center",
                                width: isMobile ? "32px" : "40px",
                                marginLeft: isMobile ? "10px" : "20px"
                            }}
                            size={isMobile ? "middle" : "large"}
                            href={'/'}
                        />
                    </div>
                    <div className={styles.icons}>
                        <Button
                            icon={<UserOutlined/>}
                            style={isMobile ? null : {width: "140px"}}
                            href={'/login'}
                        >
                            {isMobile ? null : "Autentificare"}
                        </Button>
                        <Button
                            icon={<FileTextOutlined/>}
                            style={isMobile ? null : {width: "140px"}}
                        >
                            {isMobile ? null : "Documente"}
                        </Button>
                    </div>
                </Layout.Header>
                <Layout.Content style={{
                    display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 40
                }}>
                    <h1>Autentificare Dedeman</h1>
                    <LoginForm user={user} setUser={setUser}/>
                </Layout.Content>
                <Layout.Footer className={styles.infoFooter}>
                    © {currentYear} Dedeman. Toate drepturile rezervate.
                </Layout.Footer>
            </Layout>
        ) : <Navigate to={'/'}/>
    )
}
