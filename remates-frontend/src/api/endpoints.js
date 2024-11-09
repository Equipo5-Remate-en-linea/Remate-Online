//const localUrl = "http://localhost:5000";
const productionUrl = "http://localhost:5000";

//const baseUrl = window.location.hostname === "localhost" ? localUrl : productionUrl;
const baseUrl = productionUrl;
const endpoints = {
  productos: baseUrl + "/productos",
  usuarios: baseUrl + "/usuarios",
  categorias: baseUrl + "/categorias",
  login: baseUrl + "/auth/login",
  usuarioAdmin: baseUrl + "/usuarios/admin",
  images: baseUrl + "/images",
};

export default endpoints;
