import env from "../../config/env.js";

// ─────────────────────────────────────────────────────────────────────────────
// Base URL — change once to update every link in the template.
// ─────────────────────────────────────────────────────────────────────────────
const BASE_URL = env.FRONTEND_BASE_URL;
const LOGO_URL = env.LOGO_URL;

function formatValue(value, fallback = "Not specified") {
	if (value === null || value === undefined || value === "") return fallback;
	return value;
}

function formatDeadline(value) {
	if (!value) return "Not specified";
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return String(value);
	return date.toLocaleString("en-IN", {
		year: "numeric",
		month: "short",
		day: "numeric",
		hour: "numeric",
		minute: "2-digit",
		hour12: true,
	});
}

function formatMoney(value) {
	if (value === null || value === undefined || value === "") return "Not specified";
	if (typeof value === "number") return `${value} LPA`;
	return value;
}

function buildCtaLink(job) {
	return job.apply_link_1 || `${BASE_URL}/jobs`;
}

const JOB_TYPE_MAP = {
	placement: "Full-Time Placement",
	internship: "Internship",
	internship_fulltime: "Internship + FTE",
	webinar: "Webinar",
	hackathon: "Hackathon",
	talk: "Expert Talk",
};

export function getJobTypeLabel(type) {
	if (!type) return "Opportunity";
	return JOB_TYPE_MAP[type] || type.charAt(0).toUpperCase() + type.slice(1);
}

/**
 * Job alert email template for Avsaar
 * @param {object} job - Job payload from Inngest event
 * @param {object} user - Subscriber profile
 */
export function jobAlertTemplate(job, user) {
	const rawName = user?.full_name ? user.full_name.trim() : "";
	const cleaned = rawName.replace(/^[\d_]+/, "").trim();
	const token = cleaned.split(/[\s_]+/)[0] || "";
	const firstName = token.length > 0 ? token.charAt(0).toUpperCase() + token.slice(1).toLowerCase() : "Student";

	const ctaLink = buildCtaLink(job);
	const jobType = getJobTypeLabel(job.job_type);

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
  <title>New ${jobType} Opportunity</title>
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
      font-size: 22px;
      font-weight: 800;
      color: #ffffff;
      margin-bottom: 6px;
      position: relative;
      z-index: 2;
    }
    .hero-subtitle {
      font-size: 14px;
      color: #9ca3af;
      margin-bottom: 16px;
      position: relative;
      z-index: 2;
    }
    .job-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 999px;
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 0.4px;
      color: #10b981;
      border: 1px solid rgba(16,185,129,0.35);
      background: rgba(16,185,129,0.08);
      margin-bottom: 18px;
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
      padding: 18px 18px 6px;
      margin-bottom: 18px;
    }
    .detail-table {
      width: 100%;
      border-collapse: collapse;
    }
    .detail-label {
      color: #94a3b8;
      font-weight: 600;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.6px;
      padding-bottom: 12px;
      vertical-align: top;
      text-align: left;
    }
    .detail-value {
      color: #cbd5f5;
      font-size: 13px;
      font-weight: 700;
      text-align: right;
      padding-bottom: 12px;
      vertical-align: top;
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
        <div class="brand-tagline">Placement Alerts</div>
      </div>

      <div class="hero-card">
        <div class="hero-title">Hey ${firstName}, new opportunity is live 🚀</div>
        <div class="hero-subtitle"><strong>${formatValue(job.company_name)}</strong> is hiring for <strong>${formatValue(job.role_title)}</strong>.</div>
        <div class="job-badge">${jobType}</div>

        <div class="details-card">
          <table class="detail-table" cellpadding="0" cellspacing="0">
            <tr>
              <td class="detail-label">CTC / Stipend</td>
              <td class="detail-value">${formatMoney(job.ctc || job.stipend)}</td>
            </tr>
            <tr>
              <td class="detail-label">Deadline</td>
              <td class="detail-value">${formatDeadline(job.deadline)}</td>
            </tr>
            <tr>
              <td class="detail-label" style="padding-bottom: 0;">Min CGPA</td>
              <td class="detail-value" style="padding-bottom: 0;">${formatValue(job.min_cgpa)}</td>
            </tr>
          </table>
        </div>

        <a class="cta-button" href="${ctaLink}">View & Apply →</a>
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
