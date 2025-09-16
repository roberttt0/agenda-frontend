import {useMediaQuery} from "react-responsive";

const normalizeString = (str = "") => {
    return str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
}

function useIsMobile() {
    return useMediaQuery({query: "(max-width: 768px)"});
}

export function useIsTablet() {
    return useMediaQuery({query: '(min-width: 768px) and (max-width: 1024px)'});
}

export function logOut() {
    localStorage.removeItem("name")
    localStorage.removeItem("token")
    sessionStorage.removeItem("name")
    sessionStorage.removeItem("token")
    window.location.reload();
}

export function getMenu(user)  {
    return [
        {
            key: "text",
            label: (
                <span style={{fontWeight: 'bold', color: '#555', cursor: "default"}}>
                    Salut, {user.name}
                </span>
            ),
            disabled: true
        },
        {
            type: 'divider',
        },
        {
            key: '1',
            label: <a onClick={logOut}>Delogare</a>,
        }
    ]
}


export {normalizeString, useIsMobile}