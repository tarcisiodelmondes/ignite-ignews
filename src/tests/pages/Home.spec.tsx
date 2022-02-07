import { render, screen } from "@testing-library/react";
import { mocked } from "jest-mock";
import Home, { getStaticProps } from "../../pages";
import { stripe } from "../../services/stripe";

jest.mock("next-auth/client", () => ({
  useSession() {
    return [null, false];
  },
}));

jest.mock("../../services/stripe");

describe("Home page", () => {
  it("renders correctly", () => {
    render(<Home product={{ amount: "$10", priceId: "24324" }} />);

    expect(screen.getByText("for $10 month")).toBeInTheDocument();
  });

  it("loads initial data", async () => {
    const retrieveStripePricesMocked = mocked(stripe.prices.retrieve);

    //@ts-ignore
    retrieveStripePricesMocked.mockResolvedValueOnce({
      id: "faker-price-id",
      unit_amount: 1000,
    });

    const response = await getStaticProps({});

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          product: {
            priceId: "faker-price-id",
            amount: "$10.00",
          },
        },
      })
    );
  });
});
