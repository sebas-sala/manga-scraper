import { Elysia } from "elysia";
import TagsScraper from "./scraper/tags-scraper";

const app = new Elysia()
	.get("/", () => "Hello, World!")
	.get("/tags", async () => {
		const tagsScrapper = new TagsScraper(
			process.env.SCRAPE_MANGAS_TAGS_URL as string,
		);

		const tagsHtml = await tagsScrapper.fetchPage();
		const res = tagsScrapper.parse(tagsHtml);

		return res;
	})
	.listen(3000);

console.log(
	`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
