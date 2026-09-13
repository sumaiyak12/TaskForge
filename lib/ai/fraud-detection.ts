import { generateTextWithGemini } from './gemini';

export interface FraudAnalysisResult {
  fraudScore: number; // 0 (Legitimate) - 100 (High Fraud Risk)
  isDuplicate: boolean;
  isSpam: boolean;
  aiGeneratedRisk: 'LOW' | 'MEDIUM' | 'HIGH';
  verdict: 'LEGITIMATE' | 'SUSPICIOUS' | 'FLAGGED';
  flags: string[];
}

export async function detectFraudWithAI(
  deliverableUrl: string,
  repoUrl?: string,
  submissionNotes?: string,
  previousSubmissionsCount: number = 0
): Promise<FraudAnalysisResult> {
  const prompt = `You are TaskForge AI Fraud & Security Inspector.
Analyze this work submission for fraud indicators: duplicate repository detection, spam content, low-effort template scraping, or bot-generated text.

Submission Details:
Deliverable URL: ${deliverableUrl}
Repo URL: ${repoUrl || 'None'}
Notes: "${submissionNotes || 'None'}"
Submission count for this task: ${previousSubmissionsCount}

Return ONLY a valid JSON object with keys: "fraudScore", "isDuplicate", "isSpam", "aiGeneratedRisk", "verdict", "flags".`;

  // Fallback security analysis logic
  const isSuspiciousUrl = deliverableUrl.includes('example.com') || deliverableUrl.includes('test.com');
  const flags: string[] = [];

  if (isSuspiciousUrl) flags.push('Placeholder or test domain detected');
  if (previousSubmissionsCount > 3) flags.push('High submission velocity detected');
  if (!repoUrl) flags.push('No source repository provided for technical task');

  const fraudScore = isSuspiciousUrl ? 75 : flags.length > 1 ? 40 : 5;
  const verdict = fraudScore > 60 ? 'FLAGGED' : fraudScore > 25 ? 'SUSPICIOUS' : 'LEGITIMATE';

  const fallbackResult: FraudAnalysisResult = {
    fraudScore,
    isDuplicate: previousSubmissionsCount > 2,
    isSpam: isSuspiciousUrl,
    aiGeneratedRisk: fraudScore > 50 ? 'HIGH' : 'LOW',
    verdict,
    flags: flags.length > 0 ? flags : ['No security issues detected. Output appears original and authentic.'],
  };

  try {
    const rawResult = await generateTextWithGemini(prompt, JSON.stringify(fallbackResult));
    const jsonMatch = rawResult.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed: FraudAnalysisResult = JSON.parse(jsonMatch[0]);
      return parsed;
    }
  } catch (error) {
    console.error('Error parsing AI fraud detection:', error);
  }

  return fallbackResult;
}
