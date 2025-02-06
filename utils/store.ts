import { reactive } from "vue";
import type { Config } from "~/utils/config";

interface AppStore {
	config: Config;
	selectedConfig: SnapConfig | null;
	selectedConfigId: string;
	updateSelectedConfig(): void;
	refreshConfig(): void;
}

export default reactive<AppStore>({
	config: await loadConfig(),
	selectedConfig: null,
	selectedConfigId: "",
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
});
