import api from './api';
import { normalizeSubmission } from '../utils/normalizeData';

const FORMS = {
  checkin: '261134527667966',
  message: '261133651963962',
  sighting: '261133720555956',
  note: '261134449238963',
  tip: '261134430330946',
};

async function fetchFormSubmissions(formId, type) {
  const response = await api.get(`/form/${formId}/submissions`);
  const submissions = response.data?.content || [];
  return submissions.map(s => normalizeSubmission(s, type));
}

export async function fetchAllEvents() {
  const results = await Promise.all(
    Object.entries(FORMS).map(([type, formId]) =>
      fetchFormSubmissions(formId, type)
    )
  );

  const allEvents = results.flat();

  return allEvents.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
}
