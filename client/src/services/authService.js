export async function registerWithEmail(email, password, options = {}) {
  const response = await fetch("/api/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
    ...options,
  });

  if (!response.ok) {
    throw new Error("Registration failed");
  }
}

export async function login(email, password, options = {}) {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
    ...options,
  });

  if (!response.ok) {
    throw new Error("Login failed");
  }
}
