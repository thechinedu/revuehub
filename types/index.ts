export type Response<T = unknown> = {
  status: "success" | "fail" | "error";
  data: T;
  message?: string;
};

// TODO: Make success and error response consistent
// e.g CreateOAuthStateSuccessResponse/FetchReposSuccessResponse
// & CreateOAuthStateErrorResponse/FetchReposErrorResponse
// should just be CreateOAuthStateResponse/FetchReposResponse

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
export enum Attributes {
  EMAIL = "email",
  USERNAME = "username",
  PASSWORD = "password",
}

export type UserAttributes = {
  [Attributes.EMAIL]: string;
  [Attributes.USERNAME]: string;
  [Attributes.PASSWORD]: string;
};

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
  has_pulled_content: boolean;
};
export type FetchReposSuccessResponse = Response<Repo[]>;
export type FetchReposErrorResponse = Response<null>;

export const GITHUB_AUTH_ENDPOINT = process.env
  .NEXT_PUBLIC_GITHUB_AUTH_ENDPOINT as string;
export const GITHUB_OAUTH_CLIENT_ID = process.env
  .NEXT_PUBLIC_GITHUB_OAUTH_CLIENT_ID as string;
