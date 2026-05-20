import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv, type Plugin} from 'vite';

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

type TravelNewsPayload = {
  articles: TravelNewsArticle[];
  fetchedAt: string;
  source: string;
};

type TravelNewsFeed = {
  url: string;
  source: string;
  category: string;
};

type InquiryPayload = {
  name?: string;
  email?: string;
  phone?: string;
  destination?: string;
  travel_month?: string;
  budget_per_person?: string;
  preferred_contact?: string;
  message?: string;
  source_page?: string;
  submitted_at?: string;
};

const travelNewsFeeds: TravelNewsFeed[] = [
  {
    url: 'https://travel.economictimes.indiatimes.com/rss/topstories',
    source: 'ET TravelWorld',
    category: 'India Travel News',
  },
  {
    url: 'https://www.travelbizmonitor.com/feed/',
    source: 'TravelBiz Monitor',
    category: 'India Travel News',
  },
  {
    url: 'https://www.tourismbreakingnews.com/feed/',
    source: 'Tourism Breaking News',
    category: 'India Travel News',
  },
  {
    url: 'https://www.todaystraveller.net/feed/',
    source: "Today's Traveller",
    category: 'India Travel News',
  },
  {
    url: 'https://feeds.feedburner.com/breakingtravelnews/news/airline',
    source: 'Breaking Travel News',
    category: 'Aviation',
  },
  {
    url: 'https://feeds.feedburner.com/breakingtravelnews/news/hotel',
    source: 'Breaking Travel News',
    category: 'Hotels',
  },
  {
    url: 'https://feeds.feedburner.com/breakingtravelnews/news/cruise',
    source: 'Breaking Travel News',
    category: 'Cruise',
  },
  {
    url: 'https://feeds.feedburner.com/breakingtravelnews/news/tourism',
    source: 'Breaking Travel News',
    category: 'Tourism',
  },
];

let travelNewsCache: { expiresAt: number; payload: TravelNewsPayload } | null = null;
let pendingTravelNews: Promise<TravelNewsPayload> | null = null;
const inquiryEmail = 'info@travelgateway.in';

function travelNewsApiPlugin(): Plugin {
  return {
    name: 'travel-news-api',
    configureServer(server) {
      server.middlewares.use('/api/travel-news', async (_request, response) => {
        response.setHeader('Content-Type', 'application/json; charset=utf-8');
        response.setHeader('Cache-Control', 'public, max-age=300');

        try {
          const payload = await getTravelNewsPayload();
          response.statusCode = 200;
          response.end(JSON.stringify(payload));
        } catch (error) {
          response.statusCode = 200;
          response.end(
            JSON.stringify({
              articles: [],
              fetchedAt: new Date().toISOString(),
              source: 'Live travel feed',
              error: error instanceof Error ? error.message : 'Travel news feed failed.',
            })
          );
        }
      });

      server.middlewares.use('/api/inquiry', async (request, response) => {
        response.setHeader('Content-Type', 'application/json; charset=utf-8');

        if (request.method !== 'POST') {
          response.statusCode = 405;
          response.end(JSON.stringify({ ok: false, error: 'Method not allowed.' }));
          return;
        }

        try {
          const inquiry = await readJsonBody<InquiryPayload>(request);

          if (!inquiry.name || !inquiry.email || !inquiry.phone) {
            response.statusCode = 400;
            response.end(
              JSON.stringify({
                ok: false,
                error: 'Name, email, and phone are required to send an inquiry.',
              })
            );
            return;
          }

          const upstreamResponse = await fetch(`https://formsubmit.co/ajax/${inquiryEmail}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
            body: JSON.stringify({
              _subject: `New Travel Gateway Inquiry: ${inquiry.destination || 'Custom trip request'}`,
              _template: 'table',
              _captcha: 'false',
              _replyto: inquiry.email,
              name: inquiry.name,
              email: inquiry.email,
              phone: inquiry.phone,
              destination: inquiry.destination || 'Not specified',
              travel_month: inquiry.travel_month || 'Not specified',
              budget_per_person: inquiry.budget_per_person || 'Not specified',
              preferred_contact: inquiry.preferred_contact || 'Not specified',
              message: inquiry.message || 'No additional notes shared.',
              source_page: inquiry.source_page || '/contact',
              submitted_at: inquiry.submitted_at || new Date().toISOString(),
            }),
          });

          if (!upstreamResponse.ok) {
            const upstreamText = await upstreamResponse.text();
            throw new Error(`Email service returned ${upstreamResponse.status}: ${upstreamText}`);
          }

          response.statusCode = 200;
          response.end(
            JSON.stringify({
              ok: true,
              message: 'Inquiry sent successfully.',
            })
          );
        } catch (error) {
          response.statusCode = 502;
          response.end(
            JSON.stringify({
              ok: false,
              error: error instanceof Error ? error.message : 'Inquiry delivery failed.',
            })
          );
        }
      });
    },
  };
}

async function readJsonBody<T>(request: NodeJS.ReadableStream): Promise<T> {
  const chunks: Uint8Array[] = [];

  for await (const chunk of request) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }

  const body = Buffer.concat(chunks).toString('utf-8');
  return JSON.parse(body) as T;
}

async function getTravelNewsPayload() {
  if (travelNewsCache && travelNewsCache.expiresAt > Date.now()) {
    return travelNewsCache.payload;
  }

  if (!pendingTravelNews) {
    pendingTravelNews = fetchTravelNews().finally(() => {
      pendingTravelNews = null;
    });
  }

  const payload = await pendingTravelNews;
  travelNewsCache = {
    expiresAt: Date.now() + 5 * 60 * 1000,
    payload,
  };
  return payload;
}

async function fetchTravelNews(): Promise<TravelNewsPayload> {
  const feedResults = await Promise.allSettled(
    travelNewsFeeds.map(async (feed) => {
      const response = await fetch(feed.url, {
        headers: {
          'User-Agent': 'TravelGateway/1.0 local travel news feed',
        },
      });

      if (!response.ok) {
        throw new Error(`${feed.source} ${feed.category} feed returned ${response.status}`);
      }

      return parseRssItems(await response.text(), feed);
    })
  );

  const articles = feedResults
    .flatMap((result) => (result.status === 'fulfilled' ? result.value : []))
    .filter((article) => article.title && article.url)
    .filter(uniqueArticle())
    .sort((a, b) => feedPriority(a).localeCompare(feedPriority(b)) || b.seendate.localeCompare(a.seendate))
    .slice(0, 18);

  return {
    articles,
    fetchedAt: new Date().toISOString(),
    source: 'India travel RSS feeds with global travel backup feeds',
  };
}

function parseRssItems(xml: string, feed: TravelNewsFeed): TravelNewsArticle[] {
  const itemBlocks = xml.match(/<item\b[\s\S]*?<\/item>/gi) || [];

  return itemBlocks.map((block) => {
    const title = cleanFeedText(readTag(block, 'title'));
    const url = cleanFeedText(readTag(block, 'link'));
    const description = cleanFeedDescription(readTag(block, 'description'));
    const pubDate = cleanFeedText(readTag(block, 'pubDate'));
    const image = cleanFeedText(readMediaUrl(block));
    const source = cleanFeedText(readTag(block, 'source')) || feed.source;
    const publishedAt = Number.isNaN(new Date(pubDate).getTime()) ? new Date() : new Date(pubDate);

    return {
      url,
      title,
      seendate: toCompactUtcDate(publishedAt),
      socialimage: image,
      domain: source,
      sourcecountry: feed.category,
      language: 'English',
      description,
    };
  });
}

function readTag(block: string, tagName: string) {
  const match = new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\\/${tagName}>`, 'i').exec(block);
  return match?.[1] || '';
}

function readMediaUrl(block: string) {
  const match =
    /<media:content\b[^>]*\burl=["']([^"']+)["']/i.exec(block) ||
    /<media:thumbnail\b[^>]*\burl=["']([^"']+)["']/i.exec(block) ||
    /<enclosure\b[^>]*\burl=["']([^"']+)["']/i.exec(block);
  return match?.[1] || '';
}

function feedPriority(article: TravelNewsArticle) {
  if (article.sourcecountry.startsWith('India')) return '0';
  if (article.sourcecountry === 'Visa') return '1';
  return '2';
}

function cleanFeedDescription(value: string) {
  return cleanFeedText(value)
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 280);
}

function cleanFeedText(value: string) {
  return decodeXmlEntities(value.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1'))
    .replace(/\s+/g, ' ')
    .trim();
}

function decodeXmlEntities(value: string) {
  return value
    .replace(/&#x([0-9a-f]+);/gi, (_entity, code) => String.fromCharCode(parseInt(code, 16)))
    .replace(/&#(\d+);/g, (_entity, code) => String.fromCharCode(Number(code)))
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function toCompactUtcDate(date: Date) {
  const pad = (value: number) => value.toString().padStart(2, '0');
  return `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(
    date.getUTCDate()
  )}T${pad(date.getUTCHours())}${pad(date.getUTCMinutes())}${pad(date.getUTCSeconds())}Z`;
}

function uniqueArticle() {
  const seen = new Set<string>();

  return (article: TravelNewsArticle) => {
    const key = article.title.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  };
}

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [travelNewsApiPlugin(), react(), tailwindcss()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
