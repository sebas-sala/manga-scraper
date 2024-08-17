import * as Cheerio from "cheerio";
import WebsiteScraper from "./website-scraper";

class TagsScraper extends WebsiteScraper {
	private minQty = 1000;

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

	parse(html: string): string[] {
		const $ = Cheerio.load(html);

		const tags = $(".filter-elem .name");

		const filteredTagsNames = tags
			.filter((_, tag) => {
				const dataQty = $(tag).attr("data-qty") || "0";
				const numericQty = this.parseDataQty(dataQty);
				return numericQty > this.minQty;
			})
			.map((_, tag) => {
				const tagName = $(tag).text().trim();
				return tagName;
			})
			.get();

		return filteredTagsNames;
	}
}

export default TagsScraper;
