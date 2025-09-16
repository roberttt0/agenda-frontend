import {Button, Dropdown, Layout} from "antd";
import styles from '../styles/home.module.css'
import {FileTextOutlined, UserOutlined} from "@ant-design/icons";
import logo from "../assets/Logo_Dedeman.svg"
import AppAutoComplete from "../components/AppAutoComplete.jsx";
import {useContext, useState} from "react";
import AdvancedSearchSelect from "../components/AdvancedSearchSelect.jsx";
import {getMenu, useIsMobile} from "../services/AppService.jsx";
import {UserContext} from "../App.jsx";

export default function Home() {

    const [filters, setFilters] = useState({
        company: null,
        workPoint: null,
        department: null,
        job: null,
        county: null,
        phone: null
    });

    const isMobile = useIsMobile()
    const currentYear = new Date().getFullYear();
    const [showAdvanced, setShowAdvanced] = useState(false);
    const {user, setUser} = useContext(UserContext)

    return (
        <Layout className={styles.homeLayout}>
            <Layout.Header className={styles.homeHeader}>
                {
                    !user.name ? (
                            <Button
                                icon={<UserOutlined/>}
                                style={isMobile ? null : {width: "140px"}}
                                href={'/login'}
                            >
                                {isMobile ? null : "Autentificare"}
                            </Button>
                        ) :
                        <Dropdown menu={{items: getMenu(user)}}
                                  placement="bottomLeft"
                        >
                            <Button
                                icon={<UserOutlined/>}
                                style={isMobile ? null : {width: "140px"}}
                            >
                                {isMobile ? null : "Contul meu"}
                            </Button>
                        </Dropdown>
                }
                <Button
                    icon={<FileTextOutlined/>}
                    style={isMobile ? null : {width: "140px"}}
                >
                    {isMobile ? null : "Documente"}
                </Button>
            </Layout.Header>
            {user.name && <div style={{display: "flex", padding: 40, fontSize: 16}}>Bine ai venit {user.name}</div>}
            <Layout.Content className={styles.homeContent}>
                <a href={"/"}><img src={logo} width={isMobile ? '240px' : '320px'} alt={"logo"}/></a>
                <AppAutoComplete desktopWidth={"800px"} mobileWidth={"260px"} mobilePlaceholder={"Cauta in agenda"}
                                 placeholder={"Nume de persoane, puncte de lucru, departamente, companii"}
                                 mobileSize={"medium"} desktopSize={"large"} mobileSufix={"20px"} desktopSufix={"28px"}
                                 filters={filters}/>
                <div style={{position: "relative", display: "inline-block"}}>
                    <div className={styles.homeButtons}>
                        <Button
                            style={{width: isMobile ? "140px" : "180px"}}
                            size={isMobile ? "medium" : "large"}
                            onClick={() => setShowAdvanced(prev => !prev)}
                        >
                            Cautare avansata
                        </Button>
                        <Button style={{width: isMobile ? "140px" : "180px"}} size={isMobile ? "medium" : "large"}
                                href={'/work-points'}>Lista magazine</Button>
                    </div>
                    {showAdvanced && (
                        <div
                            style={{
                                position: "absolute",
                                top: "100%",
                                left: "50%",
                                transform: "translateX(-50%)",
                                marginTop: 20,
                                background: "#fff",
                                border: "1px solid #ddd",
                                padding: 16,
                                borderRadius: 8,
                                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                                zIndex: 1000,
                            }}
                        >
                            <AdvancedSearchSelect onFiltersChange={setFilters}/>
                        </div>
                    )}
                </div>
            </Layout.Content>
            <Layout.Footer style={{
                backgroundColor: "#eeeeee",
                display: 'flex',
                justifyContent: "flex-end"
            }}>
                © {currentYear} Dedeman. Toate drepturile rezervate.
            </Layout.Footer>
        </Layout>
    )
}