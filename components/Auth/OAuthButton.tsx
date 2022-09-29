import {
  CreateOauthStateErrorResponse,
  CreateOauthStateSuccessResponse,
  GITHUB_AUTH_ENDPOINT,
  GITHUB_OAUTH_CLIENT_ID,
} from "@/types";

import { post } from "@/utils";

import { useMutation } from "@tanstack/react-query";

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

type CreateOauthStateServerError = CreateOauthStateErrorResponse["data"];

const authEndpoint = GITHUB_AUTH_ENDPOINT;
const clientID = GITHUB_OAUTH_CLIENT_ID;

const createOauthState = (oauthStateAttributes: OAuthStateAttributes) =>
  post<
    OAuthStateAttributes,
    CreateOauthStateErrorResponse | CreateOauthStateSuccessResponse
  >("/auth/oauth/state", oauthStateAttributes);

export const OAuthButton = ({
  className = "",
  provider,
  scope,
  children,
}: OAuthButtonProps): JSX.Element => {
  const [isMutationActive, setIsMutationActive] = useState(false);
  const [error, setError] = useState<CreateOauthStateServerError | null>(null);
  const createOauthStateMutation = useMutation(
    (oauthStateAttributes: OAuthStateAttributes) =>
      createOauthState(oauthStateAttributes),
    {
      onMutate: () => setIsMutationActive(true),
      onError: (err: CreateOauthStateErrorResponse) => {
        setError(err.data);
      },
      onSuccess: ({ data: { state } }: CreateOauthStateSuccessResponse) => {
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

      createOauthStateMutation.mutate({ provider });
    };

  return (
    <>
      <a className={className} onClick={handleOAuthIntegration(provider)}>
        {children}
      </a>
      {error?.state && <span>{error.state}</span>}
    </>
  );
};
