import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {AutoComplete} from "antd";
import {useMediaQuery} from "react-responsive";
import debounce from 'lodash.debounce';
import {getCompanies, getDepartments, getEmployees, getWorkPoints} from '../api/agendaApi.jsx';
import {SearchOutlined} from "@ant-design/icons";

export default function AppAutoComplete() {
    const isMobile = useMediaQuery({query: '(max-width: 768px)'});

    const [options, setOptions] = useState([]);
    const [searchValue, setSearchValue] = useState('');

    const latestRequestId = useRef(0);

    const fetchData = useCallback((value) => {
        const requestId = ++latestRequestId.current;

        Promise.all([
            getCompanies(),
            getWorkPoints(),
            getDepartments(),
            getEmployees()
        ])
            .then(([companies, workPoints, departments, employees]) => {
                if (requestId !== latestRequestId.current) {
                    return;
                }

                const filteredOptions = [
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
                ].filter(option =>
                    option.value.toUpperCase().includes(value.toUpperCase())
                );

                setOptions(filteredOptions);
            })
            .catch(err => {
                if (requestId === latestRequestId.current) {
                    console.error(err);
                }
            });
    }, [])

    const debounceFetcher = useMemo(() => {
        return (
            debounce(fetchData, 500)
        )
    }, [fetchData] )

    useEffect(() => {
        if (searchValue.length >= 3) {
            debounceFetcher(searchValue);
        } else {
            debounceFetcher.cancel();
            setOptions([]);
            latestRequestId.current = 0;
        }

        return () => {
            debounceFetcher.cancel();
        };
    }, [searchValue, debounceFetcher]);

    return (
        <AutoComplete
            style={{
                ...(isMobile ? {width: "260px"} : {width: "800px"}),
                textAlign: "center", fontStyle: "italic"
            }}
            placeholder={isMobile ? "Cauta in agenda" : "Nume de persoane, puncte de lucru, departamente, companii"}
            filterOption={false}
            size={isMobile ? "medium" : "large"}
            options={options}
            value={searchValue}
            onChange={(data) => setSearchValue(data)}
            suffixIcon={<SearchOutlined style={{
                ...(isMobile ? {fontSize: '20px'} : {fontSize: '28px'}),
                color: '#F68E1E'
            }}/>}
        />
    );
}