//const localUrl = "http://localhost:5000";
const productionUrl = "http://168.61.72.242:5000";
const localUrl = "http://localhost:5000";

const baseUrl = window.location.hostname === "168.61.72.242" ? productionUrl : localUrl;

const endpoints = {
  productos: baseUrl + "/productos",
  usuarios: baseUrl + "/usuarios",
  categorias: baseUrl + "/categorias",
  login: baseUrl + "/auth/login",
  usuarioAdmin: baseUrl + "/usuarios/admin",
  images: baseUrl + "/images",
};

export default endpoints;
