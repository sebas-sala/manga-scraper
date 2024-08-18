import cron, { Patterns } from "@elysiajs/cron";
import { Elysia } from "elysia";
import TagsScraper from "./scraper/tags-scraper";
import TagsService from "./tags/tags.service";

const app = new Elysia()
	.use(
		cron({
			name: "Scrape tags",
			pattern: Patterns.everySenconds(10),
			run: async () => {
				const tagsScrapper = new TagsScraper(
					process.env.SCRAPE_MANGAS_TAGS_URL as string,
				);

				const html = await tagsScrapper.fetchPage();
				await tagsScrapper.parse(html);

				console.log("Scraped tags");
			},
		}),
	)
	.get("/", () => "Hello, World!")
	.get("/tags", async () => {
		const tagsService = new TagsService();

		const res = await tagsService.getTags();

		return res;
	})
	.listen(3000);

console.log(
	`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
