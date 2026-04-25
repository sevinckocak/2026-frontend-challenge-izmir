// Jotform answer structure: { FIELD_ID: { text: "label", answer: "value" } }
// text  → field label (for identification)
// answer → actual submitted value (the data we extract)
// FIELD_IDs are always dynamic — never hardcoded
//
// Known labels per form (discovered from live API):
//   checkin  → fullName, location, coordinates, timestamp, note
//   message  → from, to, message, timestamp
//   sighting → personName, seenWith, location, coordinates, timestamp, note
//   note     → fullName, note, timestamp
//   tip      → suspectName, location, coordinates, timestamp, tip, confidence

const SKIP_LABELS = new Set(['timestamp', 'coordinates', 'heading', 'submit', 'submit2']);

function getAnswerValue(answer) {
  if (!answer) return null;
  if (typeof answer === 'string') return answer.trim() || null;
  if (Array.isArray(answer)) return answer.filter(Boolean).join(', ') || null;
  if (typeof answer === 'object') {
    return (
      Object.values(answer)
        .filter(v => v && typeof v === 'string')
        .join(' ')
        .trim() || null
    );
  }
  return String(answer).trim() || null;
}

function findByLabel(answers, ...keywords) {
  const fields = Object.values(answers);
  for (const kw of keywords) {
    const kwLower = kw.toLowerCase();
    const field = fields.find(f => (f.text || '').toLowerCase().includes(kwLower));
    if (field) {
      const val = getAnswerValue(field.answer);
      if (val) return val;
    }
  }
  return null;
}

// Most specific → most generic so each form type matches correctly
function extractPerson(answers) {
  const byLabel = findByLabel(
    answers,
    'suspectname', 'personname', 'fullname', 'full name',
    'from', 'sender', 'reporter', 'witness', 'author', 'name'
  );
  if (byLabel) return byLabel;

  for (const field of Object.values(answers)) {
    const val = getAnswerValue(field.answer);
    if (val && val.length <= 60 && /^[A-Za-zÀ-ÿğüşıöçĞÜŞİÖÇ\s''-]+$/.test(val)) {
      return val;
    }
  }
  return 'Unknown';
}

function extractLocation(answers) {
  return findByLabel(answers, 'location', 'place', 'where', 'address', 'area', 'venue');
}

// Parse form's internal timestamp field: "DD-MM-YYYY HH:MM"
function extractEventTimestamp(answers, fallback) {
  const tsVal = findByLabel(answers, 'timestamp', 'time', 'zaman', 'tarih');
  if (tsVal && typeof tsVal === 'string') {
    const m = tsVal.match(/(\d{2})-(\d{2})-(\d{4})\s+(\d{2}):(\d{2})/);
    if (m) {
      const [, day, month, year, hour, min] = m;
      return `${year}-${month}-${day}T${hour}:${min}:00`;
    }
    const d = new Date(tsVal);
    if (!isNaN(d.getTime())) return d.toISOString();
  }
  return fallback;
}

function extractContent(answers) {
  const parts = Object.values(answers)
    .filter(field => {
      const label = (field.text || '').toLowerCase().trim();
      return !SKIP_LABELS.has(label) && getAnswerValue(field.answer);
    })
    .map(field => {
      const val = getAnswerValue(field.answer);
      const label = (field.text || '').trim();
      return label ? `${label}: ${val}` : val;
    })
    .filter(Boolean);
  return parts.join(' | ') || 'No details available';
}

export function normalizeSubmission(submission, type) {
  const { id, answers = {}, created_at } = submission;
  const location = extractLocation(answers);

  return {
    id: `${type}-${id}`,
    type,
    person: extractPerson(answers),
    timestamp: extractEventTimestamp(answers, created_at),
    ...(location ? { location } : {}),
    content: extractContent(answers),
  };
}
