import * as Cheerio from "cheerio";

import TagsService from "../tags/tags.service";
import WebsiteScraper from "./website-scraper";

class TagsScraper extends WebsiteScraper {
	private MIN_QTY = 1000;

	private parseDataQty(dataQty: string): number {
		if (!dataQty) return 0;

		const lowerCaseQty = dataQty.toLowerCase();
		let multiplier = 1;

		if (lowerCaseQty.endsWith("k")) {
			multiplier = 1000;
		}

		const numberPart = Number(lowerCaseQty.replace(/[km]/, ""));
		return Number.isNaN(numberPart) ? 0 : numberPart * multiplier;
	}

	async parse(html: string): Promise<void> {
		const $ = Cheerio.load(html);

		const tags = $(".filter-elem .name");

		const filteredTagsNames = tags
			.filter((_, tag) => {
				const dataQty = $(tag).attr("data-qty") || "0";
				const numericQty = this.parseDataQty(dataQty);
				return numericQty > this.MIN_QTY;
			})
			.map((_, tag) => {
				const tagName = $(tag).text().trim();
				return tagName;
			})
			.get();

		const tagsService = new TagsService();

		for (const tagName of filteredTagsNames) {
			await tagsService.addBulkTags([{ name: tagName, quantity: 0 }]);
		}
	}
}

export default TagsScraper;
