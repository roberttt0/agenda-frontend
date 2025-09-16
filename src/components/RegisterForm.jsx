import React, {useContext, useState} from 'react';
import {Button, Flex, Form, Input} from 'antd';
import {login, register} from "../api/agendaApi.jsx";
import {UserContext} from "../App.jsx";
import {LockOutlined, UserOutlined} from "@ant-design/icons";

export default function RegisterForm({registerSucces, setRegisterSucces}) {

    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const {user, setUser} = useContext(UserContext)

    const onFinish = values => {
        setLoading(true)
        register(values.name, values.password)
            .then(() => {
                setError("")
                login(values.name, values.password)
                    .then((info) => {
                        const loggedUser = {
                            name: values.name,
                            token: info.data
                        }
                        setRegisterSucces(true)
                        localStorage.setItem("name", loggedUser.name);
                        localStorage.setItem("token", loggedUser.token);

                        setTimeout(() => {
                            setUser(loggedUser)

                        }, 3000)
                    })
                    .catch(err => {
                        console.log(err)
                    })
            })
            .catch((err) => {
                setError(err.response.data.detail)
                console.log(err)
            })
            .finally(() => {
                setLoading(false)
            })

    };

    return (
        !registerSucces ? (
            <Form
                name="register"
                // labelCol={{span: 8}}
                // wrapperCol={{span: 16}}
                // style={{maxWidth: 600}}
                onFinish={onFinish}
                autoComplete="off"
            >
                <Form.Item
                    name="name"
                    rules={[{required: true, message: 'Introdu numele!'}]}
                >
                    <Input prefix={<UserOutlined/>} placeholder="Nume"/>
                </Form.Item>

                <Form.Item
                    name="password"
                    rules={[{required: true, message: 'Introdu parola!'}]}
                >
                    <Input.Password prefix={<LockOutlined />} placeholder="Parola" />
                </Form.Item>

                <Form.Item label={null}>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Creeaza cont
                    </Button>
                    <div style={{paddingTop: 16}}>
                    </div>
                </Form.Item>
                <Form.Item label={null}>
                    sau <a href={'/login'}>Autentifica-te!</a>
                </Form.Item>
                {error && <p style={{color: "red", display: "flex", justifyContent: "center"}}>{error}</p>}
            </Form>
        ) : (
            <Flex justify={"center"} align={"center"} style={{fontSize: "30px"}}>
                Te-ai inregistrat cu succes! Vei fi redirectionat in curand...
            </Flex>
        )
    );
}

