let refreshPromise = null;

async function tryRefresh() {
  if (!refreshPromise) {
    refreshPromise = fetch("/api/auth/refresh", {
      method: "POST",
      credentials: "include",
    })
      .then((response) => {
        if (response.status === 401) {
          throw new Error("Unauthorized");
        }
        return response.json();
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

/**
 * Performs a fetch request to a protected API endpoint. If the response is a 401,
 * it automatically attempts to refresh the session and retries the original request.
 *
 * @param {string} url - The API endpoint to fetch.
 * @param {RequestInit} [options={}] - Optional fetch options (headers, method, body, etc.).
 * @returns {Promise<Response>} The final response object from the original or retried request.
 * @throws {Error} If both the original request and refresh attempt fail with 401.
 */
async function authFetch(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    credentials: "include",
  });

  if (response.status !== 401) {
    return response;
  }

  try {
    await tryRefresh();
    return fetch(url, {
      ...options,
      credentials: "include",
    });
  } catch (err) {
    throw new Error("Unauthorized");
  }
}

export default authFetch;
