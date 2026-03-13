class Search {
	open = $state(false);
	onOpen: (() => void) | null = null;

	show() {
		this.open = true;
		this.onOpen?.();
	}
}

export const search = new Search();
