import { db } from "../db";

export default class TagsService {
	async getTags() {
		try {
			const stmt = db.prepare("SELECT * FROM tags");
			return stmt.all();
		} catch (error) {
			this.handleDbError(error);
		}
	}

	async addTag(name: string, quantity: number) {
		try {
			const stmt = db.prepare(
				"INSERT INTO tags (name, quantity) VALUES (?, ?)",
				[name, quantity],
			);
			stmt.run();
		} catch (error) {
			this.handleDbError(error);
		}
	}

	async addBulkTags(newTags: { name: string; quantity: number }[]) {
		const stmt = db.prepare("INSERT INTO tags (name, quantity) VALUES (?, ?)");

		try {
			db.transaction(() => {
				for (const tag of newTags) {
					try {
						stmt.run(tag.name, tag.quantity);
					} catch (error) {
						if (!(error instanceof Error)) {
							throw new Error("An unexpected error occurred");
						}

						if (this.isUniqueConstraintError(error)) {
							console.warn(
								`Tag with name ${tag.name} already exists. Error: ${error.message}`,
							);
						}
					}
				}
			})();
		} catch (error) {
			this.handleDbError(error);
		}
	}

	private handleDbError(error: unknown) {
		if (!(error instanceof Error)) {
			throw new Error("An unexpected error occurred");
		}

		throw new Error(
			`An error occurred while interacting with the database: ${error.message}`,
		);
	}

	private isUniqueConstraintError(error: Error) {
		return error.message.includes("UNIQUE constraint failed");
	}
}
