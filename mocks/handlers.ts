import { rest } from "msw";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const mockUser = {
  id: 1,
  email: "test@example.com",
  username: "testy",
  full_name: "",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  email_verified: false,
  provider: "",
  profile_image_url: "",
};

export const handlers = [
  rest.post(`${API_URL}/v1/users`, (req, res, ctx) => {
    return res(
      ctx.status(201),
      ctx.json({
        status: "success",
        data: mockUser,
      })
    );
  }),
];
