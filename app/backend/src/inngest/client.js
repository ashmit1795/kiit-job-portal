import { Inngest } from "inngest";
import env from "../config/env.js";

export const inngest = new Inngest({
	id: "avsaar-backend",
	eventKey: env.INNGEST_EVENT_KEY,
});
