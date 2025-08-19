import React, {useState} from "react";
import {AutoComplete} from "antd";
import {useMediaQuery} from "react-responsive";
import debounce from 'lodash.debounce'
import {getCompanies, getDepartments, getEmployees, getWorkPoints} from '../api/agendaApi.jsx'
import {SearchOutlined} from "@ant-design/icons";

export default function OldAppAutoComplete() {

    const isMobile = useMediaQuery({query: '(max-width: 768px)'});

    const [options, setOptions] = useState([]);

    const handleSearch = (value) => {
        if (value.length >= 3) {
            debounceFetcher(value)
        } else {
            debounceFetcher.cancel();
            setOptions([])
        }
    }

    const debounceFetcher = debounce((value) => {
        fetchData(value);
    }, 500)

    const fetchData = (value) => {
        Promise.all([
            getCompanies(),
            getWorkPoints(),
            getDepartments(),
            getEmployees()
        ])
            .then(([companies, workPoints, departments, employees]) => {

                if (value.length < 3) return;

                const options = [
                    ...companies.data.map(i => ({
                        value: `${i.name} - Companie`,
                        key: `company-${i.id}`
                    })),
                    ...workPoints.data.map(i => ({
                        value: `${i.name} - Punct de Lucru`,
                        key: `workpoint-${i.id}`
                    })),
                    ...departments.data.map(i => ({
                        value: `${i.name} ${i.company} - Departament`,
                        key: `department-${i.id}`
                    })),
                    ...employees.data.map(i => ({
                        value: `${i.firstName} ${i.lastName}`,
                        key: `employee-${i.id}`
                    }))
                ];

                setOptions(options);
            })
            .catch(err => {
                console.error(err);
            });
    };

    return (
        <AutoComplete
            style={{
            ...(isMobile ? {width: "260px"} : {width: "800px"}),
            textAlign: "center", fontStyle: "italic"
            }}

            placeholder={isMobile ? "Cauta in agenda" : "Nume de persoane, puncte de lucru, departamente, companii"}
            filterOption={(inputValue, option) =>
                option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
            }
            size={isMobile ? "medium" : "large"}
            options={options}
            onChange={handleSearch}
            suffixIcon={<SearchOutlined style={{
                ...(isMobile ? {fontSize: '20px'} : {fontSize: '28px'}),
                color: '#F68E1E'
            }}/>}
        />
    );
}