import { fireEvent, render, screen } from "@testing-library/react";
import { mocked } from "jest-mock";
import { useRouter } from "next/router";
import { signIn, useSession } from "next-auth/client";
import { SubscribeButton } from ".";

jest.mock("next-auth/client", () => {
  return {
    signIn: jest.fn(),
    useSession: jest.fn(),
  };
});

jest.mock("next/router");

describe("SubscribeButton component", () => {
  it("renders correctly", () => {
    const useSessionMocked = mocked(useSession);
    useSessionMocked.mockReturnValueOnce([null, false]);

    render(<SubscribeButton />);

    expect(
      screen.getByRole("button", { name: "Subscribe now" })
    ).toBeInTheDocument();
  });

  it("redirects user to sign in when not authenticated", () => {
    const useSessionMocked = mocked(useSession);
    const signInMocked = mocked(signIn);

    useSessionMocked.mockReturnValueOnce([null, false]);

    render(<SubscribeButton />);

    const subscribeButton = screen.getByRole("button", {
      name: "Subscribe now",
    });

    fireEvent.click(subscribeButton);

    expect(signInMocked).toBeCalledWith("github");
  });

  it("redirects to posts when user already has a subscription", () => {
    const useSessionMocked = mocked(useSession);
    const useRouterMocked = mocked(useRouter);

    const pushMock = jest.fn();

    useSessionMocked.mockReturnValueOnce([
      {
        user: { name: "John Doe", email: "john.doe@examble.com" },
        activeSubscription: "fake-active-subscription",
      },
      false,
    ]);

    //@ts-ignore
    useRouterMocked.mockReturnValueOnce({
      push: pushMock,
    });

    render(<SubscribeButton />);

    const subscribeButton = screen.getByRole("button", {
      name: "Subscribe now",
    });

    fireEvent.click(subscribeButton);

    expect(pushMock).toHaveBeenCalledWith("/posts");
  });
});
