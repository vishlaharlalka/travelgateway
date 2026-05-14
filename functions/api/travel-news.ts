type TravelNewsArticle = {
  url: string;
  title: string;
  seendate: string;
  socialimage: string;
  domain: string;
  sourcecountry: string;
  language: string;
  description: string;
};

type TravelNewsFeed = {
  url: string;
  source: string;
  category: string;
};

const travelNewsFeeds: TravelNewsFeed[] = [
  {
    url: "https://feeds.feedburner.com/breakingtravelnews/news/airline",
    source: "Breaking Travel News",
    category: "Aviation",
  },
  {
    url: "https://feeds.feedburner.com/breakingtravelnews/news/hotel",
    source: "Breaking Travel News",
    category: "Hotels",
  },
  {
    url: "https://feeds.feedburner.com/breakingtravelnews/news/cruise",
    source: "Breaking Travel News",
    category: "Cruise",
  },
  {
    url: "https://feeds.feedburner.com/breakingtravelnews/news/tourism",
    source: "Breaking Travel News",
    category: "Tourism",
  },
];

function jsonResponse(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=300",
    },
  });
}

export async function onRequestGet() {
  try {
    const articles = await fetchTravelNews();
    return jsonResponse({
      articles,
      fetchedAt: new Date().toISOString(),
      source: "Breaking Travel News RSS feeds",
    });
  } catch (error) {
    return jsonResponse({
      articles: [],
      fetchedAt: new Date().toISOString(),
      source: "Live travel feed",
      error: error instanceof Error ? error.message : "Travel news feed failed.",
    });
  }
}

async function fetchTravelNews(): Promise<TravelNewsArticle[]> {
  const feedResults = await Promise.allSettled(
    travelNewsFeeds.map(async (feed) => {
      const response = await fetch(feed.url, {
        headers: {
          "User-Agent": "TravelGateway/1.0 live travel news feed",
        },
      });

      if (!response.ok) {
        throw new Error(`${feed.source} ${feed.category} feed returned ${response.status}`);
      }

      return parseRssItems(await response.text(), feed);
    })
  );

  return feedResults
    .flatMap((result) => (result.status === "fulfilled" ? result.value : []))
    .filter((article) => article.title && article.url)
    .filter(uniqueArticle())
    .sort((a, b) => b.seendate.localeCompare(a.seendate))
    .slice(0, 12);
}

function parseRssItems(xml: string, feed: TravelNewsFeed): TravelNewsArticle[] {
  const itemBlocks = xml.match(/<item\b[\s\S]*?<\/item>/gi) || [];

  return itemBlocks.map((block) => {
    const title = cleanFeedText(readTag(block, "title"));
    const url = cleanFeedText(readTag(block, "link"));
    const description = cleanFeedDescription(readTag(block, "description"));
    const pubDate = cleanFeedText(readTag(block, "pubDate"));
    const image = cleanFeedText(readMediaUrl(block));
    const publishedAt = Number.isNaN(new Date(pubDate).getTime()) ? new Date() : new Date(pubDate);

    return {
      url,
      title,
      seendate: toCompactUtcDate(publishedAt),
      socialimage: image,
      domain: feed.source,
      sourcecountry: feed.category,
      language: "English",
      description,
    };
  });
}

function readTag(block: string, tagName: string) {
  const match = new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\\/${tagName}>`, "i").exec(block);
  return match?.[1] || "";
}

function readMediaUrl(block: string) {
  const match = /<media:content\b[^>]*\burl=["']([^"']+)["']/i.exec(block);
  return match?.[1] || "";
}

function cleanFeedDescription(value: string) {
  return cleanFeedText(value)
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 280);
}

function cleanFeedText(value: string) {
  return decodeXmlEntities(value.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1"))
    .replace(/\s+/g, " ")
    .trim();
}

function decodeXmlEntities(value: string) {
  return value
    .replace(/&#x([0-9a-f]+);/gi, (_entity, code) => String.fromCharCode(parseInt(code, 16)))
    .replace(/&#(\d+);/g, (_entity, code) => String.fromCharCode(Number(code)))
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function toCompactUtcDate(date: Date) {
  const pad = (value: number) => value.toString().padStart(2, "0");
  return `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(
    date.getUTCDate()
  )}T${pad(date.getUTCHours())}${pad(date.getUTCMinutes())}${pad(date.getUTCSeconds())}Z`;
}

function uniqueArticle() {
  const seen = new Set<string>();

  return (article: TravelNewsArticle) => {
    const key = article.title.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  };
}
