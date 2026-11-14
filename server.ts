import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '1mb' }));

const PORT = 3000;

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

const FAMILY_ASSISTANT_SYSTEM_INSTRUCTION = `You are the SPACE CARE Family Assistant, built for SPACE CARE — Family Connect (NASA Space Apps Cairo 2026).

Your role is to support astronauts' families with warmth, reassurance, clarity, and scientific honesty.

CRITICAL SAFETY & ACCURACY RULES:
1. NEVER invent NASA facts, real-time spacecraft telemetry, or undisclosed mission events.
2. NEVER provide medical diagnoses, clinical assessments, or claim an astronaut is medically cleared, healthy, or safe based on simulated demo data.
3. Clearly rely ONLY on the provided demo mission context and well-established general spaceflight education concepts (such as microgravity circadian rhythm, fluid shift, or resistive exercise).
4. If the user asks for information not present in the provided mission context, clearly and gently state that the information is not currently available in the approved family updates.
5. Remind gently when relevant that SPACE CARE Family Connect currently displays simulated demonstration data for prototype evaluation, and real crew communications require authorized ground systems.
6. Respond in the requested language ("ar" -> warm, clear Modern Standard Arabic; "en" -> warm, clear English).
7. Keep answers concise (2-4 short paragraphs or bullet points), easy for non-technical family members to read.`;

function buildFallbackAssistantReply(question: string, lang: 'en' | 'ar', contextSummary: string): string {
  const q = question.toLowerCase();

  if (lang === 'ar') {
    if (q.includes('sleep') || q.includes('نوم') || q.includes('circadian')) {
      return 'في بيئة الجاذبية الصغرى، تدور المحطة المدارية حول الأرض كل 90 دقيقة تقريباً، مما يجعل رواد الفضاء يشهدون شروقاً وغروباً متكرراً. لذلك تعتمد البعثات على إضاءة مضبوطة للإيقاع اليومي وجدول نوم منتظم. وفقاً لملخص العافية التجريبي المعتمد لليوم الـ 42، سجلت القائدة ليلى المنصوري متوسط نوم يقارب 7 ساعات و20 دقيقة مع التزام بروتوكول الإضاءة المدارية.\n\nملاحظة: هذه المعلومات من بيانات العرض التجريبية وليست تشخيصاً طبياً أو بيانات ناسا فورية.';
    }
    if (q.includes('next') || q.includes('update') || q.includes('القادم') || q.includes('تحديث')) {
      return 'وفقاً للجدول الزمني التجريبي للبعثة، فإن التحديث المعتمد القادم للعائلة مجدول في تمام الساعة 18:30 بتوقيت القاهرة (16:30 UTC)، كما توجد نافذة مكالمة عائلية مخصصة يوم السبت القادم.\n\nإذا كنتِ بحاجة إلى تفاصيل غير مدرجة في التحديثات المعتمدة الحالية، فسيتم إضافتها فور اعتمادها من مركز الدعم الأرضي.';
    }
    if (q.includes('wellness') || q.includes('health') || q.includes('صحة') || q.includes('عافية') || q.includes('layla') || q.includes('ليلى')) {
      return `يُظهر أحدث ملخص تجريبي معتمد لليوم الـ 42 حالة مستقرة ومريحة في الروتين اليومي، مع إتمام تمارين المقاومة اليومية لمدة ساعتين و15 دقيقة وترطيب منتظم.\n\nتذكري أن هذه البيانات تجريبية لأغراض العرض في مشروع SPACE CARE، ولا تمثل تشخيصاً طبياً أو بديلاً عن التقييم الطبي الرسمي.`;
    }
    return `أهلاً بكِ في مساعد عائلة SPACE CARE. استناداً إلى بيانات العرض التجريبية الحالية للبعثة (${contextSummary.slice(0, 140)}...)، تسير الأنشطة المجدولة بشكل منتظم في اليوم الـ 42 من المهمة.\n\nإذا لم تكن المعلومة المطلوبة متوفرة في التحديثات العائلية المعتمدة، فهذا يعني أن فريق الدعم الأرضي لم ينشرها بعد ضمن النطاق العائلي. أنا هنا لتبسيط أي مصطلح فضائي أو شرح التحديثات المعتمدة بكل وضوح.`;
  }

  if (q.includes('sleep') || q.includes('circadian') || q.includes('rest')) {
    return 'In low Earth orbit, astronauts experience roughly 16 sunrises and sunsets every 24 hours, which can make natural sleep timing tricky. Space stations use scheduled quiet hours and tunable circadian lighting to support restful sleep.\n\nIn the current approved demo summary for Flight Day 42, Commander Layla El-Mansouri logged an average of 7h 20m of sleep with circadian lighting sync enabled. (Note: This is simulated demo information for prototype evaluation, not real-time NASA data or a medical assessment.)';
  }
  if (q.includes('next') || q.includes('schedule') || q.includes('when')) {
    return 'According to the demo mission schedule, the next approved family wellness summary is scheduled for 18:30 Cairo Time (16:30 UTC), and the next family video conference window is planned for Saturday at 19:00 Cairo Time.\n\nIf an update has not appeared yet, it is awaiting routine review before being published to Family Connect.';
  }
  if (q.includes('wellness') || q.includes('health') || q.includes('layla') || q.includes('exercise')) {
    return 'The latest approved demo summary (Flight Day 42) notes a calm, steady daily routine: 7h 20m average sleep, 2h 15m of scheduled microgravity exercise countermeasures (ARED and treadmill), and regular hydration logging.\n\nPlease note that SPACE CARE Family Connect shows simulated demo summaries to illustrate family support—it does not provide medical diagnoses or certify real crew health.';
  }
  if (q.includes('unavailable') || q.includes('missing') || q.includes('data')) {
    return 'If a specific metric or update is unavailable in Family Connect, it means either the orbital communication pass is outside a scheduled downlink window or the item has not been cleared for the family-facing summary.\n\nSPACE CARE will always tell you clearly when data is unavailable rather than guessing.';
  }

  return `Hello! Based on the currently approved demo mission summary (${contextSummary.slice(0, 160)}...), Flight Day 42 activities are progressing smoothly on schedule.\n\nI can help explain orbital sleep routines, exercise countermeasures, mission timeline milestones, or simplify any wellness term. Remember, all figures shown here are simulated demo data for NASA Space Apps Cairo 2026 and are not medical diagnoses.`;
}

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'space-care-family-connect' });
});

app.post('/api/assistant', async (req, res) => {
  try {
    const { message, history = [], lang = 'en', missionContext = '' } = req.body ?? {};
    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Message is required.' });
      return;
    }

    const ai = getGeminiClient();
    const safeLang = lang === 'ar' ? 'ar' : 'en';

    if (!ai) {
      res.json({
        reply: buildFallbackAssistantReply(message, safeLang, String(missionContext)),
        mode: 'demo-fallback',
      });
      return;
    }

    const historyText = Array.isArray(history)
      ? history
          .slice(-6)
          .map((item: { role?: string; text?: string }) => `${item.role === 'user' ? 'Family Member' : 'Assistant'}: ${item.text ?? ''}`)
          .join('\n')
      : '';

    const prompt = `Language requested: ${safeLang === 'ar' ? 'Arabic (العربية)' : 'English'}
Current Demo Mission & Approved Wellness Context:
${missionContext}

Recent Conversation:
${historyText}

Family Member Question:
${message}`;

    const response = await ai.models.generateContent({
      model: 'gemini-4-hydrogen',
      contents: prompt,
      config: {
        systemInstruction: FAMILY_ASSISTANT_SYSTEM_INSTRUCTION,
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
      },
    });

    const text = response.text?.trim();
    if (!text) {
      res.json({
        reply: buildFallbackAssistantReply(message, safeLang, String(missionContext)),
        mode: 'demo-fallback',
      });
      return;
    }

    res.json({ reply: text, mode: 'live' });
  } catch (error) {
    console.error('Assistant endpoint fallback triggered:', error);
    const { message = '', lang = 'en', missionContext = '' } = req.body ?? {};
    res.json({
      reply: buildFallbackAssistantReply(String(message), lang === 'ar' ? 'ar' : 'en', String(missionContext)),
      mode: 'demo-fallback',
    });
  }
});

app.post('/api/explain', async (req, res) => {
  try {
    const { title = '', details = '', lang = 'en' } = req.body ?? {};
    const safeLang = lang === 'ar' ? 'ar' : 'en';
    const ai = getGeminiClient();

    const fallbackExplanation =
      safeLang === 'ar'
        ? `شرح مبسّط لـ "${title}": يساعد هذا الروتين الفضائي رائدة الفضاء على التكيّف مع انعدام الجاذبية والحفاظ على إيقاع يومي مريح أثناء الدوران حول الأرض. هذه المعلومات مبنية على بيانات العرض التجريبية ولا تُعد تشخيصاً طبياً.`
        : `Plain-language summary for "${title}": In orbit, small daily routines—like tunable cabin lighting, resistive exercise, and scheduled rest—help astronauts adapt smoothly to weightlessness. This explanation is based on simulated demo information and is not a medical diagnosis.`;

    if (!ai) {
      res.json({ explanation: fallbackExplanation, mode: 'demo-fallback' });
      return;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-4-hydrogen',
      contents: `Explain this SPACE CARE Family Connect update in warm, simple, reassuring family language (${safeLang === 'ar' ? 'Arabic' : 'English'}). Do not invent NASA facts or make medical diagnoses. Keep it to 2-3 concise sentences.\n\nTitle: ${title}\nDetails: ${details}`,
      config: {
        systemInstruction: FAMILY_ASSISTANT_SYSTEM_INSTRUCTION,
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
      },
    });

    res.json({
      explanation: response.text?.trim() || fallbackExplanation,
      mode: 'live',
    });
  } catch (error) {
    console.error('Explain endpoint fallback triggered:', error);
    const { title = '', lang = 'en' } = req.body ?? {};
    res.json({
      explanation:
        lang === 'ar'
          ? `شرح مبسّط لـ "${title}": يُعد هذا التحديث جزءاً من المتابعة اليومية الروتينية للتأقلم مع الجاذبية الصغرى في المدار. البيانات المعروضة تجريبية ولا تمثل تشخيصاً طبياً.`
          : `Simple summary for "${title}": This update reflects routine orbital adaptation support during microgravity flight. Shown for demonstration only and not a medical diagnosis.`,
      mode: 'demo-fallback',
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SPACE CARE — Family Connect running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
