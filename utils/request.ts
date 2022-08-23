const API_URL = process.env.NEXT_PUBLIC_API_URL as string;

export const get = (path: string) => {};

export const post = <T = unknown>(path: string, body: T) =>
  new Promise(async (resolve, reject) => {
    const res = await fetch(`${API_URL}${path}`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    if (res.status < 400) resolve(await res.json());

    reject(await res.json());
  });
