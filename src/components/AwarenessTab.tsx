import React, { useState } from 'react';
import { BookOpen, Award, CheckCircle, HelpCircle, ArrowRight, RotateCcw, AlertCircle } from 'lucide-react';
import { QUIZ_QUESTIONS } from '../data/defaultData';

export const AwarenessTab: React.FC = () => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [activeCategory, setActiveCategory] = useState<'ALL' | 'OWASP' | 'AUTHENTICATION' | 'LOGGING' | 'PORTS'>('ALL');

  const handleSelectOption = (questionId: number, optionIdx: number) => {
    if (quizSubmitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionIdx }));
  };

  const calculateScore = () => {
    let score = 0;
    QUIZ_QUESTIONS.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        score += 1;
      }
    });
    return score;
  };

  const handleResetQuiz = () => {
    setSelectedAnswers({});
    setQuizSubmitted(false);
  };

  const knowledgeArticles = [
    {
      category: 'OWASP',
      title: 'OWASP A03:2021 – Injection & Parameter Tampering',
      summary: 'Command injection occurs when untrusted user input is passed directly to a system shell without sanitization.',
      takeaways: [
        'Always validate input types using strict boundary regexes (e.g., IPv4 octet bounds 0-255).',
        'Reject metacharacters (; && | ` $) and parameterize all system calls.',
        'Never trust client-side validation alone; validate authoritatively on the backend.'
      ],
    },
    {
      category: 'AUTHENTICATION',
      title: 'OWASP A07:2021 – Identification & Authentication Failures',
      summary: 'Attackers deploy automated tools like Hydra and credential stuffing scripts to compromise weak accounts.',
      takeaways: [
        'Enforce progressive exponential backoff and account lockouts (e.g., 3 failed strikes = 30-second lockout).',
        'Mandate high-entropy passwords with multi-character class enforcement.',
        'Utilize cryptographically signed stateless tokens (JWT) with short lifespans.'
      ],
    },
    {
      category: 'PORTS',
      title: 'Network Port Hardening & Cleartext Protocol Elimination',
      summary: 'Legacy protocols transmit authentication credentials in cleartext, enabling packet sniffing via Wireshark.',
      takeaways: [
        'Permanently deprecate Port 23 (Telnet) in favor of Port 22 (SSH with key-based auth).',
        'Replace Port 21 (Plain FTP) with SFTP or FTPS.',
        'Enforce HTTP Strict Transport Security (HSTS) on Port 443 with TLS 1.3.'
      ],
    },
    {
      category: 'LOGGING',
      title: 'OWASP A09:2021 – Security Logging & Monitoring Failures',
      summary: 'Without centralized immutable logs, security teams cannot detect intrusions or conduct forensic analysis.',
      takeaways: [
        'Log all authentication anomalies, input sanitization drops, and port scan bursts.',
        'Standardize log records with timestamps, source/dest IPs, protocols, and severities.',
        'Ensure log exports (CSV/JSON) are generated for regulatory compliance and audit trails.'
      ],
    },
  ];

  const filteredArticles = activeCategory === 'ALL'
    ? knowledgeArticles
    : knowledgeArticles.filter((a) => a.category === activeCategory);

  const score = calculateScore();
  const allAnswered = Object.keys(selectedAnswers).length === QUIZ_QUESTIONS.length;

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Banner */}
      <div className="border border-slate-800 bg-slate-900/60 rounded-xl p-6">
        <div className="text-xs font-mono text-emerald-400 uppercase tracking-wider mb-1">
          Requirement 5 · Practical Cyber Security Concept
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Cybersecurity Threat Awareness & Knowledge Hub
        </h1>
        <p className="text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
          Educating engineers and analysts on the OWASP Top 10 vulnerabilities, defense-in-depth principles, and practical network hardening methodologies.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Knowledge Base Articles (Left 2 cols) */}
        <div className="lg:col-span-2 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-400" />
              <h2 className="text-base font-semibold text-white">Security Fundamentals & Best Practices</h2>
            </div>

            <div className="flex items-center gap-1 text-xs">
              {(['ALL', 'OWASP', 'AUTHENTICATION', 'PORTS', 'LOGGING'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-2.5 py-1 rounded text-[11px] font-mono transition-colors ${
                    activeCategory === cat
                      ? 'bg-emerald-500 text-slate-950 font-bold'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {filteredArticles.map((article, idx) => (
              <div
                key={idx}
                className="p-5 rounded-xl border border-slate-800 bg-slate-900/40 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white">{article.title}</h3>
                  <span className="text-[10px] font-mono text-emerald-400 font-semibold px-2 py-0.5 bg-emerald-950/60 rounded border border-emerald-900">
                    {article.category}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  {article.summary}
                </p>

                <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Core Security Defensive Takeaways:
                  </span>
                  {article.takeaways.map((point, pIdx) => (
                    <div key={pIdx} className="flex items-start gap-2 text-xs text-slate-300">
                      <span className="text-emerald-400 font-bold mt-0.5">✓</span>
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Readiness Quiz (Right Column) */}
        <div className="border border-slate-800 bg-slate-900/40 rounded-xl p-5 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-400" />
              <h2 className="text-sm font-semibold text-white">Internship Readiness Quiz</h2>
            </div>
            {quizSubmitted && (
              <button
                onClick={handleResetQuiz}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 font-mono"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Retake
              </button>
            )}
          </div>

          <p className="text-xs text-slate-300">
            Verify your comprehension of the 5 project pillars. Complete all 5 questions for verification:
          </p>

          {/* Quiz Cards */}
          <div className="space-y-4 max-h-[560px] overflow-y-auto pr-1">
            {QUIZ_QUESTIONS.map((q, qIndex) => {
              const isAnswered = selectedAnswers[q.id] !== undefined;
              const isCorrect = selectedAnswers[q.id] === q.correctIndex;

              return (
                <div
                  key={q.id}
                  className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-2.5 text-xs"
                >
                  <div className="flex items-start gap-2">
                    <span className="font-mono text-emerald-400 font-bold">Q{q.id}.</span>
                    <span className="text-slate-200 font-medium leading-snug">{q.question}</span>
                  </div>

                  <div className="space-y-1.5 pt-1">
                    {q.options.map((opt, optIdx) => {
                      const isSelected = selectedAnswers[q.id] === optIdx;
                      let btnStyle = 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800/80';

                      if (quizSubmitted) {
                        if (optIdx === q.correctIndex) {
                          btnStyle = 'bg-emerald-950/80 border-emerald-600 text-emerald-200 font-medium';
                        } else if (isSelected && !isCorrect) {
                          btnStyle = 'bg-red-950/80 border-red-700 text-red-200';
                        } else {
                          btnStyle = 'bg-slate-900/40 border-slate-800/40 text-slate-500 opacity-60';
                        }
                      } else if (isSelected) {
                        btnStyle = 'bg-slate-800 border-emerald-500 text-white font-medium';
                      }

                      return (
                        <button
                          key={optIdx}
                          onClick={() => handleSelectOption(q.id, optIdx)}
                          disabled={quizSubmitted}
                          className={`w-full text-left p-2 rounded border text-xs transition-colors flex items-start gap-2 ${btnStyle}`}
                        >
                          <span className="font-mono text-[11px] text-slate-400 shrink-0 mt-0.5">
                            {String.fromCharCode(65 + optIdx)}.
                          </span>
                          <span className="leading-tight">{opt}</span>
                        </button>
                      );
                    })}
                  </div>

                  {quizSubmitted && (
                    <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 leading-relaxed font-sans">
                      <strong className={isCorrect ? 'text-emerald-400' : 'text-amber-400'}>
                        {isCorrect ? 'Correct!' : 'Review Concept:'}
                      </strong>{' '}
                      {q.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Submission and score summary */}
          <div className="pt-2 border-t border-slate-800">
            {!quizSubmitted ? (
              <button
                onClick={() => setQuizSubmitted(true)}
                disabled={!allAnswered}
                className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold rounded-lg text-xs transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Submit Answers ({Object.keys(selectedAnswers).length}/5 Completed)
              </button>
            ) : (
              <div className="p-3.5 rounded-lg bg-emerald-950/40 border border-emerald-900/80 text-center space-y-1">
                <div className="text-xs text-slate-300">Readiness Score:</div>
                <div className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">
                  {score} / 5 ({Math.round((score / 5) * 100)}%)
                </div>
                <div className="text-xs text-emerald-300 font-medium">
                  {score >= 4 ? 'Verified Ready for Internship Submission!' : 'Good effort! Review the explanations and retake.'}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
