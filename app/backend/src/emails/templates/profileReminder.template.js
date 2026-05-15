// ─────────────────────────────────────────────────────────────────────────────
// Base URL — change once to update every link in the template.
// If you import BASE_URL from a shared constants file, remove this line.
// ─────────────────────────────────────────────────────────────────────────────
const BASE_URL = "https://avsaar.kiit.ac.in";

/**
 * Profile completion reminder email for अवSaar — Student-run KIIT Placement Portal
 * Design: Dark theme, amber accent (#f59e0b) for urgency, consistent with welcomeTemplate
 * Compatible with: Gmail, Outlook, Apple Mail, mobile clients
 *
 * NOTE: अवSaar is an independent, student-driven initiative and is NOT
 * an official platform of KIIT University.
 *
 * Fields that count toward completion are derived from the DB constraint
 * `users_profile_completion_check` in placement.users:
 *   branch_id, batch_id, cgpa, tenth_percentage, twelfth_percentage, resume_url
 *
 * @param {object}  user
 * @param {string}  user.full_name            - Raw name / username (e.g. "2187_SATAKSHI" or "Satakshi Patra")
 * @param {string}  user.email                - College email (@kiit.ac.in)
 * @param {string}  [user.branch_id]          - FK → placement.branches
 * @param {string}  [user.batch_id]           - FK → placement.batches
 * @param {number}  [user.cgpa]               - 0–10 numeric
 * @param {number}  [user.tenth_percentage]   - 0–100 numeric
 * @param {number}  [user.twelfth_percentage] - 0–100 numeric
 * @param {string}  [user.resume_url]         - S3 / storage URL
 */
export function profileReminderTemplate(user) {
	// ── Name sanitisation (same logic as welcomeTemplate) ──────────────────
	const rawName = user.full_name ? user.full_name.trim() : "";
	const cleaned = rawName.replace(/^[\d_]+/, "").trim();
	const token = cleaned.split(/[\s_]+/)[0] || "";
	const firstName = token.length > 0 ? token.charAt(0).toUpperCase() + token.slice(1).toLowerCase() : "Student";

	// ── Profile completion checklist ────────────────────────────────────────
	// Mirrors the DB constraint: profile_completed = true requires all 5 groups.
	// branch_id + batch_id are filled together via the profile/complete endpoint,
	// so they are presented as a single step to the user.
	const steps = [
		{
			icon: "🎓",
			label: "Branch & Batch",
			hint: "Your academic stream and graduating year",
			done: !!(user?.branch_id && user?.batch_id),
		},
		{
			icon: "📊",
			label: "CGPA",
			hint: "Current cumulative grade point average (0–10)",
			done: user?.cgpa !== null && user?.cgpa !== undefined,
		},
		{
			icon: "🏫",
			label: "10th Percentage",
			hint: "Your Class X board exam percentage",
			done: user?.tenth_percentage !== null && user?.tenth_percentage !== undefined,
		},
		{
			icon: "🏛️",
			label: "12th Percentage",
			hint: "Your Class XII board exam percentage",
			done: user?.twelfth_percentage !== null && user?.twelfth_percentage !== undefined,
		},
		{
			icon: "📄",
			label: "Resume",
			hint: "Upload your latest resume (PDF)",
			done: !!user?.resume_url,
		},
	];

	const completedCount = steps.filter((s) => s.done).length;
	const totalCount = steps.length;
	const pct = Math.round((completedCount / totalCount) * 100);

	// Tone shifts based on how much is missing
	const isAlmostDone = pct >= 60;
	const urgencyLabel = isAlmostDone ? "Almost There" : "Action Needed";
	const urgencyColor = isAlmostDone ? "#10b981" : "#f59e0b"; // teal if close, amber if far

	const heroHeadline = isAlmostDone ? `You're so close,` : `Don't miss out,`;

	const heroSubtext = isAlmostDone
		? `Just a few more details and your profile will be fully set up. Recruiters and opportunity feeds prioritise students with complete profiles — finish strong.`
		: `Your profile is still incomplete. Without it, you're invisible to job-matching, placement drives may skip you, and your feed stays generic. Takes less than 3 minutes to fix.`;

	// ── Progress bar fill colour: amber → teal as pct increases ────────────
	const barColor = pct >= 80 ? "#10b981" : pct >= 50 ? "#f59e0b" : "#ef4444";

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
  <title>Complete your अवSaar profile</title>
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
    .logo-mark {
      display: inline-block;
      width: 52px;
      height: 52px;
      border-radius: 14px;
      background: linear-gradient(135deg, #10b981 0%, #059669 50%, #065f46 100%);
      line-height: 52px;
      font-size: 26px;
      font-weight: 900;
      color: #ffffff;
      text-align: center;
      margin-bottom: 14px;
      box-shadow: 0 0 32px rgba(16,185,129,0.35);
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
      background: linear-gradient(145deg, #1a1200 0%, #130e00 40%, #0a0900 100%);
      border: 1px solid rgba(245,158,11,0.2);
      border-radius: 20px;
      padding: 40px 36px 36px;
      position: relative;
      overflow: hidden;
    }
    .hero-glow {
      position: absolute;
      top: 0;
      right: 0;
      width: 200px;
      height: 200px;
      background: radial-gradient(circle at top right, rgba(245,158,11,0.1) 0%, transparent 70%);
      border-radius: 0 20px 0 100%;
      pointer-events: none;
    }
    .urgency-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 999px;
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 0.5px;
      margin-bottom: 18px;
      border: 1px solid;
    }
    .greeting {
      font-size: 28px;
      font-weight: 800;
      color: #ffffff;
      line-height: 1.25;
      letter-spacing: -0.5px;
      margin-bottom: 12px;
    }
    .greeting .name { color: #f59e0b; }

    .hero-subtext {
      font-size: 15px;
      color: #9ca3af;
      line-height: 1.7;
      margin-bottom: 28px;
    }

    /* ── Progress section ── */
    .progress-label-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }
    .progress-label {
      font-size: 12px;
      font-weight: 600;
      color: #9ca3af;
      letter-spacing: 0.3px;
    }
    .progress-pct {
      font-size: 13px;
      font-weight: 700;
    }
    .progress-track {
      width: 100%;
      height: 6px;
      background: rgba(255,255,255,0.08);
      border-radius: 999px;
      overflow: hidden;
      margin-bottom: 28px;
    }
    .progress-fill {
      height: 100%;
      border-radius: 999px;
      transition: width 0.4s ease;
    }

    /* ── CTA ── */
    .cta-button {
      display: block;
      width: 100%;
      padding: 15px 32px;
      background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
      color: #0a0900 !important;
      font-size: 15px;
      font-weight: 700;
      border-radius: 12px;
      letter-spacing: 0.2px;
      box-shadow: 0 4px 24px rgba(245,158,11,0.35);
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

    /* ── Checklist ── */
    .section-label {
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: #f59e0b;
      margin-bottom: 20px;
    }
    .checklist-item {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 12px 16px;
      border-radius: 12px;
      margin-bottom: 8px;
      border: 1px solid;
    }
    .checklist-item.done {
      background: rgba(16,185,129,0.05);
      border-color: rgba(16,185,129,0.15);
    }
    .checklist-item.pending {
      background: rgba(245,158,11,0.04);
      border-color: rgba(245,158,11,0.12);
    }
    .check-icon     { width: 28px; height: 28px; min-width: 28px; font-size: 24px; line-height: 28px; text-align: center; flex-shrink: 0; }
    .check-body     { flex: 1; display: flex; flex-direction: column; gap: 2px; min-width: 0; }
    .check-label {
      font-size: 14px;
      font-weight: 600;
    }
    .check-hint {
      font-size: 12px;
      color: #6b7280;
      line-height: 1.4;
    }

    .check-status {
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.4px;
      text-transform: uppercase;
    }
    .check-status.done    { color: #10b981; }
    .check-status.pending { color: #f59e0b; }

    /* ── Why it matters box ── */
    .why-box {
      background: rgba(245,158,11,0.05);
      border: 1px solid rgba(245,158,11,0.14);
      border-radius: 12px;
      padding: 18px 20px;
      margin-top: 28px;
    }
    .why-box-title {
      font-size: 13px;
      font-weight: 700;
      color: #fde68a;
      margin-bottom: 10px;
    }
    .why-row {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      margin-bottom: 8px;
    }
    .why-row:last-child { margin-bottom: 0; }
    .why-dot {
      width: 5px;
      height: 5px;
      min-width: 5px;
      border-radius: 50%;
      background: #f59e0b;
      margin-top: 7px;
    }
    .why-text {
      font-size: 13px;
      color: #9ca3af;
      line-height: 1.55;
    }

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
      .logo-mark      { width: 46px; height: 46px; line-height: 46px; font-size: 22px; }

      .cta-button     { font-size: 14px; padding: 14px 20px; }

      .checklist-item { padding: 10px 12px; gap: 10px; }
      .check-icon     { width: 24px; height: 24px; min-width: 24px; font-size: 12px; }
      .check-label    { font-size: 13px; }

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
        <div class="logo-mark">अ</div>
        <div class="brand-name">अव<span>Saar</span></div>
        <div class="brand-tagline">Opportunities &bull; Growth &bull; Future</div>
        <div class="unofficial-badge">Student Initiative &bull; Not an official KIIT platform</div>
      </div>

      <!-- ══ HERO CARD ══ -->
      <div class="hero-card">
        <div class="hero-glow"></div>

        <span class="urgency-badge"
              style="color:${urgencyColor}; border-color:${urgencyColor}40; background:${urgencyColor}12;">
          ${urgencyLabel}
        </span>

        <div class="greeting">
          ${heroHeadline}<br>
          <span class="name">${firstName}! 👤</span>
        </div>

        <p class="hero-subtext">${heroSubtext}</p>

        <!-- Progress bar -->
        <div class="progress-label-row">
          <span class="progress-label">Profile completion</span>
          <span class="progress-pct" style="color:${barColor};">${pct}%</span>
        </div>
        <div class="progress-track">
          <div class="progress-fill"
               style="width:${pct}%; background: linear-gradient(90deg, ${barColor} 0%, ${barColor}cc 100%);"></div>
        </div>

        <a href="${BASE_URL}/profile/edit" class="cta-button">Complete My Profile →</a>
        <p class="cta-note">Takes less than 3 minutes &bull; Unlocks your full feed instantly</p>
      </div>

      <!-- ══ CHECKLIST ══ -->
      <div style="padding: 0 4px;">
        <hr class="section-divider">

        <p class="section-label">Your profile checklist</p>

        ${steps
			.map(
				(s) => `
        <div class="checklist-item ${s.done ? "done" : "pending"}">
          <div class="check-icon ${s.done ? "done" : "pending"}">${s.done ? "✅" : s.icon}</div>
          <div class="check-body">
            <span class="check-label ${s.done ? "done" : "pending"}">${s.label}</span>
            <span class="check-hint">${s.hint}</span>
          </div>
          <span class="check-status ${s.done ? "done" : "pending"}">${s.done ? "Done" : "Missing"}</span>
        </div>`,
			)
			.join("")}

        <div class="why-box">
          <div class="why-box-title">💡 Why your profile matters</div>
          <div class="why-row">
            <div class="why-dot"></div>
            <span class="why-text"><strong style="color:#fde68a;">Branch, batch & CGPA</strong> are used to filter which job circulars and placement drives you're eligible for. Without them, you see everything — or nothing relevant.</span>
          </div>
          <div class="why-row">
            <div class="why-dot"></div>
            <span class="why-text"><strong style="color:#fde68a;">10th & 12th percentages</strong> are required by most companies as minimum eligibility criteria. They need to be on file before you can apply.</span>
          </div>
          <div class="why-row">
            <div class="why-dot"></div>
            <span class="why-text"><strong style="color:#fde68a;">Your resume</strong> can be directly referenced by volunteers sharing relevant circulars, and by placement coordinators reviewing applicants.</span>
          </div>
        </div>

        <!-- Unofficial platform notice -->
        <div class="disclaimer-strip">
          <p>
            ⚠️ अवSaar is an independent student initiative and is
            <strong style="color:#9ca3af;">not affiliated with, endorsed by, or an official product of KIIT University</strong>.
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
          You received this because your अवSaar profile is incomplete.<br>
          <a href="${BASE_URL}/notifications/unsubscribe" style="color:#4b5563;">Unsubscribe from reminders</a>
          &bull; <a href="${BASE_URL}/privacy" style="color:#4b5563;">Privacy Policy</a><br><br>
          An independent student project &bull; Not affiliated with KIIT University<br>
          Bhubaneswar, Odisha &bull; &copy; ${new Date().getFullYear()} <span>अवSaar</span>. All rights reserved.
        </p>
      </div>

    </div>
  </div>
</body>
</html>
  `;
}
