import React, {useState} from "react";
import {AutoComplete} from "antd";
import {useMediaQuery} from "react-responsive";
import debounce from 'lodash.debounce'
import {getEmployees} from '../api/agendaApi.jsx'

export default function AppAutoComplete() {

    const isMobile = useMediaQuery({query: '(max-width: 768px)'});

    const [options, setOptions] = useState([]);

    const handleSearch = (value) => {
        if (value.length >= 3) {
            debounceFetcher()
        } else {
            debounceFetcher.cancel();
            setOptions([])
        }
    }

    const debounceFetcher = debounce(() => {
        fetchData();
    }, 500)

    const fetchData = () => {
        getEmployees()
            .then((result) => {
                setOptions(result.data.map(userObject => ({
                    value: userObject.firstName + " " + userObject.lastName,
                    key: userObject.id
                })))
            })
            .catch((err) => {
                console.log(err)
            })
    }

    return (
        <AutoComplete
            style={isMobile ? {width: "260px"} : {width: "800px"}}
            placeholder={isMobile ? "Persoane, magazine, departamente" : "Nume de persoane, magazine, departamente"}
            filterOption={(inputValue, option) =>
                option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
            }
            size={isMobile ? "medium" : "large"}
            options={options}
            onChange={handleSearch}
        />
    );
}