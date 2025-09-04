import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost/api"
});

export const getCompanies = () => api.get('/companies');
export const getDepartments = () => api.get('/departments');
export const getEmployees = () => api.get('/employees');
export const getWorkPoints = () => api.get('/work-points');
export const getJobs = () => api.get('/jobs');
export const getEmployeesByWorkPointId = (id) => api.get(`/work-points/${id}/employees`)
export const getWorkPointById = (id) => api.get(`/work-points/${id}`)
export const getCompany = (id) => api.get(`/companies/${id}`)
export const getDepartmentById = (id) => api.get(`/departments/${id}`)
export const getDepartmentsInfo = () => api.get(`/departments-info`)
export const getCompaniesDepartments = () => api.get(`/companies/departments`)
export const getWorkPointsDepartments = () => api.get(`/work-points/departments`)
