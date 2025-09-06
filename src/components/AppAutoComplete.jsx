import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {AutoComplete} from "antd";
import debounce from 'lodash.debounce';
import {getCompanies, getDepartments, getEmployees, getWorkPoints} from '../api/agendaApi.jsx';
import {SearchOutlined} from "@ant-design/icons";
import {useNavigate} from "react-router-dom";
import {useIsMobile, useIsTablet} from "../services/AppService.jsx";
import queryString from 'query-string';

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
                                            inputRef,
                                            filters
                                        }) {
    const isMobile = useIsMobile()
    const isTablet = useIsTablet()
    const navigate = useNavigate();

    const [options, setOptions] = useState([]);
    const [searchValue, setSearchValue] = useState('');

    const internalRef = useRef(null)
    const finalRef = inputRef || internalRef
    const latestRequestId = useRef(0);

    const defaultFilters = useMemo(() => ({
        company: null,
        workPoint: null,
        department: null,
        job: null,
        county: null,
        phone: null
    }), []);

    filters = filters || defaultFilters

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
                        type: "company",
                        object: i
                    })),
                    ...workPoints.data.map(i => ({
                        value: `${i.name} - Punct de Lucru`,
                        key: `workpoint-${i.id}`,
                        type: "workPoint",
                        object: i
                    })),
                    ...departments.data.map(i => ({
                        value: `${i.name} ${i.company} - Departament`,
                        key: `department-${i.id}`,
                        type: "department",
                        object: i
                    })),
                    ...employees.data.map(i => ({
                        value: `${i.firstName} ${i.lastName}`,
                        key: `employee-${i.id}`,
                        type: "employee",
                        object: i
                    }))
                ].filter(option => {
                        const queryWords = normalizeString(value).split(/\s+/).filter(Boolean);
                        const optionValue = option.value.toLowerCase();
                        const hasFilters = Object.entries(filters)
                            .filter(([key]) => key !== "value")
                            .some(([, val]) => Boolean(val));

                        const isEmpty = v => v === null || v === "" || v === undefined;

                        if (hasFilters) {
                            if (option.type === "employee") {
                                return (
                                    queryWords.every(word => optionValue.includes(word)) &&
                                    (isEmpty(filters.company) || option.object.companyId === filters.company) &&
                                    (isEmpty(filters.workPoint) || option.object.workPointId === filters.workPoint) &&
                                    (isEmpty(filters.department) || option.object.departmentInfoId === filters.department) &&
                                    (isEmpty(filters.job) || option.object.jobInformationId === filters.job) &&
                                    (isEmpty(filters.county) ||
                                        workPoints.data.find(wp => wp.id === option.object.workPointId)?.county === filters.county) &&
                                    (isEmpty(filters.phone) || option.object.phoneNumber.includes(filters.phone))
                                );

                            }
                            return false
                        }
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
    }, [filters])

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
                width: isMobile ? mobileWidth : isTablet ? "500px" : desktopWidth,
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
                        // navigate(`/info/?value=${searchValue}`)

                        const params = queryString.stringify({
                            value: searchValue,
                            ...filters
                        }, { skipNull: true, skipEmptyString: true });
                        navigate(`/info/?${params.toString()}`);

                        finalRef.current.blur();
                        setModalState ? setModalState(false) : null
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
                    // navigate(`/info/?value=${searchValue}`)

                    const params = queryString.stringify({
                        value: searchValue,
                        ...filters
                    }, { skipNull: true, skipEmptyString: true });
                    navigate(`/info/?${params.toString()}`);

                    finalRef.current.blur();
                    setModalState ? setModalState(false) : null
                }
            }}
            onSelect={(value) => {
                // navigate(`/info/?value=${value}`);

                const params = queryString.stringify({
                    value: value,
                    ...filters
                }, { skipNull: true, skipEmptyString: true });

                navigate(`/info/?${params.toString()}`);
                finalRef.current.blur();
                setModalState ? setModalState(false) : null
            }}
        />
    );
}