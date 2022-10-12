import {
  CreateOAuthStateErrorResponse,
  CreateOAuthStateSuccessResponse,
  GITHUB_AUTH_ENDPOINT,
  GITHUB_OAUTH_CLIENT_ID,
} from "@/types";

import { post } from "@/utils";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";

import { MouseEvent, ReactNode, useState } from "react";

type OAuthStateAttributes = {
  provider: string;
};

type OAuthButtonProps = {
  className?: string;
  provider: string;
  scope: string;
  children: ReactNode;
};

type CreateOAuthStateServerError = CreateOAuthStateErrorResponse["data"];

const authEndpoint = GITHUB_AUTH_ENDPOINT;
const clientID = GITHUB_OAUTH_CLIENT_ID;

const createOAuthState = (oauthStateAttributes: OAuthStateAttributes) =>
  post<
    OAuthStateAttributes,
    CreateOAuthStateErrorResponse | CreateOAuthStateSuccessResponse
  >("/auth/oauth/state", oauthStateAttributes);

const oauthRedirectPaths = {
  "/": {
    error: "/sign-up",
    success: "/dashboard",
  },
  "/sign-up": {
    error: "/sign-up",
    success: "/dashboard",
  },
  "/sign-in": {
    error: "/sign-in",
    success: "/dashboard",
  },
  "/dashboard": {
    error: "/dashboard",
    success: "/repos/new",
  },
};

export const OAuthButton = ({
  className = "",
  provider,
  scope,
  children,
}: OAuthButtonProps): JSX.Element => {
  const router = useRouter();
  const [isMutationActive, setIsMutationActive] = useState(false);
  const [error, setError] = useState<CreateOAuthStateServerError | null>(null);
  const createOAuthStateMutation = useMutation(
    (oauthStateAttributes: OAuthStateAttributes) =>
      createOAuthState(oauthStateAttributes),
    {
      onMutate: () => setIsMutationActive(true),
      onError: (err: CreateOAuthStateErrorResponse) => {
        setError(err.data);
      },
      onSuccess: ({ data: { state } }: CreateOAuthStateSuccessResponse) => {
        localStorage.setItem(
          "oauth-redirect-path",
          JSON.stringify(
            oauthRedirectPaths[
              router.pathname as keyof typeof oauthRedirectPaths
            ]
          )
        );
        // TODO: receive scope, client_id & auth_endpoint
        location.href = `${authEndpoint}?client_id=${clientID}&state=${state}&scope=${scope}`;
      },
      onSettled: () => setIsMutationActive(false),
    }
  );

  const handleOAuthIntegration =
    (provider: string) => async (evt: MouseEvent<HTMLAnchorElement>) => {
      evt.preventDefault();

      // Prevent additional clicks on the oauth anchor element when it is clicked once
      if (isMutationActive) return;

      createOAuthStateMutation.mutate({ provider });
    };

  return (
    <>
      <a
        className={className}
        onClick={handleOAuthIntegration(provider)}
        href="#"
      >
        {children}
      </a>
      {/* TODO: Remove this and Show toast message on redirected page instead */}
      {error?.state && <span>{error.state}</span>}
    </>
  );
};
