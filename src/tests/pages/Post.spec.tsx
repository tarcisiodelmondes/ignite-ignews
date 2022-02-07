import { render, screen } from "@testing-library/react";
import { mocked } from "jest-mock";
import { getSession } from "next-auth/client";
import Post, { getServerSideProps } from "../../pages/posts/[slug]";
import { getPrismicClient } from "../../services/prismic";

const post = {
  slug: "My post",
  title: "My post title",
  content: "<p>My post excerpt</p>",
  updatedAt: "10 de Abril",
};

jest.mock("../../services/prismic");

jest.mock("next-auth/client");

describe("Post page", () => {
  it("renders correctly", () => {
    render(<Post post={post} />);

    expect(screen.getByText("My post title")).toBeInTheDocument();
    expect(screen.getByText("My post excerpt")).toBeInTheDocument();
  });

  it("redirects user if no subscription is found", async () => {
    const getSessionMocked = mocked(getSession);

    getSessionMocked.mockResolvedValueOnce({
      activeSubscription: null,
    });

    //@ts-ignore
    const response = await getServerSideProps({ params: { slug: "my-post" } });

    expect(response).toEqual(
      expect.objectContaining({
        redirect: { destination: "/posts/preview/my-post", permanent: false },
      })
    );
  });

  it("loads initial data ", async () => {
    const getSessionMocked = mocked(getSession);
    const getPrismicClientMocked = mocked(getPrismicClient);

    getSessionMocked.mockResolvedValueOnce({
      activeSubscription: "active-subscription",
    });

    //@ts-ignore
    getPrismicClientMocked.mockReturnValueOnce({
      getByUID: jest.fn().mockResolvedValueOnce({
        data: {
          title: [
            {
              type: "heading",
              text: "my post title",
            },
          ],
          content: [
            {
              type: "paragraph",
              text: "my post content",
            },
          ],
        },
        last_publication_date: "04-01-2022",
      }),
    });

    //@ts-ignore
    const response = await getServerSideProps({ params: { slug: "my-post" } });

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          post: {
            slug: "my-post",
            title: "my post title",
            content: "<p>my post content</p>",
            updatedAt: "01 de abril de 2022",
          },
        },
      })
    );
  });
});
