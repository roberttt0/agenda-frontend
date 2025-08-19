import React from "react";
import {Button, Layout} from "antd";
import styles from '../styles/info.module.css'
import {FileTextOutlined, UserOutlined} from "@ant-design/icons";
import {useMediaQuery} from "react-responsive";
import AppAutoComplete from "../components/AppAutoComplete.jsx";
import logo from "../assets/dedeman_logo.png"
import AppCard from "../components/AppCard.jsx";

export default function Info() {
    const isMobile = useMediaQuery({query: '(max-width: 768px)'});

    return (
        <Layout className={styles.infoLayout}>
            <Layout.Header className={styles.infoHeader}>
                <div className={styles.logo}>
                    <a href={"/"}><img src={logo} width={isMobile ? '50px' : '60px' } alt={"logo"}/></a>
                </div>
                <div className={styles.searchBar}>
                    <AppAutoComplete mobileWidth={"180px"} desktopWidth={"300px"} mobileSize={"medium"} desktopSize={"medium"} mobileSufix={"20px"} desktopSufix={"22px"} placeholder={"Cauta in agenda"} mobilePlaceholder={"Cauta in agenda"}/>
                </div>
                <div className={styles.icons}>
                    <Button
                        icon={<UserOutlined/>}
                        size={isMobile ? "middle" : "large"}
                    />
                    <Button
                        icon={<FileTextOutlined/>}
                        size={isMobile ? "middle" : "large"}
                    />
                </div>
            </Layout.Header>
            <Layout.Content className={styles.infoContent}>
                <AppCard />
            </Layout.Content>
            <Layout.Footer className={styles.infoFooter}>
                Footer
            </Layout.Footer>
        </Layout>
    )
}