const MAX_FIELD_LENGTH = 5000;

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Méthode non autorisée.' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const recipient = process.env.CONTACT_EMAIL;
  const sender = process.env.CONTACT_FROM_EMAIL;

  if (!apiKey || !recipient || !sender) {
    return res.status(503).json({
      error: 'Le formulaire est prêt, mais le service de réception doit être configuré par l’administrateur du site.'
    });
  }

  const payload = req.body || {};
  const fields = payload.fields && typeof payload.fields === 'object' ? payload.fields : {};
  const subject = String(payload.subject || 'Nouveau message — Impact Afriq').slice(0, 160);
  const entries = Object.entries(fields)
    .filter(([key]) => /^[\p{L}\p{N} _-]{1,80}$/u.test(key))
    .map(([key, value]) => [key, String(value || '').trim().slice(0, MAX_FIELD_LENGTH)]);

  const requiredByForm = {
    'Contact du site Impact Afriq': ['name', 'email', 'subject', 'message'],
    'Proposition d’événement — Impact Afriq': ['Nom de l’activité', 'Présentation'],
    'Proposition de partenariat — Impact Afriq': ['Nom complet', 'Organisation', 'E-mail', 'Proposition']
  };
  const requiredFields = requiredByForm[subject] || [];
  if (!entries.length || requiredFields.some((required) => !fields[required] || !String(fields[required]).trim())) {
    return res.status(400).json({ error: 'Veuillez remplir tous les champs obligatoires.' });
  }

  const emailField = entries.find(([key]) => /e-?mail/i.test(key));
  if (emailField && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField[1])) {
    return res.status(400).json({ error: 'Adresse e-mail invalide.' });
  }

  const text = [
    'Nouvelle demande depuis le site Impact Afriq',
    '',
    ...entries.map(([key, value]) => key + ' : ' + value),
    '',
    'Sujet du formulaire : ' + subject
  ].join('\n');

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: sender,
        to: [recipient],
        subject: subject,
        text
      })
    });
    if (!response.ok) {
      const detail = await response.text();
      console.error('Resend contact delivery failed:', response.status, detail.slice(0, 500));
      return res.status(502).json({ error: 'Le message n’a pas pu être transmis. Réessayez plus tard.' });
    }
    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Contact API error:', error);
    return res.status(502).json({ error: 'Erreur temporaire lors de l’envoi du message.' });
  }
};
