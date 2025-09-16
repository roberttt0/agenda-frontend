import React, {useState} from 'react';
import {LockOutlined, UserOutlined} from '@ant-design/icons';
import {Button, Checkbox, Flex, Form, Input} from 'antd';
import {login} from "../api/agendaApi.jsx";
import {useNavigate} from "react-router-dom";

export default function LoginForm({user, setUser}) {

    const navigate = useNavigate()
    const [error, setError] = useState("")

    const onFinish = values => {
        login(values.username, values.password)
            .then((info) => {
                setError("")
                console.log(info)

                const loggedUser = {
                    name: values.username,
                    token: info.data
                }
                setUser(loggedUser)

                if (values.remember) {
                    localStorage.setItem("name", loggedUser.name);
                    localStorage.setItem("token", loggedUser.token);
                } else {
                    sessionStorage.setItem("name", loggedUser.name);
                    sessionStorage.setItem("token", loggedUser.token);
                }

                navigate('/')
            })
            .catch((err) => {
                setError(err.response.data.detail)
                console.log(err)
            })
    };
    return (
        <Form
            name="login"
            initialValues={{remember: true}}
            style={{maxWidth: 360}}
            onFinish={onFinish}
        >
            <Form.Item
                name="username"
                rules={[{required: true, message: 'Introdu numele!'}]}
            >
                <Input prefix={<UserOutlined/>} placeholder="Nume"/>
            </Form.Item>
            <Form.Item
                name="password"
                rules={[{required: true, message: 'Introdu parola!'}]}
            >
                <Input prefix={<LockOutlined/>} type="password" placeholder="Parola"/>
            </Form.Item>
            <Form.Item>
                <Flex justify="space-between" align="center">
                    <Form.Item name="remember" valuePropName="checked" noStyle>
                        <Checkbox>Tine-ma minte</Checkbox>
                    </Form.Item>
                </Flex>
            </Form.Item>
            <Form.Item>
                <Button block type="primary" htmlType="submit">
                    Log in
                </Button>
                <div style={{paddingTop: 16}}>
                    sau <a href={'/register'}>Inregistreaza-te!</a>
                </div>
            </Form.Item>
            {error && <p style={{color: "red", display: "flex", justifyContent: "center"}}>{error}</p>}
        </Form>
    );
};