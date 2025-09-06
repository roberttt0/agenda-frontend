import {useMediaQuery} from "react-responsive";


const normalizeString = (str="") => {
    return str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
}

function useIsMobile() {
    return useMediaQuery({ query: "(max-width: 768px)" });
}

export function useIsTablet() {
    return useMediaQuery({ query: '(min-width: 768px) and (max-width: 1024px)' });
}

export {normalizeString, useIsMobile}