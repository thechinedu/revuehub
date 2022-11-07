import styles from "./Auth.module.css";

import Container from "@/components/Container";
import { Navbar } from "@/components/Navbar";

import Head from "next/head";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { post } from "@/utils";
import { AuthStatus, useAuth } from "@/providers/AuthProvider";

type OAuthCallbackAttributes = {
  code: string;
  state: string;
};

const createUserViaOauth = (oauthCallbackAttributes: OAuthCallbackAttributes) =>
  post("/users/oauth/new", oauthCallbackAttributes);

export const OAuthCallback = (): JSX.Element => {
  const {
    query: { code, state },
    push,
  } = useRouter();
  const redirectPath = useRef<{ error: string; success: string }>();
  const { authStatus, setAuthStatus } = useAuth();

  const mutation = useMutation(
    () => createUserViaOauth({ code, state } as OAuthCallbackAttributes),
    {
      onError: (err) => {
        const path = redirectPath.current?.error;

        if (path) {
          console.log("error", err);
          push(path);
          return;
        }

        push("/sign-up");
      },
      onSuccess: (data) => {
        const path = redirectPath.current?.success;

        if (path) {
          if (authStatus !== AuthStatus.SIGNED_IN && path === "/dashboard") {
            setAuthStatus(AuthStatus.SIGNED_IN);
          }
          console.log("success::OAUTH", data);
          push(path);
          return;
        }

        push("/");
      },
      onSettled: () => {
        localStorage.removeItem("oauth-redirect-path");
      },
    }
  );

  useEffect(() => {
    if (code && state) mutation.mutate();
  }, [code, state]);

  useEffect(() => {
    redirectPath.current = JSON.parse(
      localStorage.getItem("oauth-redirect-path") ?? "{}"
    );
  }, []);

  return (
    <>
      <Head>
        <title>RevueHub - social login</title>
      </Head>

      <Container className={styles.container}>
        <Navbar />

        <main className={styles.main}>
          <p>Loading...</p>
        </main>
      </Container>
    </>
  );
};
