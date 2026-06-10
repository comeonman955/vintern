const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Anthropic = require('@anthropic-ai/sdk');

const getClient = () => new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

async function askClaude(prompt) {
  const client = getClient();
  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1500,
    messages: [{ role: 'user', content: prompt }],
  });
  return message.content[0].text;
}

// POST /api/ai/resume
router.post('/resume', protect, async (req, res) => {
  try {
    const u = req.user;
    const prompt = `You are a professional resume writer. Create a clean, professional resume in English.

Name: ${u.name}
Bio: ${u.bio || 'Not provided'}
Education: ${u.education || 'Not provided'}
Skills: ${u.skills?.join(', ') || 'Not provided'}
Portfolio: ${u.portfolioLink || 'Not provided'}

Create a resume with these sections:
1. PROFESSIONAL SUMMARY (3-4 sentences based on their bio and skills)
2. SKILLS (organized by category)
3. EDUCATION
4. PROJECTS / PORTFOLIO (if portfolio link provided)
5. KEY STRENGTHS (3 bullet points)

Make it impressive for an internship-level candidate. Be concise and impactful.`;

    const resume = await askClaude(prompt);
    res.json({ resume });
  } catch (err) {
    console.error('AI resume error:', err.message);
    res.status(500).json({ message: 'Failed to generate resume: ' + err.message });
  }
});

// POST /api/ai/cover-letter
router.post('/cover-letter', protect, async (req, res) => {
  try {
    const { jobTitle, jobDescription, company } = req.body;
    if (!jobTitle) return res.status(400).json({ message: 'jobTitle is required' });
    const u = req.user;

    const prompt = `You are an expert career coach. Write a compelling, personalized cover letter in English. Keep it to 3 paragraphs. Be specific, enthusiastic, and professional.

Candidate: ${u.name}
Skills: ${u.skills?.join(', ') || 'various technical skills'}
Education: ${u.education || 'University student'}
Bio: ${u.bio || ''}

Job: ${jobTitle} at ${company || 'the company'}
Description: ${jobDescription || 'internship position'}

Start with "Dear Hiring Manager," and end with "Sincerely, ${u.name}". Do NOT use any placeholder brackets like [Your Name].`;

    const coverLetter = await askClaude(prompt);
    res.json({ coverLetter });
  } catch (err) {
    console.error('AI cover letter error:', err.message);
    res.status(500).json({ message: 'Failed to generate cover letter: ' + err.message });
  }
});

// POST /api/ai/career-advice
router.post('/career-advice', protect, async (req, res) => {
  try {
    const u = req.user;
    const { question } = req.body;

    const prompt = `You are a friendly and knowledgeable career advisor for students and young professionals. Answer in English. Be specific, practical and encouraging. Use bullet points where helpful.

Student Profile:
- Name: ${u.name}
- Skills: ${u.skills?.join(', ') || 'none listed yet'}
- Education: ${u.education || 'not specified'}
- Bio: ${u.bio || 'not specified'}

Their question: "${question || 'What skills should I develop to improve my career prospects?'}"

Give practical advice with: direct answer, 3-5 actionable steps, skills to learn based on their profile, encouragement. Keep under 300 words.`;

    const advice = await askClaude(prompt);
    res.json({ advice });
  } catch (err) {
    console.error('AI advice error:', err.message);
    res.status(500).json({ message: 'Failed to get advice: ' + err.message });
  }
});

// POST /api/ai/auto-apply
router.post('/auto-apply', protect, async (req, res) => {
  try {
    const Job = require('../models/Job');
    const Application = require('../models/Application');
    const u = req.user;

    if (!u.skills?.length) {
      return res.status(400).json({ message: 'Please add skills to your profile first' });
    }

    const jobs = await Job.find({ isActive: true }).populate('employer', 'name company');
    const applied = await Application.find({ candidate: u._id });
    const appliedIds = applied.map(a => a.job.toString());
    const notApplied = jobs.filter(j => !appliedIds.includes(j._id.toString()));

    if (!notApplied.length) {
      return res.json({ matches: [], message: 'You have applied to all available jobs!' });
    }

    const jobsList = notApplied.slice(0, 20).map((j, i) =>
      `${i + 1}. ID:${j._id} | Title: ${j.title} | Company: ${j.company} | Skills needed: ${j.skills?.join(', ')}`
    ).join('\n');

    const prompt = `You are a job matching AI. Find the top 3 jobs that best match this candidate.

Candidate Skills: ${u.skills.join(', ')}
Education: ${u.education || 'university'}

Available Jobs:
${jobsList}

Return ONLY a valid JSON array with no extra text, no markdown, no explanation:
[{"id":"job_id_here","match":90,"reason":"specific reason"},{"id":"job_id_here","match":80,"reason":"specific reason"},{"id":"job_id_here","match":70,"reason":"specific reason"}]`;

    const aiResponse = await askClaude(prompt);

    let matches = [];
    try {
      const jsonMatch = aiResponse.match(/\[[\s\S]*?\]/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        matches = parsed.map(item => {
          const job = notApplied.find(j => j._id.toString() === item.id);
          return job ? { job, match: item.match, reason: item.reason } : null;
        }).filter(Boolean);
      }
    } catch {}

    if (!matches.length) {
      matches = notApplied.slice(0, 3).map(job => ({
        job, match: 75, reason: 'Good potential match based on your profile'
      }));
    }

    res.json({ matches });
  } catch (err) {
    console.error('AI auto-apply error:', err.message);
    res.status(500).json({ message: 'Failed to find matches: ' + err.message });
  }
});

module.exports = router;
