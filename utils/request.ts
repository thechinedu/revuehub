const API_URL = process.env.NEXT_PUBLIC_API_URL as string;
const API_VERSION = "v1";

const getUrl = (path: string) => new URL(`${API_VERSION}${path}`, API_URL);

export const get = async <T = unknown>(path: string): Promise<T> => {
  const url = getUrl(path);

  try {
    const res = await fetch(url, {
      headers: {
        Accept: "application/json",
      },
      credentials: "include",
    });

    if (res.status === 401) {
      return refreshAuthTokenAndCompleteRequest(path, get) as T;
    }

    return handleResponse<T>(res);
  } catch (err) {
    return Promise.reject(err);
  }
};

export const post = async <T = unknown, U = unknown>(
  path: string,
  body: T
): Promise<U> => {
  const url = getUrl(path);

  try {
    const res = await fetch(url, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      credentials: "include",
    });

    if (res.status === 401) {
      return refreshAuthTokenAndCompleteRequest(path, post, body) as U;
    }

    if (res.status === 204) return Promise.resolve(null as U);

    if (res.status < 400) return Promise.resolve(await res.json());

    return Promise.reject(await res.json());
  } catch (err) {
    return Promise.reject(err); // TODO: integrate with error monitoring service
  }
};

const refreshAuthTokenAndCompleteRequest = async (
  path: string,
  httpFn: (path: string, body?: unknown) => Promise<unknown>,
  body?: unknown
): Promise<unknown> => {
  const url = new URL(`${API_VERSION}/auth/refresh`, API_URL);
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      credentials: "include",
    });

    if (res.status === 401) return Promise.reject(await res.json());

    if (res.status < 400) {
      return await httpFn(path, body);
    }
  } catch (err) {
    return Promise.reject(err);
  }
};

const handleResponse = async <T>(res: Response): Promise<T> => {
  if (res.status < 400) return Promise.resolve(await res.json());

  return Promise.reject(await res.json());
};
