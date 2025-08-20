import React, {useState} from 'react';
import {Button, Modal} from 'antd';
import {SearchOutlined} from "@ant-design/icons";
import AppAutoComplete from "./AppAutoComplete.jsx";

const AppModal = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const showModal = () => {
        setIsModalOpen(true);
    };

    const modalStyles = {
        body: {
            backgroundColor: "#202020",
            boxShadow: "none"
        },
        mask: {
            backgroundColor: "#202020",
            boxShadow: "none"
        },
        content: {
            backgroundColor: "#202020",
            boxShadow: "none"
        },
    };

    return (
        <>
            <Button icon={<SearchOutlined/>} iconPosition={"end"} onClick={showModal}>
                Caută
            </Button>
            <Modal
                closeIcon={false}
                open={isModalOpen}
                onCancel={handleCancel}
                footer={null}
                styles={modalStyles}
            >
                <AppAutoComplete desktopWidth={"800px"} mobileWidth={"300px"} mobilePlaceholder={"Cauta in agenda"}
                                 placeholder={"Nume de persoane, puncte de lucru, departamente, companii"}
                                 mobileSize={"large"} desktopSize={"large"} mobileSufix={"20px"} desktopSufix={"28px"}
                                 setModalState={setIsModalOpen}/>
            </Modal>

        </>
    );
};
export default AppModal;