import axios from "axios";

abstract class WebsiteScraper {
	protected url: string;

	constructor(url: string) {
		this.url = url;
	}

	async fetchPage(): Promise<string> {
		try {
			const response = await axios.get(this.url);
			return response.data;
		} catch (error) {
			if (axios.isAxiosError(error)) {
				throw new Error(`Error fetching page: ${error.message}`);
			}

			throw new Error(`An unexpected error occurred: ${error}`);
		}
	}

	abstract parse(html: string): unknown;
}

export default WebsiteScraper;
