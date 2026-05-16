import { getActivityReservedLeafs, getAvailableLeafs } from '../utils/leafsMath.js';
import { saveInstitution } from './institutionService.js';

export function createInstitutionActivity(institution, payload) {
  const activity = {
    id: `act-${Date.now()}`,
    title: payload.title || 'Nova atividade',
    description: payload.description || 'Atividade criada pela instituição.',
    rewardLeafs: Number(payload.rewardLeafs || 100),
    participantLimit: Number(payload.participantLimit || 10),
    participants: 0,
    status: 'Disponível',
    endDate: payload.endDate || 'Sem prazo definido',
  };

  const requiredLeafs = getActivityReservedLeafs(activity);
  const availableLeafs = getAvailableLeafs(institution);

  if (requiredLeafs > availableLeafs) {
    return {
      ok: false,
      error: 'Esta atividade reserva mais Folhas do que sua instituição tem disponível.',
      institution,
    };
  }

  const next = {
    ...institution,
    activities: [activity, ...(institution.activities || [])],
  };

  return {
    ok: true,
    activity,
    institution: saveInstitution(next),
  };
}
