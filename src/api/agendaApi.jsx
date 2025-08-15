import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost/api"
});

const getCompanies = () => api.get('/companies');
const getDepartments = () => api.get('/departments');
const getEmployees = () => api.get('/employees');
const getWorkPoints = () => api.get('/work-points');

export { getCompanies, getDepartments, getEmployees, getWorkPoints }