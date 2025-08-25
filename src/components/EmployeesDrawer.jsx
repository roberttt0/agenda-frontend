import {Button, Drawer, Input} from "antd";
import EmployeesTable from "./EmployeesTable.jsx";
import {useState} from "react";

export default function EmployeesDrawer({id}) {

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [text, setText] = useState("")
    const handleCancel = () => {
        setIsDrawerOpen(false);
    };
    const showDrawer = () => {
        setIsDrawerOpen(true);
    };

    const drawerStyles = {
        body: {
            padding: 0,
            margin: 0
        },
        mask: {
            // padding: 0,
            // margin: 0
        },
        content: {
            // padding: 0,
            // margin: 0
        },
    };

    return (
        <>
            <Button onClick={showDrawer}>
                Vezi lista de contacte
            </Button>
            <Drawer
                open={isDrawerOpen}
                onClose={handleCancel}
                placement="right"
                width="100%"
                style={{height: "100vh", padding: 0, margin: 0}}
                styles={drawerStyles}
                extra={
                    <div style={{display: "flex", alignItems: "left"}}>
                        <Input
                            placeholder={"Cauta"}
                            onChange={(e) => setText(e.target.value)}
                            style={{
                                fontStyle: "italic"
                            }}
                        />
                    </div>
                }
            >
                <EmployeesTable id={id} text={text}/>
            </Drawer>
        </>
    )
}
