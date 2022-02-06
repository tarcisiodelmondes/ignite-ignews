import { render } from "@testing-library/react";
import { Header } from ".";

jest.mock("next/router", () => {
  return {
    useRouter() {
      return {
        pathname: "/",
      };
    },
  };
});

jest.mock("next-auth/client", () => {
  return {
    useSession: () => [null, false],
  };
});

describe("Header component", () => {
  it("renders correctly", () => {
    const { getByRole } = render(<Header />);

    expect(getByRole("link", { name: "Home" })).toBeInTheDocument();
    expect(getByRole("link", { name: "Posts" })).toBeInTheDocument();
  });
});
