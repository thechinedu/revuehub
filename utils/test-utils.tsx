import { AuthProvider } from "@/providers/AuthProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, RenderOptions } from "@testing-library/react";
import { ReactElement, ReactNode } from "react";

type MainAppProps = {
  children: ReactNode;
};

const queryClient = new QueryClient();

const Providers = ({ children }: MainAppProps): JSX.Element => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>{children}</AuthProvider>
  </QueryClientProvider>
);

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) => render(ui, { wrapper: Providers, ...options });

export { screen } from "@testing-library/react";
export { default as userEvent } from "@testing-library/user-event";
export { customRender as render };
