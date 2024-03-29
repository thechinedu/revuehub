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
  default_branch: string;
};
export type FetchReposSuccessResponse = Response<Repo[]>;
export type FetchReposErrorResponse = Response<null>;

export type FetchRepoSuccessResponse = Response<Repo>;
export type FetchRepoErrorResponse = Response<null>;
export type FetchRepoResponse =
  | FetchRepoSuccessResponse
  | FetchRepoErrorResponse;

type BaseRepoContent = {
  id: number;
  path: string;
};
type RepoContentBlob = BaseRepoContent & {
  type: "blob";
};
type RepoContentTree = BaseRepoContent & {
  type: "tree";
  contents: (RepoContentBlob | RepoContentTree)[];
};
export type RepoContent = RepoContentTree | RepoContentBlob;
export type FetchRepoContentsSuccessResponse = Response<RepoContent[]>;
export type FetchRepoContentsErrorResponse = Response<null>;
export type FetchRepoContentsResponse =
  | FetchRepoContentsSuccessResponse
  | FetchRepoContentsErrorResponse;

type FileBlobContent = {
  content: string;
};
export type FetchFileBlobContentSuccessResponse = Response<FileBlobContent>;
export type FetchFileBlobContentErrorResponse = Response<null>;
export type FetchFileBlobResponse =
  | FetchFileBlobContentSuccessResponse
  | FetchFileBlobContentErrorResponse;

export type CommentRequest = {
  content: string;
  file_path: string;
  repository_id: number;
  start_line?: number;
  end_line?: number;
  snippet?: string;
  level: "LINE" | "FILE" | "PROJECT";
  insertion_pos?: number;
  parent_comment_id?: number;
};
export type Comment = {
  id: number;
  content: string;
  created_at: string;
  insertion_pos: number;
  status: "PENDING" | "PUBLISHED";
  level: "LINE" | "FILE" | "PROJECT";
  username: string;
  profile_image_url: string;
  snippet: string;
  start_line: number;
  end_line: number;
  replies: Comment[];
};
export type FetchAllCommentsResponse = Response<Comment[]>;
export type CreateCommentResponse = Response<Comment>;

export const GITHUB_AUTH_ENDPOINT = process.env
  .NEXT_PUBLIC_GITHUB_AUTH_ENDPOINT as string;
export const GITHUB_OAUTH_CLIENT_ID = process.env
  .NEXT_PUBLIC_GITHUB_OAUTH_CLIENT_ID as string;
