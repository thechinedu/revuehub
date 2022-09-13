import "@testing-library/jest-dom/extend-expect";
import { server } from "@/mocks/server";
import { loadEnvConfig } from "@next/env";
import fetch from "node-fetch";

const projectDir = process.cwd();
loadEnvConfig(projectDir);

globalThis.fetch = fetch as unknown as typeof globalThis.fetch;

beforeAll(() => server.listen());

afterEach(() => server.resetHandlers());

afterAll(() => server.close());
