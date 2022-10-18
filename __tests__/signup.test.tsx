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
      expect(router.push).toHaveBeenCalledWith("/dashboard");
    });
  });

  describe("when the provided credentials are incorrect", () => {
    // TODO: Add test case for when email is already in use by another user
    test("user signup is disallowed when email is invalid", async () => {
      await user.type(emailInput, "test");

      expect(
        screen.getByRole("alert", { name: /email is invalid/i })
      ).toBeInTheDocument();

      await user.clear(emailInput);
      await user.type(emailInput, "test@example.com");

      expect(
        screen.queryByRole("alert", { name: /email is invalid/i })
      ).not.toBeInTheDocument();
    });

    // TODO: Add test cases for different type of input cases. Use jest.each
    test("user signup is disallowed when username is invalid", async () => {
      await user.type(usernameInput, "--");

      expect(
        screen.getByRole("alert", {
          name: /username can only contain/i,
          exact: false,
        })
      ).toBeInTheDocument();

      await user.clear(usernameInput);
      await user.type(usernameInput, "testy");

      expect(
        screen.queryByRole("alert", {
          name: /username can only contain/i,
          exact: false,
        })
      ).not.toBeInTheDocument();
    });

    // TODO: Add test case for different type of input cases. Use jest.each
    test("user signup is disallowed when password is invalid", async () => {
      await user.type(passwordInput, "1234567");

      expect(
        screen.getByRole("alert", {
          name: /password should be/i,
          exact: false,
        })
      ).toBeInTheDocument();

      await user.clear(passwordInput);
      await user.type(passwordInput, "mein passwort ist super");

      expect(
        screen.queryByRole("alert", {
          name: /password should be/i,
          exact: false,
        })
      ).not.toBeInTheDocument();
    });
  });
});
