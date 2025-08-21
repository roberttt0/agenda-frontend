import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {AutoComplete} from "antd";
import {useMediaQuery} from "react-responsive";
import debounce from 'lodash.debounce';
import {getCompanies, getDepartments, getEmployees, getWorkPoints} from '../api/agendaApi.jsx';
import {SearchOutlined} from "@ant-design/icons";
import {useNavigate} from "react-router-dom";

export default function AppAutoComplete({
                                            desktopWidth,
                                            mobileWidth,
                                            placeholder,
                                            mobilePlaceholder,
                                            desktopSize,
                                            mobileSize,
                                            mobileSufix,
                                            desktopSufix,
                                            setModalState,
                                            inputRef
                                        }) {
    const isMobile = useMediaQuery({query: '(max-width: 768px)'});
    const navigate = useNavigate();

    const [options, setOptions] = useState([]);
    const [searchValue, setSearchValue] = useState('');

    const internalRef = useRef(null)
    const finalRef = inputRef || internalRef
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
                        key: `company-${i.id}`,
                        type: "company"
                    })),
                    ...workPoints.data.map(i => ({
                        value: `${i.name} - Punct de Lucru`,
                        key: `workpoint-${i.id}`,
                        type: "workPoint"
                    })),
                    ...departments.data.map(i => ({
                        value: `${i.name} ${i.company} - Departament`,
                        key: `department-${i.id}`,
                        type: "department"
                    })),
                    ...employees.data.map(i => ({
                        value: `${i.firstName} ${i.lastName}`,
                        key: `employee-${i.id}`,
                        type: "employee"
                    }))
                ].filter(option => {
                        const queryWords = normalizeString(value).split(/\s+/).filter(Boolean);
                        const optionValue = option.value.toLowerCase();

                        return queryWords.every(word => optionValue.includes(word));
                    }
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
    }, [fetchData])

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

    const normalizeString = (str) => {
        return str
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase();
    }

    return (
        <AutoComplete
            ref={finalRef}
            style={{
                width: isMobile ? mobileWidth : desktopWidth,
                textAlign: "center",
                fontStyle: "italic"
            }}
            placeholder={isMobile ? mobilePlaceholder : placeholder}
            filterOption={false}
            size={isMobile ? mobileSize : desktopSize}
            options={options}
            value={searchValue}
            onChange={(data) => setSearchValue(data)}
            suffixIcon={
                <span
                    onClick={() => {
                        navigate(`/info/?value=${searchValue}`)
                        finalRef.current.blur();
                        setModalState(false);
                    }
                    }
                >
                    <SearchOutlined style={{
                        ...(isMobile ? {fontSize: mobileSufix} : {fontSize: desktopSufix}),
                        color: '#F68E1E'
                    }}/>
                </span>}
            onInputKeyDown={(e) => {
                if (e.key === "Enter") {
                    navigate(`/info/?value=${searchValue}`)
                    finalRef.current.blur();
                    setModalState(false)
                }
            }}
            onSelect={(value) => {
                navigate(`/info/?value=${value}`);
                finalRef.current.blur();
                setModalState(false)
            }}
        />
    );
}