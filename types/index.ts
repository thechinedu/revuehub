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
