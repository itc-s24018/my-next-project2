// Lightweight local types to avoid requiring microcms-js-sdk at build time
export type MicroCMSImage = {
  url: string;
  width?: number;
  height?: number;
};

export type MicroCMSListContent = {
  id: string;
  createdAt?: string;
  publishedAt?: string;
};

export type MicroCMSQueries = Record<string, any> | undefined;

export type Member = {
  name: string;
  position: string;
  profile: string;
  image: MicroCMSImage;
} & MicroCMSListContent;

export type Category = {
  name: string;
} & MicroCMSListContent;

export type News = {
  title: string;
  description: string;
  content: string;
  thumbnail?: MicroCMSImage;
  category: Category;
} & MicroCMSListContent;

// Try to create a real client only when env vars exist and the SDK is available.
let client: any = null;
if (process.env.MICROCMS_SERVICE_DOMAIN && process.env.MICROCMS_API_KEY) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { createClient } = require("microcms-js-sdk");
    client = createClient({
      serviceDomain: process.env.MICROCMS_SERVICE_DOMAIN,
      apiKey: process.env.MICROCMS_API_KEY,
    });
  } catch (e) {
    // SDK not installed or failed to load; fall back to mock below
    client = null;
  }
}

// Mock data used when client is not available (development fallback)
const mockNews = {
  contents: [
    {
      id: "1",
      title: "渋谷にオフィスを移転しました",
      description: "",
      content: "",
      category: { id: "c1", name: "更新情報" },
      createdAt: "2023-05-19",
      publishedAt: "2023-05-19",
    },
    {
      id: "2",
      title: "当社CEOが業界リーダーTOP30に選出されました",
      description: "",
      content: "",
      category: { id: "c1", name: "更新情報" },
      createdAt: "2023-05-19",
      publishedAt: "2023-05-19",
    },
    {
      id: "3",
      title: "テストの記事です",
      description: "",
      content: "",
      category: { id: "c1", name: "更新情報" },
      createdAt: "2023-04-19",
      publishedAt: "2023-04-19",
    },
  ],
};

export const getMembersList = async (queries?: MicroCMSQueries) => {
  if (client) {
    return client.getList<Member>({ endpoint: "members", queries });
  }
  // Return a mocked empty list for development
  return {
    contents: [],
    totalCount: 0,
    offset: 0,
    limit: queries?.limit ?? 10,
  };
};

export const getNewsList = async (queries?: MicroCMSQueries) => {
  if (client) {
    return client.getList<News>({ endpoint: "news", queries });
  }
  // Apply simple limit if provided
  const limit = (queries && (queries as any).limit) || mockNews.contents.length;
  return {
    contents: mockNews.contents.slice(0, limit),
    totalCount: mockNews.contents.length,
    offset: 0,
    limit,
  };
};
