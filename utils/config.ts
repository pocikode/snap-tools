import {
	BaseDirectory,
	exists,
	readTextFile,
	writeTextFile,
} from "@tauri-apps/plugin-fs";

const CONFIG_FILE = "config.json";

export interface SnapConfig {
	id: string;
	name: string;
	merchantID: string;
	secretKey: string;
	privateKey: string;
	baseURL: string;
}

export interface Config {
	snap: SnapConfig[];
}

export const loadConfig = async (): Promise<Config> => {
	if (!(await exists(CONFIG_FILE, { baseDir: BaseDirectory.AppConfig }))) {
		return { snap: [] };
	}

	const content = await readTextFile(CONFIG_FILE, {
		baseDir: BaseDirectory.AppConfig,
	});
	if (content) {
		return JSON.parse(content) as Config;
	}

	throw new Error("Config file is empty or not found");
};

export const saveConfig = async (config: Config): Promise<void> => {
	const content = JSON.stringify(config, null, 2);
	await writeTextFile(CONFIG_FILE, content, {
		baseDir: BaseDirectory.AppConfig,
	});
};

export const addSnapConfig = async (snapConfig: SnapConfig): Promise<void> => {
	const config = await loadConfig();
	config.snap.push(snapConfig);
	await saveConfig(config);
};
