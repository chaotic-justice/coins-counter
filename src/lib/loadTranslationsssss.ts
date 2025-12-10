export default async function loadTranslations(locale: string) {
	const t = await import(`../_gt/${locale}.json`);
	return t.default;
}
