import React, {useContext} from "react";
import {Button, Dropdown, Layout} from "antd";
import styles from "../styles/info.module.css";
import logo from "../assets/dedeman_logo.png";
import AppModal from "../components/AppModal.jsx";
import AppAutoComplete from "../components/AppAutoComplete.jsx";
import {FileTextOutlined, UserOutlined} from "@ant-design/icons";
import {useMediaQuery} from "react-responsive";
import {getMenu} from "../services/AppService.jsx";
import {UserContext} from "../App.jsx";

export default function SearchHeader() {
    const isMobile = useMediaQuery({query: '(max-width: 768px)'});
    const {user, setUser} = useContext(UserContext)

    return (
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
            <div className={styles.searchBar}>
                {
                    isMobile ? <AppModal/> :
                        <AppAutoComplete mobileWidth={"180px"} desktopWidth={"300px"} mobileSize={"medium"}
                                         desktopSize={"medium"} mobileSufix={"20px"} desktopSufix={"22px"}
                                         placeholder={"Cauta in agenda"} mobilePlaceholder={"Cauta in agenda"}/>
                }
            </div>
            <div className={styles.icons}>
                {
                    !user.name ? (
                            <Button
                                icon={<UserOutlined/>}
                                size={isMobile ? "middle" : "large"}
                                href={'/login'}
                            >
                            </Button>
                        ) :
                        <Dropdown menu={{items: getMenu(user)}}
                                  placement="bottomLeft"
                        >
                            <Button
                                icon={<UserOutlined/>}
                                size={isMobile ? "middle" : "large"}
                            >
                            </Button>
                        </Dropdown>
                }
                <Button
                    icon={<FileTextOutlined/>}
                    size={isMobile ? "middle" : "large"}
                />
            </div>
        </Layout.Header>
    )
}