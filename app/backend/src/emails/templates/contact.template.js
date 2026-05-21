export const contactTemplate = (data) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background-color: #f3f4f6; color: #1f2937; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; padding: 30px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
    h2 { color: #10b981; margin-top: 0; }
    .field { margin-bottom: 15px; }
    .label { font-weight: bold; color: #4b5563; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px; }
    .value { font-size: 16px; color: #111827; background: #f9fafb; padding: 12px; border-radius: 6px; border: 1px solid #e5e7eb; white-space: pre-wrap; }
    .footer { margin-top: 30px; font-size: 12px; color: #6b7280; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <h2>New Contact Message</h2>
    <p>You have received a new message from the अवSaar contact form.</p>
    
    <div class="field">
      <div class="label">Name</div>
      <div class="value">${data.name}</div>
    </div>
    
    <div class="field">
      <div class="label">Email</div>
      <div class="value">${data.email}</div>
    </div>
    
    <div class="field">
      <div class="label">Message</div>
      <div class="value">${data.message}</div>
    </div>
    
    <div class="footer">
      This email was sent automatically from the अवSaar platform.
    </div>
  </div>
</body>
</html>
`;
