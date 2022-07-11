import "modern-css-reset";
import "@/styles/globals.css";

import Container from "@/components/Container";
import type { AppProps } from "next/app";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Container>
      <Component {...pageProps} />
    </Container>
  );
}

export default MyApp;
