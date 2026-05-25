import env from "../../config/env.js";

const BASE_URL = env.FRONTEND_BASE_URL;
const LOGO_URL = env.LOGO_URL;

const TYPE_LABELS = {
	general: "General Update",
	deadline_extension: "Deadline Extended",
	shortlist: "Shortlist Released",
	test_link: "Test Link Shared",
	venue_update: "Venue Updated",
	eligibility_update: "Eligibility Updated",
	joining_update: "Joining Details Updated",
	result: "Results Declared",
	warning: "Important Warning",
};

export function getAnnouncementTypeLabel(type) {
	return TYPE_LABELS[type] || "Placement Update";
}

export function getAnnouncementSubject(announcement) {
	const typeLabel = getAnnouncementTypeLabel(announcement.announcement_type);
	const jobPrefix = announcement.job ? `[${announcement.job.company_name}] ` : "";
	return `📢 ${typeLabel}: ${jobPrefix}${announcement.subject} | अवSaar Alert`;
}

/**
 * Announcement alert email template for Avsaar
 * @param {object} announcement - Announcement payload from Inngest event
 * @param {object} user - Subscriber profile
 */
export function announcementAlertTemplate(announcement, user) {
	const rawName = user?.full_name ? user.full_name.trim() : "";
	const cleaned = rawName.replace(/^[\d_]+/, "").trim();
	const token = cleaned.split(/[\s_]+/)[0] || "";
	const firstName = token.length > 0 ? token.charAt(0).toUpperCase() + token.slice(1).toLowerCase() : "Student";

	const typeLabel = getAnnouncementTypeLabel(announcement.announcement_type);
	const ctaLink = `${BASE_URL}/announcements/${announcement.id || announcement.announcement_id}`;

	// Custom color schemes for different announcement types to look visually premium
	const schemeColors = {
		warning: { text: "#f87171", border: "rgba(239, 68, 68, 0.35)", bg: "rgba(239, 68, 68, 0.08)" },
		result: { text: "#34d399", border: "rgba(52, 211, 153, 0.35)", bg: "rgba(52, 211, 153, 0.08)" },
		shortlist: { text: "#60a5fa", border: "rgba(96, 165, 250, 0.35)", bg: "rgba(96, 165, 250, 0.08)" },
		test_link: { text: "#a78bfa", border: "rgba(167, 139, 250, 0.35)", bg: "rgba(167, 139, 250, 0.08)" },
		deadline_extension: { text: "#fbbf24", border: "rgba(251, 191, 36, 0.35)", bg: "rgba(251, 191, 36, 0.08)" },
		default: { text: "#10b981", border: "rgba(16, 185, 129, 0.35)", bg: "rgba(16, 185, 129, 0.08)" },
	};
	const colors = schemeColors[announcement.announcement_type] || schemeColors.default;

	// Render job details if linked
	let jobDetailsHtml = "";
	if (announcement.job) {
		jobDetailsHtml = `
        <div class="details-card" style="margin-top: 10px; margin-bottom: 20px;">
          <table class="detail-table" cellpadding="0" cellspacing="0" style="width: 100%; border-collapse: collapse;">
            <tr>
              <td class="detail-label" style="color: #94a3b8; font-weight: 600; font-size: 11px; text-transform: uppercase; letter-spacing: 0.8px; padding-bottom: 0; vertical-align: middle; text-align: left;">Linked Company</td>
              <td class="detail-value" style="color: #cbd5f5; font-size: 13px; font-weight: 700; text-align: right; padding-bottom: 0; vertical-align: middle;">${announcement.job.company_name}</td>
            </tr>
            <tr>
              <td class="detail-label" style="color: #94a3b8; font-weight: 600; font-size: 11px; text-transform: uppercase; letter-spacing: 0.8px; padding-top: 10px; padding-bottom: 0; vertical-align: middle; text-align: left;">Role Target</td>
              <td class="detail-value" style="color: #cbd5f5; font-size: 13px; font-weight: 700; text-align: right; padding-top: 10px; padding-bottom: 0; vertical-align: middle;">${announcement.job.role_title}</td>
            </tr>
          </table>
        </div>
		`;
	}

	return `
<!DOCTYPE html>
<html lang="en"
      xmlns="http://www.w3.org/1999/xhtml"
      xmlns:v="urn:schemas-microsoft-com:vml"
      xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="x-apple-disable-message-reformatting">
  <title>New Placement Update | Avsaar</title>
  <!--[if mso]>
  <noscript>
    <xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml>
  </noscript>
  <![endif]-->
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background-color: #030a06;
      color: #e2e8f0;
      -webkit-font-smoothing: antialiased;
      line-height: 1.6;
      -ms-text-size-adjust: 100%;
      -webkit-text-size-adjust: 100%;
    }
    a { color: #10b981; text-decoration: none; }
    img { display: block; max-width: 100%; border: 0; }
    .email-wrapper {
      width: 100%;
      background-color: #030a06;
      padding: 40px 16px;
    }
    .email-container {
      max-width: 580px;
      margin: 0 auto;
      width: 100%;
    }
    .header {
      text-align: center;
      padding-bottom: 28px;
    }
    .logo-img {
      display: inline-block;
      width: 56px;
      height: 56px;
      border-radius: 14px;
      margin-bottom: 14px;
      object-fit: contain;
    }
    .brand-name {
      font-size: 22px;
      font-weight: 800;
      letter-spacing: -0.3px;
      color: #ffffff;
    }
    .brand-name span { color: #10b981; }
    .brand-tagline {
      font-size: 11px;
      letter-spacing: 2.5px;
      text-transform: uppercase;
      color: #6b7280;
      margin-top: 4px;
    }
    .hero-card {
      background: linear-gradient(145deg, #0d2016 0%, #0a1a10 40%, #061410 100%);
      border: 1px solid rgba(16,185,129,0.18);
      border-radius: 20px;
      padding: 32px 28px;
      position: relative;
      overflow: hidden;
      margin-bottom: 20px;
    }
    .hero-title {
      font-size: 20px;
      font-weight: 800;
      color: #ffffff;
      margin-bottom: 12px;
      position: relative;
      z-index: 2;
      line-height: 1.3;
    }
    .hero-subtitle {
      font-size: 14px;
      color: #cbd5e1;
      margin-bottom: 18px;
      position: relative;
      z-index: 2;
      line-height: 1.5;
    }
    .job-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 999px;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.8px;
      text-transform: uppercase;
      color: ${colors.text};
      border: 1px solid ${colors.border};
      background: ${colors.bg};
      margin-bottom: 20px;
      position: relative;
      z-index: 2;
    }
    .cta-button {
      display: block;
      width: 100%;
      padding: 14px 28px;
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: #ffffff !important;
      font-size: 15px;
      font-weight: 700;
      border-radius: 12px;
      text-align: center;
      box-shadow: 0 4px 24px rgba(16,185,129,0.40);
    }
    .details-card {
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 16px;
      padding: 18px;
      margin-bottom: 20px;
    }
    .footer {
      text-align: center;
      margin-top: 22px;
      color: #6b7280;
      font-size: 12px;
    }
    .footer a { color: #10b981; }
  </style>
</head>
<body>
  <div class="email-wrapper">
    <div class="email-container">
      <div class="header">
        <img src="${LOGO_URL}" alt="Avsaar" class="logo-img" />
        <div class="brand-name">अव<span>Saar</span></div>
        <div class="brand-tagline">Placement Updates</div>
      </div>

      <div class="hero-card">
        <div class="hero-title">Hello ${firstName}, New Update Posted</div>
        <div class="job-badge">${typeLabel}</div>
        
        <div class="hero-subtitle" style="font-weight: 700; color: #ffffff; font-size: 16px; margin-bottom: 8px;">
          ${announcement.subject}
        </div>
        
        <div class="hero-subtitle" style="margin-bottom: 20px; font-size: 13.5px; color: #cbd5e1; background: rgba(0,0,0,0.2); padding: 14px; border-radius: 10px; border-left: 3px solid #10b981;">
          ${announcement.description.length > 300 ? announcement.description.substring(0, 300) + "..." : announcement.description}
        </div>

        ${jobDetailsHtml}

        <a class="cta-button" href="${ctaLink}">View Full Update Details →</a>
      </div>

      <div class="footer">
        Manage alerts from your profile settings: <a href="${BASE_URL}/profile">Notification Preferences</a>
      </div>
    </div>
  </div>
</body>
</html>
`;
}
