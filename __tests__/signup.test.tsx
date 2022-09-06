import Signup from "@/pages/sign-up";
import { render, screen } from "@/utils/test-utils";

const useRouter = jest.spyOn(require("next/router"), "useRouter");

useRouter.mockImplementation(() => ({
  pathname: "/sign-up",
}));

describe("Signup flow", () => {
  beforeEach(() => {
    render(<Signup />);
  });

  test("signup page is rendered correctly", () => {
    const heading = screen.getByText("Create your account");
    expect(heading).toBeInTheDocument();
  });
});
