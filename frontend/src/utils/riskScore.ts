import { Student, StudentAlert, StudentFeedback } from '../types';

export type RiskLevel = 'faible' | 'modere' | 'eleve' | 'critique';

export interface StudentRiskResult {
  score: number;
  level: RiskLevel;
  reasons: string[];
}

/**
 * Calcule le score de risque décrochage / abandon (0 à 100) d'un apprenant
 * à partir de son assiduité, des alertes actives et des feedbacks négatifs.
 */
export function computeStudentRisk(
  student: Student,
  alerts: StudentAlert[],
  feedbacks: StudentFeedback[] = []
): StudentRiskResult {
  if (student.status === 'interrupted' || student.status === 'resigned') {
    return {
      score: 100,
      level: 'critique',
      reasons: [`Statut administratif : ${student.status === 'interrupted' ? 'Interrompu' : 'Démissionnaire'}`],
    };
  }

  let score = 0;
  const reasons: string[] = [];

  const rate = student.attendanceRate ?? 100;
  if (rate < 80) {
    score += 45;
    reasons.push(`Assiduité critique (${rate}% < 80%)`);
  } else if (rate < 90) {
    score += 25;
    reasons.push(`Assiduité fragile (${rate}% < 90%)`);
  } else if (rate < 95) {
    score += 10;
    reasons.push(`Assiduité à surveiller (${rate}%)`);
  }

  const openAlerts = alerts.filter(
    a => a.studentId === student.id && (a.status === 'open' || a.status === 'in_progress')
  );
  if (openAlerts.length > 0) {
    score += Math.min(35, openAlerts.length * 18);
    reasons.push(`${openAlerts.length} alerte(s) d'assiduité active(s)`);
    const criticals = openAlerts.filter(a => a.severity === 'critical' || a.severity === 'high');
    if (criticals.length > 0) {
      score += 15;
      reasons.push(`${criticals.length} alerte(s) haute criticité`);
    }
  }

  const negativeFeedbacks = feedbacks.filter(
    f => f.studentId === student.id && f.sentiment === 'negative'
  );
  if (negativeFeedbacks.length > 0) {
    score += Math.min(25, negativeFeedbacks.length * 15);
    reasons.push(`${negativeFeedbacks.length} feedback(s) négatif(s) formateur/ESN`);
  }

  score = Math.min(100, score);

  let level: RiskLevel = 'faible';
  if (score >= 75) level = 'critique';
  else if (score >= 50) level = 'eleve';
  else if (score >= 25) level = 'modere';

  if (reasons.length === 0) {
    reasons.push('Aucun signal de décrochage détecté');
  }

  return { score, level, reasons };
}
