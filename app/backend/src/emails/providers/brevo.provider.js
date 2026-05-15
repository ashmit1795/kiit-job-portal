const BREVO_ENDPOINT = "https://api.brevo.com/v3/smtp/email";

function parseSender(from) {
	if (!from || typeof from !== "string") {
		throw new Error("MAIL_FROM is required");
	}

	const match = from.match(/^(.*)<([^>]+)>$/);
	if (match) {
		const name = match[1].trim().replace(/^"|"$/g, "");
		const email = match[2].trim();
		return name ? { email, name } : { email };
	}

	return { email: from.trim() };
}

export async function sendBrevoEmail({ apiKey, from, to, subject, html, timeoutMs = 10000 }) {
	if (!apiKey) {
		throw new Error("BREVO_API_KEY is required");
	}

	const controller = new AbortController();
	const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

	try {
		const response = await fetch(BREVO_ENDPOINT, {
			method: "POST",
			headers: {
				"api-key": apiKey,
				"content-type": "application/json",
				"accept": "application/json",
			},
			body: JSON.stringify({
				sender: parseSender(from),
				to: [{ email: to }],
				subject,
				htmlContent: html,
			}),
			signal: controller.signal,
		});

		if (!response.ok) {
			const errorText = await response.text();
			throw new Error(`Brevo API error (${response.status}): ${errorText}`);
		}

		return await response.json();
	} finally {
		clearTimeout(timeoutId);
	}
}
