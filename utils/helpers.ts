export const uid = () =>
	Date.now().toString(36) + Math.random().toString(36).substring(2);

export const toIsoString = (date: Date) => {
	const tzo = -date.getTimezoneOffset();
	const dif = tzo >= 0 ? "+" : "-";
	const pad = (num: number) => (num < 10 ? "0" : "") + num;

	return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}${dif}${pad(Math.floor(Math.abs(tzo) / 60))}:${pad(Math.abs(tzo) % 60)}`;
};
