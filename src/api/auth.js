import { API_BASE } from "./config.js";

export async function registerUser({ name, email, password }) {
  const url = `${API_BASE}/auth/register`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      email,
      password,
    }),
  });

  const data = await response.json();

  let errorMessage = "Something went wrong during registration.";

  if (!response.ok) {
    if (data && data.errors && data.errors.length > 0) {
      errorMessage = data.errors[0].message;
    } else if (data && data.message) {
      errorMessage = data.message;
    }

    throw new Error(errorMessage);
  }

  return data;
}

export async function loginUser({ email, password }) {
  const url = `${API_BASE}/auth/login`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  const data = await response.json();

  let errorMessage = "Something went wrong during login.";

  if (!response.ok) {
    if (data && data.errors && data.errors.length > 0) {
      errorMessage = data.errors[0].message;
    } else if (data && data.message) {
      errorMessage = data.message;
    }

    throw new Error(errorMessage);
  }

  return data;
}