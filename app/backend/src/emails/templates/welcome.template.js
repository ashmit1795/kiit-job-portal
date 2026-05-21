import env from "../../config/env.js";

// ─────────────────────────────────────────────────────────────────────────────
// Base URL — change this once to update every link in the template
// ─────────────────────────────────────────────────────────────────────────────
const BASE_URL = env.FRONTEND_BASE_URL;
const LOGO_URL = env.LOGO_URL || "https://ibb.co/4ZtnvnYC/avsaar-logo.jpg";

/**
 * Welcome email template for अवSaar — Student-run KIIT Placement Portal
 * Design: Dark theme, teal/emerald accent (#10b981), system + web fonts
 * Compatible with: Gmail, Outlook, Apple Mail, mobile clients
 *
 * NOTE: अवSaar is an independent, student-driven initiative and is NOT
 * an official platform of KIIT University.
 *
 * @param {object} user - { full_name, email, role }
 */
export function welcomeTemplate(user) {
	// Derive a display name from full_name or fall back to "Student".
	// Handles usernames like "2187_SATAKSHI": strip leading digits/underscores,
	// then take the first space-separated token and title-case it.
	const rawName = user.full_name ? user.full_name.trim() : "";
	const cleaned = rawName.replace(/^[\d_]+/, "").trim(); // drop leading numbers/underscores
	const token = cleaned.split(/[\s_]+/)[0] || ""; // first word/segment
	const firstName = token.length > 0 ? token.charAt(0).toUpperCase() + token.slice(1).toLowerCase() : "Student";

	const isAdmin = user.role === "admin";
	const isVolunteer = user.role === "volunteer";

	const roleTag = isAdmin ? "Admin" : isVolunteer ? "Volunteer" : "Student";

	const roleColor = isAdmin ? "#f59e0b" : isVolunteer ? "#3b82f6" : "#10b981";

	const ctaHref = isAdmin ? `${BASE_URL}/admin` : `${BASE_URL}/jobs`;

	const ctaLabel = isAdmin ? "Open Admin Dashboard" : "Explore Opportunities";

	const features = isAdmin
		? [
				{ icon: "👥", title: "Manage Users", desc: "Promote students to volunteers, manage roles and access." },
				{ icon: "✅", title: "Approve Postings", desc: "Review and approve volunteer-submitted job circulars." },
				{ icon: "📊", title: "Analytics Dashboard", desc: "View platform stats, logs, and volunteer activity." },
			]
		: [
				{
					icon: "📋",
					title: "Latest Circulars",
					desc: "Placement drives, internships, hackathons, and career opportunities — all in one place, shared by fellow students.",
				},
				{
					icon: "🎯",
					title: "Personalized Feed",
					desc: "Jobs matched to your branch, batch, and CGPA automatically. No noise, just what matters to you.",
				},
				{ icon: "📥", title: "Download Instantly", desc: "Access and download opportunity PDFs directly from the portal, no redirects." },
			];

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
  <title>Welcome to अवSaar</title>
  <!--[if mso]>
  <noscript>
    <xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml>
  </noscript>
  <![endif]-->
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

    /* ── Reset ── */
    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background-color: #030a06;
      color: #e2e8f0;
      -webkit-font-smoothing: antialiased;
      line-height: 1.6;
      /* prevent Outlook from scaling text */
      -ms-text-size-adjust: 100%;
      -webkit-text-size-adjust: 100%;
    }

    a { color: #10b981; text-decoration: none; }
    img { display: block; max-width: 100%; border: 0; }

    /* ── Layout ── */
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

    /* ── Header ── */
    .header {
      text-align: center;
      padding-bottom: 32px;
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
    /* Unofficial disclaimer badge in header */
    .unofficial-badge {
      display: inline-block;
      margin-top: 10px;
      padding: 3px 10px;
      border-radius: 999px;
      font-size: 10px;
      font-weight: 600;
      letter-spacing: 0.4px;
      color: #9ca3af;
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.08);
    }

    /* ── Hero card ── */
    .hero-card {
      background: linear-gradient(145deg, #0d2016 0%, #0a1a10 40%, #061410 100%);
      border: 1px solid rgba(16,185,129,0.18);
      border-radius: 20px;
      padding: 40px 36px 36px;
      position: relative;
      overflow: hidden;
    }
    .hero-glow {
      position: absolute;
      top: 0;           /* anchored to card top — no negative offset that can push layout */
      right: 0;
      width: 200px;
      height: 200px;
      background: radial-gradient(circle at top right, rgba(16,185,129,0.13) 0%, transparent 70%);
      border-radius: 0 20px 0 100%;  /* follow card corner */
      pointer-events: none;
    }
    .hero-top-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 18px;
      position: relative;
      z-index: 2;
    }
    .role-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 999px;
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 0.5px;
      border: 1px solid;
    }
    .user-avatar {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      border: 2px solid rgba(16,185,129,0.25);
      object-fit: cover;
      background: rgba(16,185,129,0.05);
    }
    .user-avatar-fallback {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: rgba(16,185,129,0.1);
      border: 2px solid rgba(16,185,129,0.25);
      color: #10b981;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      font-weight: 700;
      line-height: 1;
    }
    .greeting {
      font-size: 28px;
      font-weight: 800;
      color: #ffffff;
      line-height: 1.25;
      letter-spacing: -0.5px;
      margin-bottom: 12px;
    }
    .greeting .name { color: #10b981; }

    .hero-subtext {
      font-size: 15px;
      color: #9ca3af;
      line-height: 1.7;
      margin-bottom: 28px;
    }
    .hero-subtext strong { color: #e2e8f0; }

    /* CTA — block on all viewports for reliable rendering */
    .cta-button {
      display: block;
      width: 100%;
      padding: 15px 32px;
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: #ffffff !important;
      font-size: 15px;
      font-weight: 700;
      border-radius: 12px;
      letter-spacing: 0.2px;
      box-shadow: 0 4px 24px rgba(16,185,129,0.40);
      text-align: center;
    }
    .cta-note {
      font-size: 12px;
      color: #6b7280;
      margin-top: 10px;
      text-align: center;
    }

    /* ── Divider ── */
    .section-divider {
      border: none;
      border-top: 1px solid rgba(255,255,255,0.06);
      margin: 32px 0;
    }

    /* ── Features ── */
    .section-label {
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: #10b981;
      margin-bottom: 20px;
    }
    .feature-row {
      display: flex;
      align-items: flex-start;
      gap: 14px;
      margin-bottom: 20px;
    }
    .feature-icon {
      width: 40px;
      height: 40px;
      min-width: 40px;                          /* prevent shrinking on mobile */
      background: rgba(16,185,129,0.1);
      border: 1px solid rgba(16,185,129,0.2);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      flex-shrink: 0;
      line-height: 40px;
      text-align: center;
    }
    .feature-title {
      font-size: 14px;
      font-weight: 700;
      color: #f1f5f9;
      margin-bottom: 3px;
    }
    .feature-desc {
      font-size: 13px;
      color: #6b7280;
      line-height: 1.55;
    }

    /* ── Info box ── */
    .info-box {
      background: rgba(16,185,129,0.06);
      border: 1px solid rgba(16,185,129,0.15);
      border-radius: 12px;
      padding: 16px 20px;
      margin-top: 28px;
    }
    .info-box p {
      font-size: 13px;
      color: #9ca3af;
      line-height: 1.6;
    }
    .info-box strong { color: #10b981; }

    /* ── Disclaimer strip ── */
    .disclaimer-strip {
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.06);
      border-radius: 12px;
      padding: 14px 18px;
      margin-top: 28px;
    }
    .disclaimer-strip p {
      font-size: 12px;
      color: #6b7280;
      line-height: 1.6;
      text-align: center;
    }

    /* ── Footer ── */
    .footer {
      text-align: center;
      padding-top: 32px;
    }
    .footer-links { margin-bottom: 16px; }
    .footer-links a {
      font-size: 12px;
      color: #6b7280;
      margin: 0 8px;
    }
    .footer-copy {
      font-size: 12px;
      color: #374151;
      line-height: 1.7;
    }
    .footer-copy span { color: #10b981; }

    /* ── Mobile overrides ── */
    @media only screen and (max-width: 480px) {
      .email-wrapper  { padding: 24px 12px; }
      .hero-card      { padding: 24px 18px 28px; }

      .greeting       { font-size: 22px; }
      .hero-subtext   { font-size: 14px; }

      .brand-name     { font-size: 20px; }
      .logo-img       { width: 48px; height: 48px; }

      .cta-button     { font-size: 14px; padding: 14px 20px; }

      /* Keep features aligned on small screens */
      .feature-row    { gap: 10px; }
      .feature-icon   { width: 36px; height: 36px; min-width: 36px; line-height: 36px; font-size: 16px; }

      .footer-links a { margin: 0 5px; }

      .section-divider { margin: 24px 0; }
    }
  </style>
</head>
<body>
  <div class="email-wrapper">
    <div class="email-container">

      <!-- ══ HEADER ══ -->
      <div class="header">
        <img src="${LOGO_URL}" alt="अवSaar Logo" class="logo-img" />
        <div class="brand-name">अव<span>Saar</span></div>
        <div class="brand-tagline">Opportunities &bull; Growth &bull; Future</div>
        <div class="unofficial-badge">Student Initiative &bull; Not an official KIIT platform</div>
      </div>

      <!-- ══ HERO CARD ══ -->
      <div class="hero-card">
        <div class="hero-glow"></div>

        <div class="hero-top-row">
          <span class="role-badge" style="color:${roleColor}; border-color:${roleColor}40; background:${roleColor}12;">
            ${roleTag}
          </span>
          ${user.avatar_url ? 
            `<img src="${user.avatar_url}" alt="${firstName}" class="user-avatar" />` : 
            `<div class="user-avatar-fallback">${firstName.charAt(0)}</div>`
          }
        </div>

        <div class="greeting">
          Welcome aboard,<br>
          <span class="name">${firstName}! 👋</span>
        </div>

        <p class="hero-subtext">
          You're now part of <strong>अवSaar</strong> — an independent, student-built career and opportunity platform made for the KIIT community. We're not affiliated with KIIT University; we're students who wanted something better and built it ourselves.
          ${
				isAdmin
					? " As an admin, you help keep the platform running smoothly — moderating opportunities and supporting the community."
					: isVolunteer
						? " As a volunteer, you help fellow students stay informed by sharing and managing job circulars."
						: " Complete your profile to unlock your personalized job feed and start exploring what's out there."
			}
        </p>

        <a href="${ctaHref}" class="cta-button">${ctaLabel} →</a>
        <p class="cta-note">
          ${
				isAdmin
					? "Manage users, jobs, and platform activity from one place."
					: "A complete profile helps us surface the most relevant opportunities for you."
			}
        </p>
      </div>

      <!-- ══ FEATURES ══ -->
      <div style="padding: 0 4px;">
        <hr class="section-divider">

        <p class="section-label">What you can do</p>

        ${features
			.map(
				(f) => `
        <div class="feature-row">
          <div class="feature-icon">${f.icon}</div>
          <div>
            <div class="feature-title">${f.title}</div>
            <div class="feature-desc">${f.desc}</div>
          </div>
        </div>`,
			)
			.join("")}

        ${
			!isAdmin
				? `
        <div class="info-box">
          <p>
            🔐<strong>@kiit.ac.in only</strong> &mdash; अवSaar is exclusively open to KIIT students and staff.
            Sign in with your official college email to access all features.
          </p>
        </div>`
				: ""
		}

        <!-- Unofficial platform notice -->
        <div class="disclaimer-strip">
          <p>
            ⚠️अवSaar is an independent student initiative and is <strong style="color:#9ca3af;">not affiliated with, endorsed by, or an official product of KIIT University</strong>.
            All trademarks and institutional names belong to their respective owners.
          </p>
        </div>

        <hr class="section-divider">
      </div>

      <!-- ══ FOOTER ══ -->
      <div class="footer">
        <div class="footer-links">
          <a href="${BASE_URL}/about">About</a>
          <a href="${BASE_URL}/faqs">FAQs</a>
          <a href="${BASE_URL}/privacy">Privacy</a>
          <a href="${BASE_URL}/contact">Contact</a>
        </div>
        <p class="footer-copy">
          You received this because you signed up for <span>अवSaar</span>.<br>
          An independent student project &bull; Not affiliated with KIIT University<br>
          Bhubaneswar, Odisha &bull; &copy; ${new Date().getFullYear()} अवSaar. All rights reserved.
        </p>
      </div>

    </div>
  </div>
</body>
</html>
  `;
}
