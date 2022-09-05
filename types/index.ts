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

type OauthState = {
  state: string;
};

export type CreateUserSuccessResponse = Response<User>;

export type CreateUserErrorResponse = Response<
  Pick<User, "email" | "username"> & { password: string }
>;

export type CreateOauthStateSuccessResponse = Response<OauthState>;
export type CreateOauthStateErrorResponse = Response<OauthState>;

export const GITHUB_AUTH_ENDPOINT = process.env
  .NEXT_PUBLIC_GITHUB_AUTH_ENDPOINT as string;
export const GITHUB_OAUTH_CLIENT_ID = process.env
  .NEXT_PUBLIC_GITHUB_OAUTH_CLIENT_ID as string;
