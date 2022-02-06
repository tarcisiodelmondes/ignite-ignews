import { render, screen } from "@testing-library/react";
import { mocked } from "jest-mock";
import { useSession } from "next-auth/client";
import { SignInButton } from ".";

jest.mock("next-auth/client");

describe("SignInButton component", () => {
  it("renders correctly when user is not authenticated", () => {
    const useSessionMocked = mocked(useSession);

    useSessionMocked.mockReturnValueOnce([null, false]);
    render(<SignInButton />);

    const button = screen.getByRole("button", {
      name: "Sing in with GitHub",
    });

    expect(button).toBeInTheDocument();
  });

  it("renders correctly when user is authenticated", () => {
    const useSessionMocked = mocked(useSession);

    const user = {
      name: "John Doe",
    };

    useSessionMocked.mockReturnValueOnce([{ user }, false]);

    render(<SignInButton />);

    const button = screen.getByRole("button", {
      name: "John Doe",
    });

    expect(button).toBeInTheDocument();
  });
});
