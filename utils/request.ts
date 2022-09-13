const API_URL = process.env.NEXT_PUBLIC_API_URL as string;
const API_VERSION = "v1";

export const get = (path: string) => {};

export const post = <T = unknown, U = unknown>(
  path: string,
  body: T
): Promise<U> =>
  new Promise(async (resolve, reject) => {
    try {
      const res = await fetch(new URL(`${API_VERSION}${path}`, API_URL), {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      if (res.status < 400) return resolve(await res.json());

      return reject(await res.json());
    } catch (err) {
      return reject(err); // TODO: integrate with error monitoring service
    }
  });
