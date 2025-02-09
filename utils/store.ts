import { reactive } from "vue";
import type { Config } from "~/utils/config";

interface AppStore {
	config: Config;
	selectedConfig: SnapConfig | null;
	selectedConfigId: string;
	showError: boolean;
	errorMessage: string;
	updateSelectedConfig(): void;
	refreshConfig(): void;
	showErrorMessage(message: string): void;
	closeErrorMessage(): void;
}

export default reactive<AppStore>({
	config: await loadConfig(),
	selectedConfig: null,
	selectedConfigId: "",
	showError: false,
	errorMessage: "",
	updateSelectedConfig() {
		const config = this.config.snap.find(
			(snapConfig) => snapConfig.id === this.selectedConfigId,
		);
		if (config) {
			this.selectedConfig = config;
		} else {
			this.selectedConfig = null;
			this.selectedConfigId = "";
		}
	},
	async refreshConfig() {
		this.config = await loadConfig();
		this.updateSelectedConfig();
	},
	showErrorMessage(message: string) {
		this.showError = true;
		this.errorMessage = message;
	},
	closeErrorMessage() {
		this.showError = false;
		this.errorMessage = "";
	},
});
