import env from "../../config/env.js";

// ─────────────────────────────────────────────────────────────────────────────
// Base URL — change once to update every link in the template.
// ─────────────────────────────────────────────────────────────────────────────
const BASE_URL = env.FRONTEND_BASE_URL;
const LOGO_URL = env.LOGO_URL;

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

function buildCtaLink(job) {
	return job.apply_link_1 || `${BASE_URL}/jobs/${job.job_id || job.id}`;
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

const CUSTOM_COPY = {
	placement: {
		heading: "New Career Opportunity Live! 🚀",
		description: (company, role) => `Exciting news! <strong>${company}</strong> is recruiting for a full-time <strong>${role}</strong> role. This is your chance to kickstart your professional career!`,
		cta: "View Placement & Apply →"
	},
	internship: {
		heading: "New Internship Opportunity Live! 💼",
		description: (company, role) => `Kickstart your hands-on experience! <strong>${company}</strong> is hiring an <strong>${role}</strong> intern. Build your skills and gain valuable real-world exposure!`,
		cta: "View Internship & Apply →"
	},
	internship_fulltime: {
		heading: "Internship + Full-Time Job Opportunity! 🎯",
		description: (company, role) => `Get the best of both worlds! <strong>${company}</strong> has posted an <strong>${role}</strong> opportunity with a transition to a full-time role (PPO). Secure your future!`,
		cta: "View Opportunity & Apply →"
	},
	hackathon: {
		heading: "New Hackathon Challenge Live! ⚡",
		description: (company, role) => `Ready to showcase your talent? <strong>${company}</strong> has announced the <strong>${role}</strong> hackathon! Push your boundaries and compete with the best.`,
		cta: "Register for Hackathon →"
	},
	webinar: {
		heading: "Upcoming Industry Webinar Scheduled! 📢",
		description: (company, role) => `Never stop learning! <strong>${company}</strong> is hosting a webinar on <strong>${role}</strong>. Secure your virtual seat and learn from professionals.`,
		cta: "Register for Webinar →"
	},
	talk: {
		heading: "Exclusive Expert Talk Scheduled! 🎙️",
		description: (company, role) => `Get direct insights from leaders! <strong>${company}</strong> is presenting an expert talk on <strong>${role}</strong>. Elevate your knowledge.`,
		cta: "Join Expert Talk →"
	}
};

const fallbackCopy = {
	heading: "New Placement Alert! 🚀",
	description: (company, role) => `A new opportunity has been posted: <strong>${company}</strong> is hiring for <strong>${role}</strong>. Check it out and apply today!`,
	cta: "View Details & Apply →"
};

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

	// Get custom copy
	const copy = CUSTOM_COPY[job.job_type] || fallbackCopy;
	const bodyText = copy.description(job.company_name || "a leading company", job.role_title || "Specialist");

	// Build dynamic details table rows - ONLY render available, specified fields!
	const rows = [];

	if (job.ctc && job.ctc !== "Not specified" && job.ctc !== "null" && job.ctc !== "undefined") {
		rows.push(`
            <tr>
              <td class="detail-label">Compensation (CTC)</td>
              <td class="detail-value" style="color: #10b981;">${job.ctc}</td>
            </tr>
		`);
	}

	if (job.stipend && job.stipend !== "Not specified" && job.stipend !== "null" && job.stipend !== "undefined") {
		rows.push(`
            <tr>
              <td class="detail-label">Stipend</td>
              <td class="detail-value" style="color: #10b981;">${job.stipend}</td>
            </tr>
		`);
	}

	if (job.min_cgpa && job.min_cgpa > 0) {
		rows.push(`
            <tr>
              <td class="detail-label">Minimum CGPA</td>
              <td class="detail-value">≥ ${job.min_cgpa}</td>
            </tr>
		`);
	}

	if (job.joining_date && job.joining_date !== "Not specified" && job.joining_date !== "null" && job.joining_date !== "undefined") {
		rows.push(`
            <tr>
              <td class="detail-label">Joining Date</td>
              <td class="detail-value">${job.joining_date}</td>
            </tr>
		`);
	}

	if (job.locations && job.locations.length > 0) {
		const locStr = Array.isArray(job.locations) ? job.locations.join(", ") : job.locations;
		if (locStr !== "Not specified" && locStr !== "null" && locStr !== "undefined") {
			rows.push(`
                <tr>
                  <td class="detail-label">Location</td>
                  <td class="detail-value">${locStr}</td>
                </tr>
			`);
		}
	}

	if (job.deadline) {
		rows.push(`
            <tr>
              <td class="detail-label">Apply Deadline</td>
              <td class="detail-value" style="color: #f87171;">${formatDeadline(job.deadline)}</td>
            </tr>
		`);
	}

	// Adjust padding-bottom styles dynamically so the last row has 0 padding (avoids layout gaps)
	const tableRows = rows.map((row, index) => {
		const isLast = index === rows.length - 1;
		if (isLast) {
			return row.replace(/class="detail-label"/g, 'class="detail-label" style="padding-bottom: 0;"')
			          .replace(/class="detail-value"/g, 'class="detail-value" style="padding-bottom: 0;"');
		}
		return row;
	}).join("\n");

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
  <title>${copy.heading}</title>
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
      color: #10b981;
      border: 1px solid rgba(16,185,129,0.35);
      background: rgba(16,185,129,0.08);
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
      padding: 18px 18px 6px;
      margin-bottom: 20px;
    }
    .detail-table {
      width: 100%;
      border-collapse: collapse;
    }
    .detail-label {
      color: #94a3b8;
      font-weight: 600;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      padding-bottom: 12px;
      vertical-align: middle;
      text-align: left;
    }
    .detail-value {
      color: #cbd5f5;
      font-size: 13px;
      font-weight: 700;
      text-align: right;
      padding-bottom: 12px;
      vertical-align: middle;
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
        <div class="hero-title">Hello ${firstName}, ${copy.heading}</div>
        <div class="hero-subtitle">${bodyText}</div>
        <div class="job-badge">${jobType}</div>

        ${rows.length > 0 ? `
        <div class="details-card">
          <table class="detail-table" cellpadding="0" cellspacing="0">
            ${tableRows}
          </table>
        </div>
        ` : ""}

        <a class="cta-button" href="${ctaLink}">${copy.cta}</a>
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
