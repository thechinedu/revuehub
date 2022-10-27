const API_URL = process.env.NEXT_PUBLIC_API_URL as string;
const API_VERSION = "v1";

export const get = async <T = unknown>(path: string): Promise<T> => {
  try {
    const res = await fetch(new URL(`${API_VERSION}${path}`, API_URL), {
      headers: {
        Accept: "application/json",
      },
    });

    if (res.status < 400) return Promise.resolve(await res.json());

    // if status is 401
    // try refresh endpoint

    return Promise.reject(await res.json());
  } catch (err) {
    return Promise.reject(err);
  }
};

export const post = async <T = unknown, U = unknown>(
  path: string,
  body: T
): Promise<U> => {
  try {
    const res = await fetch(new URL(`${API_VERSION}${path}`, API_URL), {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      credentials: "include",
    });

    if (res.status === 204) return Promise.resolve(null as U);

    if (res.status < 400) return Promise.resolve(await res.json());

    return Promise.reject(await res.json());
  } catch (err) {
    return Promise.reject(err); // TODO: integrate with error monitoring service
  }
};

const tryRefreshAuthTokens = async () => {
  try {
    const res = await fetch(new URL(`${API_VERSION}/auth/refresh`, API_URL), {
      method: "POST",
      credentials: "include",
    });
  } catch (err) {}
};
