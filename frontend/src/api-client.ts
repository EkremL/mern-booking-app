import { SignInFormData } from "./pages/Login";
import { RegisterFormData } from "./pages/Register";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
//! frontend ve backendi bağlayan statik yönlendirmeden sonra bu linki kullanmadan da 2 tarafı aynı yerde çalıstırdık bu yüzden yanına || "" ekledik

//!REGISTER FETCH
export const register = async (formData: RegisterFormData) => {
  const response = await fetch(`${API_BASE_URL}/api/users/register`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  const responseBody = await response.json();
  if (!response.ok) {
    throw new Error(responseBody.message);
  }
};

//!LOGIN FETCH
export const Login = async (formData: SignInFormData) => {
  const response = await fetch(`${API_BASE_URL}/api/users/login`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  const body = await response.json();
  if (!response.ok) {
    throw new Error(body.message);
  }
  return body;
};

//!VALIDATE TOKEN FETCH
export const validateToken = async () => {
  const response = await fetch(`${API_BASE_URL}/api/users/validate-token`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Invalid token");
  }

  return response.json();
};

//!LOGOUT FETCH
export const Logout = async () => {
  const response = await fetch(`${API_BASE_URL}/api/users/logout`, {
    credentials: "include",
    method: "POST",
  });

  if (!response.ok) {
    throw new Error("Failed to log out");
  }
};

export const addMyHotel = async (hotelFormData: FormData) => {
  const response = await fetch(`${API_BASE_URL}/api/my-hotels`, {
    method: "POST",
    credentials: "include",
    body: hotelFormData,
  });
  if (!response.ok) {
    throw new Error("Failed to add hotel!");
  }
  return response.json();
};
