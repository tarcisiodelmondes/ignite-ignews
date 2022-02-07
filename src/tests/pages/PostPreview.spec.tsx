import { render, screen } from "@testing-library/react";
import { mocked } from "jest-mock";
import { useSession } from "next-auth/client";
import { useRouter } from "next/router";
import PostPreview, { getStaticProps } from "../../pages/posts/preview/[slug]";
import { getPrismicClient } from "../../services/prismic";

const post = {
  slug: "my-post",
  title: "My post title",
  content: "<p>My post excerpt</p>",
  updatedAt: "10 de Abril",
};

jest.mock("../../services/prismic");
jest.mock("next/router");
jest.mock("next-auth/client");

describe("PostPreview page", () => {
  it("renders correctly", () => {
    const useSessionMocked = mocked(useSession);

    useSessionMocked.mockReturnValueOnce([null, false]);

    render(<PostPreview post={post} />);

    expect(screen.getByText("My post title")).toBeInTheDocument();
    expect(screen.getByText("My post excerpt")).toBeInTheDocument();
    expect(screen.getByText("Wanna continue reading?")).toBeInTheDocument();
  });

  it("redirects user if no subscription is found", async () => {
    const useSessionMocked = mocked(useSession);
    const useRouterMocked = mocked(useRouter);

    useSessionMocked.mockReturnValueOnce([
      {
        activeSubscription: "fake-active-subscription",
      },
      false,
    ]);

    const pushMocked = jest.fn();
    //@ts-ignore
    useRouterMocked.mockReturnValueOnce({
      push: pushMocked,
    });

    render(<PostPreview post={post} />);

    expect(pushMocked).toHaveBeenCalledWith("/posts/my-post");
  });

  it("loads initial data ", async () => {
    const getPrismicClientMocked = mocked(getPrismicClient);

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
    const response = await getStaticProps({ params: { slug: "my-post" } });

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
