import { render, screen } from "@testing-library/react";
import { mocked } from "jest-mock";
import Posts, { getStaticProps } from "../../pages/posts";
import { getPrismicClient } from "../../services/prismic";

const posts = [
  {
    slug: "My post",
    title: "My post title",
    excerpt: "My post excerpt",
    updatedAt: "10 de Abril",
  },
];

jest.mock("../../services/prismic");

describe("Home page", () => {
  it("renders correctly", () => {
    render(<Posts posts={posts} />);

    expect(screen.getByText("My post title")).toBeInTheDocument();
  });

  it("loads initial data", async () => {
    const getPrismicClientMocked = mocked(getPrismicClient);

    //@ts-ignore
    getPrismicClientMocked.mockReturnValueOnce({
      query: jest.fn().mockResolvedValueOnce({
        results: [
          {
            uid: "my post",
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
                  text: "my post paragraph",
                },
              ],
            },
            last_publication_date: "04-01-2022",
          },
        ],
      }),
    });

    const response = await getStaticProps({});

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          posts: [
            {
              slug: "my post",
              title: "my post title",
              excerpt: "my post paragraph",
              updatedAt: "01 de abril de 2022",
            },
          ],
        },
      })
    );
  });
});
