import AppError from "../../utils/AppError.js";
import AppResponse from "../../utils/AppResponse.js";
import { inngest } from "../../inngest/client.js";

export const sendContactMessage = async (req, res, next) => {
	try {
		const { name, email, message } = req.body;

		if (!name || !email || !message) {
			throw new AppError("Name, email, and message are required", 400);
		}

		await inngest.send({
			name: "contact/message_sent",
			data: {
				name,
				email,
				message,
			},
		});

		return res.status(200).json(
			new AppResponse(200, "Message sent successfully", null)
		);
	} catch (error) {
		next(error);
	}
};
