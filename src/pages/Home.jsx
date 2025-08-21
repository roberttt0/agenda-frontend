import {Layout, Button} from "antd";
import styles from '../styles/home.module.css'
import {FileTextOutlined, UserOutlined} from "@ant-design/icons";
import {useMediaQuery} from "react-responsive";
import logo from "../assets/Logo_Dedeman.svg"
import AppAutoComplete from "../components/AppAutoComplete.jsx";

export default function Home() {

    const isMobile = useMediaQuery({query: '(max-width: 768px)'});
    const currentYear = new Date().getFullYear();

    return (
        <Layout className={styles.homeLayout}>
            <Layout.Header className={styles.homeHeader}>
                <Button
                    icon={<UserOutlined />}
                    style={isMobile ? null : {width: "140px"}}
                >
                    {isMobile ? null : "Autentificare"}
                </Button>
                <Button
                    icon={<FileTextOutlined />}
                    style={isMobile ? null : {width: "140px"}}
                >
                    {isMobile ? null : "Documente"}
                </Button>
            </Layout.Header>
            <Layout.Content className={styles.homeContent}>
                <a href={"/"}><img src={logo} width={isMobile ? '240px' : '320px' } alt={"logo"}/></a>
                <AppAutoComplete desktopWidth={"800px"} mobileWidth={"260px"} mobilePlaceholder={"Cauta in agenda"} placeholder={"Nume de persoane, puncte de lucru, departamente, companii"} mobileSize={"medium"} desktopSize={"large"} mobileSufix={"20px"} desktopSufix={"28px"} />
                <div className={styles.homeButtons}>
                    <Button style={{width: isMobile ? "140px" : "180px"}} size={isMobile ? "medium" : "large"}>Cautare avansata</Button>
                    <Button style={{width: isMobile ? "140px" : "180px"}} size={isMobile ? "medium" : "large"} href={'/work-points'}>Lista magazine</Button>
                </div>
            </Layout.Content>
            <Layout.Footer className={styles.homeFooter}>
                © {currentYear} Dedeman. Toate drepturile rezervate.
            </Layout.Footer>
        </Layout>
    )
}