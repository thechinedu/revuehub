export type Response<T = unknown> = {
  status: "success" | "fail" | "error";
  data: T;
  message?: string;
};

type User = {
  email: string;
  username: string;
  email_verified: boolean;
  provider: string;
  full_name: string;
  profile_image_url: string;
};
export type CreateUserSuccessResponse = Response<User>;
export type CreateUserErrorResponse = Response<
  Pick<User, "email" | "username"> & { password: string }
>;

type OAuthState = {
  state: string;
};
export type CreateOAuthStateSuccessResponse = Response<OAuthState>;
export type CreateOAuthStateErrorResponse = Response<OAuthState>;

export type Repo = {
  id: number;
  name: string;
  description: string;
  last_updated: string;
};
export type FetchOwnActiveReposSuccessResponse = Response<Repo[]>;
export type FetchOwnActiveReposErrorResponse = Response<null>;

export const GITHUB_AUTH_ENDPOINT = process.env
  .NEXT_PUBLIC_GITHUB_AUTH_ENDPOINT as string;
export const GITHUB_OAUTH_CLIENT_ID = process.env
  .NEXT_PUBLIC_GITHUB_OAUTH_CLIENT_ID as string;
