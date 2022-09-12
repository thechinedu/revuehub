import Signup from "@/pages/sign-up";
import { render, screen, userEvent } from "@/utils/test-utils";
import { useRouter } from "next/router";

jest.mock("next/router", () => ({
  useRouter: jest
    .fn()
    .mockReturnValue({ pathname: "/sign-up", push: jest.fn() }),
}));

describe("Signup flow", () => {
  let emailInput: HTMLInputElement;
  let usernameInput: HTMLInputElement;
  let passwordInput: HTMLInputElement;
  let signupBtn: HTMLButtonElement;
  let user = userEvent.setup();
  const router = useRouter();

  beforeEach(() => {
    render(<Signup />);
    emailInput = screen.getByLabelText("email", { exact: false });
    usernameInput = screen.getByLabelText("username", { exact: false });
    passwordInput = screen.getByLabelText("password", { exact: false });
    signupBtn = screen.getByRole("button", { name: /sign up for revuehub/i });
  });

  test("signup page is rendered correctly", () => {
    const heading = screen.getByRole("heading", {
      name: /create your account/i,
    });
    expect(heading).toBeInTheDocument();
  });

  describe("when the provided credentials are correct", () => {
    test("user signup is allowed", async () => {
      expect(signupBtn).toBeDisabled();

      await user.type(emailInput, "test@example.com");
      await user.type(usernameInput, "testy");
      await user.type(passwordInput, "mein passwort ist super!");

      expect(signupBtn).not.toBeDisabled();

      await user.click(signupBtn);
      expect(router.push).toHaveBeenCalledTimes(1);
      // expect(routerPushMock).toHaveBeenCalledWith("/");
    });
  });
});
