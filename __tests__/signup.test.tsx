import Signup from "@/pages/sign-up";
import { render, screen } from "@/utils/test-utils";

jest.mock("next/router", () => ({
  useRouter: jest.fn().mockReturnValue({ pathname: "/sign-up" }),
}));

describe("Signup flow", () => {
  beforeEach(() => {
    render(<Signup />);
  });

  test("signup page is rendered correctly", () => {
    const heading = screen.getByRole("heading", {
      name: /create your account/i,
    });
    expect(heading).toBeInTheDocument();
  });
});
