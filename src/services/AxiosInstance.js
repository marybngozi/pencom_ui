import axios from "axios";
import Swal from "sweetalert2";

// SECURE AXIOS
export const secureAxios = axios.create({
  baseURL: process.env.VUE_APP_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

secureAxios.interceptors.request.use((config) => {
  const token = localStorage.getItem(process.env.VUE_APP_tokenName);

  if (!token) {
    window.location.href = "/";
    return;
  }

  const AuthStr = "Bearer ".concat(token);

  config.headers.Authorization = AuthStr;

  return config;
});

secureAxios.interceptors.response.use(
  (response) => {
    return response;
  },
  (err) => {
    console.log({ err });

    if (!err.response || err.response.status == 500) {
      Swal.fire({
        text: "Internal Server Error, if error persist please contact admin",
        icon: "info",
        autoClose: 5000,
        theme: "dark",
      });

      return false;
    }

    const error_message = err.response.data.message;

    Swal.fire({
      title: "Error!",
      text: error_message,
      icon: "error",
      allowOutsideClick: false,
    });

    return false;
  }
);

// GUEST AXIOS
export const guestAxios = axios.create({
  baseURL: process.env.VUE_APP_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

guestAxios.interceptors.request.use((config) => {
  return config;
});

guestAxios.interceptors.response.use(
  (response) => {
    return response;
  },
  (err) => {
    console.log({ err });

    if (!err.response || err.response.status == 500) {
      Swal.fire({
        text: "Internal Server Error, if error persist please contact admin",
        icon: "info",
      });

      return false;
    }

    const error_message = err.response.data.message;

    Swal.fire({
      title: "Error!",
      text: error_message,
      icon: "error",
      allowOutsideClick: false,
    });

    return false;
  }
);
