const baseUrl = "http://168.61.72.242:5000";

const endpoints = {
  productos: baseUrl + "/productos",
  usuarios: baseUrl + "/usuarios",
  categorias: baseUrl + "/categorias",
  login: baseUrl + "/auth/login",
  usuarioAdmin: baseUrl + "/usuarios/admin",
  images: baseUrl + "/images",
};

export default endpoints;
