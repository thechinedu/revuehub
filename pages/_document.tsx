import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta
          name="description"
          content="Review github repositories without the need for pull requests. RevueHub provides line-by-line commenting,
review and conversation tools that enable easy and seamless collaboration between reviewers and repository owners"
        />
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Sora:wght@400;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Fira+Code&display=swap"
          rel="stylesheet"
        />
      </Head>
      {/* Radix-ui injects styles that cause the page to shift when a dialog box is rendered. This ensures that the injected style is overwritten */}
      <body style={{ marginRight: "0 !important" }}>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
