const RECIPIENT = 'lagos@slchurchng.org';
const ALLOWED_REASONS = ["I’m new here", 'I want to join a Trybe', 'I need prayer', 'I have a testimony', 'I want to serve', 'General enquiry'];

function doPost(event) {
  try {
    const data = JSON.parse(event.postData.contents || '{}');
    const expectedSecret = PropertiesService.getScriptProperties().getProperty('FORM_SHARED_SECRET');
    if (!expectedSecret || data.secret !== expectedSecret) return jsonResponse({ok: false}, 403);

    const reason = clean(data.reason, 80);
    const name = clean(data.name, 100);
    const email = clean(data.email, 254);
    const phone = clean(data.phone, 40);
    const message = clean(data.message, 3000);
    if (ALLOWED_REASONS.indexOf(reason) === -1 || name.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || phone.length < 5 || message.length < 10) {
      return jsonResponse({ok: false}, 400);
    }

    const subject = '[SLC Lagos website] ' + reason;
    const plainText = ['New website message', '', 'Reason: ' + reason, 'Name: ' + name, 'Email: ' + email, 'Phone: ' + phone, '', 'Message:', message].join('\n');
    const html = '<h2>New website message</h2>' +
      '<p><strong>Reason:</strong> ' + escapeHtml(reason) + '<br><strong>Name:</strong> ' + escapeHtml(name) +
      '<br><strong>Email:</strong> ' + escapeHtml(email) + '<br><strong>Phone:</strong> ' + escapeHtml(phone) + '</p>' +
      '<p><strong>Message</strong></p><p>' + escapeHtml(message).replace(/\n/g, '<br>') + '</p>';
    MailApp.sendEmail({to: RECIPIENT, subject: subject, body: plainText, htmlBody: html, replyTo: email, name: 'SLC Lagos Website'});
    return jsonResponse({ok: true}, 200);
  } catch (error) {
    console.error(error);
    return jsonResponse({ok: false}, 500);
  }
}

function clean(value, maxLength) { return typeof value === 'string' ? value.trim().slice(0, maxLength) : ''; }
function escapeHtml(value) { return value.replace(/[&<>"']/g, function (character) { return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]; }); }
function jsonResponse(body) { return ContentService.createTextOutput(JSON.stringify(body)).setMimeType(ContentService.MimeType.JSON); }
