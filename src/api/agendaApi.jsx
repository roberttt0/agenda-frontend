import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost/api"
});

const getCompanies = () => api.get('/companies');
const getDepartments = () => api.get('/departments');
const getEmployees = () => api.get('/employees');
const getWorkPoints = () => api.get('/work-points');
const getJobs = () => api.get('/jobs');
const getEmployeesByWorkPointId = (id) => api.get (`/work-points/${id}/employees`)
const getWorkPointById = (id) => api.get(`/work-points/${id}`)

export { getCompanies, getDepartments, getEmployees, getWorkPoints, getEmployeesByWorkPointId, getWorkPointById, getJobs }