import "@testing-library/jest-dom/extend-expect";
import { server } from "@/mocks/server";
import { loadEnvConfig } from "@next/env";
import fetch from "node-fetch";

type Fetch = typeof globalThis.fetch & {
  Request: typeof globalThis.Request;
};

const projectDir = process.cwd();
loadEnvConfig(projectDir);

globalThis.fetch = fetch as unknown as Fetch;
globalThis.Request = (fetch as unknown as Fetch).Request;

beforeAll(() => server.listen());

afterEach(() => server.resetHandlers());

afterAll(() => server.close());
