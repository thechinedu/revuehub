import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, RenderOptions } from "@testing-library/react";
import { ReactElement, ReactNode } from "react";

type MainAppProps = {
  children: ReactNode;
};

const queryClient = new QueryClient();

const Providers = ({ children }: MainAppProps): JSX.Element => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) => render(ui, { wrapper: Providers, ...options });

export * from "@testing-library/react";
export * from "@testing-library/user-event";
export { customRender as render };
