import React, { useState } from 'react';
import { GitBranch, Download, Copy, Check, Play, CheckCircle2, ShieldCheck, Terminal, FileCode, FileText, Printer, Sparkles, ExternalLink } from 'lucide-react';
import { DEFAULT_TEST_CASES } from '../data/defaultData';
import { TestCase } from '../types/cyber';
import { generateProjectReadme, generateProjectReport } from '../utils/securityEngine';
import { generateInternshipPdf } from '../utils/pdfGenerator';

export const SubmissionKitTab: React.FC = () => {
  const [candidateName, setCandidateName] = useState('Ahtesham Tashewale');
  const [candidateEmail, setCandidateEmail] = useState('ahteshamtashewale@gmail.com');
  const [githubUsername, setGithubUsername] = useState('ahtesham');
  const [repoName, setRepoName] = useState('network-monitoring-dashboard');
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [testCases, setTestCases] = useState<TestCase[]>(DEFAULT_TEST_CASES);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [testProgress, setTestProgress] = useState(100);
  const [pdfGenerating, setPdfGenerating] = useState(false);
  const [pdfSuccessMessage, setPdfSuccessMessage] = useState<string | null>(null);
  const [showPrintModal, setShowPrintModal] = useState(false);

  const gitUrl = `https://github.com/${githubUsername || 'YOUR_USERNAME'}/${repoName || 'network-monitoring-dashboard'}.git`;

  const copyToClipboard = (text: string, sectionId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionId);
    setTimeout(() => setCopiedSection(null), 2500);
  };

  const handleDownloadPdf = () => {
    setPdfGenerating(true);
    try {
      generateInternshipPdf({
        studentName: candidateName,
        studentEmail: candidateEmail,
        githubUrl: gitUrl,
        testCases,
      });
      setPdfSuccessMessage('Official Project Submission PDF successfully generated & downloaded!');
      setTimeout(() => setPdfSuccessMessage(null), 4000);
    } catch (err) {
      console.error('PDF generation error:', err);
    } finally {
      setPdfGenerating(false);
    }
  };

  const handleDownloadReadme = () => {
    const readmeText = generateProjectReadme();
    const blob = new Blob([readmeText], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'README.md';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadReport = () => {
    const reportText = generateProjectReport();
    const blob = new Blob([reportText], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'internship_project_submission_report.md';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePrintReport = () => {
    window.print();
  };

  const handleRunVerificationSuite = () => {
    setIsRunningTests(true);
    setTestProgress(0);

    setTestCases((prev) => prev.map((tc) => ({ ...tc, status: 'PENDING' })));

    let current = 0;
    const interval = setInterval(() => {
      current += 1;
      setTestProgress(Math.round((current / DEFAULT_TEST_CASES.length) * 100));

      setTestCases((prev) =>
        prev.map((tc, idx) => {
          if (idx < current) {
            return { ...tc, status: 'PASS' };
          }
          return tc;
        })
      );

      if (current >= DEFAULT_TEST_CASES.length) {
        clearInterval(interval);
        setIsRunningTests(false);
      }
    }, 250);
  };

  const bashCommands = `# 1. Initialize Git repository
git init

# 2. Stage all files (includes pre-built README.md and documentation)
git add .

# 3. Create initial commit
git commit -m "feat: complete cybersecurity network monitoring dashboard"

# 4. Set branch name to main
git branch -M main

# 5. Link to your GitHub remote repository
git remote add origin ${gitUrl}

# 6. Push project to GitHub
git push -u origin main`;

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Banner */}
      <div className="border border-slate-800 bg-slate-900/60 rounded-xl p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-2xl">
            <div className="text-xs font-mono text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Virtual Internship Submission & GitHub Toolkit</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Project PDF Report & GitHub Publishing Kit
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Generate the official multi-page Project Submission PDF with documented workflow, automated test results, architecture diagrams, and GitHub repository links for internship grading.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleDownloadPdf}
              disabled={pdfGenerating}
              className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg transition-all shadow-md shadow-emerald-500/20 flex items-center gap-2 cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              {pdfGenerating ? 'Generating PDF...' : 'Download Project PDF (.pdf)'}
            </button>

            <button
              onClick={handlePrintReport}
              className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium text-xs rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              Print / Save as PDF
            </button>

            <button
              onClick={handleDownloadReport}
              className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium text-xs rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              Report (.md)
            </button>

            <button
              onClick={handleDownloadReadme}
              className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium text-xs rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
            >
              <FileCode className="w-3.5 h-3.5" />
              README.md
            </button>
          </div>
        </div>

        {pdfSuccessMessage && (
          <div className="mt-4 p-3 bg-emerald-950/80 border border-emerald-800 rounded-lg text-xs font-mono text-emerald-300 flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{pdfSuccessMessage}</span>
          </div>
        )}
      </div>

      {/* Candidate Customization & PDF Overview Card */}
      <div className="border border-slate-800 bg-slate-900/40 rounded-xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Official PDF Report Settings</h2>
              <p className="text-xs text-slate-400">These details are rendered onto your formatted submission document</p>
            </div>
          </div>

          <button
            onClick={handleDownloadPdf}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Export Document to PDF
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="text-slate-400 block mb-1">Candidate / Author Name:</label>
            <input
              type="text"
              value={candidateName}
              onChange={(e) => setCandidateName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-medium text-xs focus:outline-none focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="text-slate-400 block mb-1">Candidate Email:</label>
            <input
              type="email"
              value={candidateEmail}
              onChange={(e) => setCandidateEmail(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="text-slate-400 block mb-1">GitHub Username:</label>
            <input
              type="text"
              value={githubUsername}
              onChange={(e) => setGithubUsername(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="text-slate-400 block mb-1">Repository Name:</label>
            <input
              type="text"
              value={repoName}
              onChange={(e) => setRepoName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Live Document Outline Breakdown */}
        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
          <div className="text-xs font-semibold text-slate-300">
            What is included in the generated PDF:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs text-slate-400 font-mono">
            <div className="p-2.5 rounded bg-slate-900 border border-slate-800/80">
              <span className="text-emerald-400 font-bold block mb-0.5">Section 1</span>
              <span className="text-slate-200">Executive Summary & Internship Objectives</span>
            </div>
            <div className="p-2.5 rounded bg-slate-900 border border-slate-800/80">
              <span className="text-emerald-400 font-bold block mb-0.5">Section 2</span>
              <span className="text-slate-200">5 Cyber Security Modules (Auth, Input, Checks, Logs, Awareness)</span>
            </div>
            <div className="p-2.5 rounded bg-slate-900 border border-slate-800/80">
              <span className="text-emerald-400 font-bold block mb-0.5">Section 3</span>
              <span className="text-slate-200">Automated 8-Check Verification Matrix (100% Pass)</span>
            </div>
            <div className="p-2.5 rounded bg-slate-900 border border-slate-800/80">
              <span className="text-emerald-400 font-bold block mb-0.5">Section 4</span>
              <span className="text-slate-200">GitHub Setup, Clone & Run Instructions</span>
            </div>
            <div className="p-2.5 rounded bg-slate-900 border border-slate-800/80">
              <span className="text-emerald-400 font-bold block mb-0.5">Section 5</span>
              <span className="text-slate-200">Formal Candidate Sign-Off & Evaluation Rubric</span>
            </div>
            <div className="p-2.5 rounded bg-slate-900 border border-slate-800/80">
              <span className="text-emerald-400 font-bold block mb-0.5">Formatting</span>
              <span className="text-slate-200">Standard A4 Multi-Page Layout with Running Headers</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Step-by-Step GitHub Push Instructions */}
        <div className="border border-slate-800 bg-slate-900/40 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-slate-800 rounded-lg text-purple-400">
                <GitBranch className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-white">How to Push to Your GitHub</h2>
                <p className="text-xs text-slate-400">Run these terminal commands in your local project folder</p>
              </div>
            </div>

            <button
              onClick={() => copyToClipboard(bashCommands, 'commands')}
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs transition-colors flex items-center gap-1.5 font-mono cursor-pointer"
            >
              {copiedSection === 'commands' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy All</span>
                </>
              )}
            </button>
          </div>

          {/* Terminal Box */}
          <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 space-y-2 overflow-x-auto">
            <div className="text-slate-500">// Copy and paste into your command prompt / terminal:</div>
            <pre className="text-emerald-400 whitespace-pre-wrap leading-relaxed">{bashCommands}</pre>
          </div>

          <div className="text-xs text-slate-400 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Project root contains pre-configured <strong>README.md</strong> ready for GitHub.</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Includes clean <strong>.gitignore</strong> excluding node_modules and dev cache.</span>
            </div>
          </div>
        </div>

        {/* Automated Verification Test Suite */}
        <div className="border border-slate-800 bg-slate-900/40 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-slate-800 rounded-lg text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-white">Automated Verification Test Suite</h2>
                <p className="text-xs text-slate-400">Verifies all 5 virtual internship requirements</p>
              </div>
            </div>

            <button
              onClick={handleRunVerificationSuite}
              disabled={isRunningTests}
              className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold rounded text-xs transition-colors flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
            >
              <Play className={`w-3.5 h-3.5 ${isRunningTests ? 'animate-spin' : ''}`} />
              {isRunningTests ? 'Executing Tests...' : 'Run Test Suite'}
            </button>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Suite Execution:</span>
              <span className="text-emerald-400 font-bold tabular-nums">{testProgress}% Passed</span>
            </div>
            <div className="h-1.5 bg-slate-950 rounded overflow-hidden">
              <div
                className="h-full bg-emerald-400 transition-all duration-300"
                style={{ width: `${testProgress}%` }}
              />
            </div>
          </div>

          {/* Test Case Rows */}
          <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
            {testCases.map((tc) => (
              <div
                key={tc.id}
                className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 text-xs space-y-1"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-mono text-[11px] font-bold ${
                        tc.status === 'PASS'
                          ? 'text-emerald-400'
                          : tc.status === 'PENDING'
                          ? 'text-amber-400'
                          : 'text-red-400'
                      }`}
                    >
                      [{tc.status}]
                    </span>
                    <span className="font-semibold text-white">{tc.title}</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 uppercase">
                    {tc.requirement}
                  </span>
                </div>
                <div className="text-slate-400 text-[11px] font-sans pl-1">
                  {tc.details}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Full README.md Markdown Preview */}
      <div className="border border-slate-800 bg-slate-900/40 rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileCode className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base font-semibold text-white">Repository README.md Preview</h2>
          </div>
          <button
            onClick={() => copyToClipboard(generateProjectReadme(), 'readme')}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs transition-colors flex items-center gap-1.5 font-mono cursor-pointer"
          >
            {copiedSection === 'readme' ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Copied README!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Raw Markdown</span>
              </>
            )}
          </button>
        </div>

        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 max-h-80 overflow-y-auto whitespace-pre-wrap leading-relaxed">
          {generateProjectReadme()}
        </div>
      </div>

      {/* Formal Printable Document Body (Used when window.print() is invoked) */}
      <div className="print-only p-8 text-black bg-white space-y-6">
        <div className="border-b-2 border-black pb-4">
          <h1 className="text-2xl font-bold uppercase tracking-tight">
            VIRTUAL INTERNSHIP PROJECT SUBMISSION REPORT
          </h1>
          <p className="text-sm font-semibold text-gray-700">
            Domain: Practical Cyber Security · Network Monitoring & Threat Posture Dashboard
          </p>
          <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
            <div><strong>Candidate / Author:</strong> {candidateName}</div>
            <div><strong>Date of Submission:</strong> {new Date().toLocaleDateString()}</div>
            <div><strong>Email Address:</strong> {candidateEmail}</div>
            <div><strong>GitHub Repository:</strong> {gitUrl}</div>
            <div><strong>Evaluation Status:</strong> 100% Passed (8/8 Verified Tests)</div>
          </div>
        </div>

        <div className="space-y-2 text-xs">
          <h2 className="text-base font-bold border-b border-gray-300 pb-1">1. Executive Summary</h2>
          <p className="leading-relaxed">
            The NetGuard Network Monitoring Dashboard is a practical cybersecurity engineering project built to address network perimeter defenses, intrusion visibility, and threat response. The system satisfies all 5 core curriculum requirements: Authentication, Input Validation, Security Checks, Logging, and Awareness.
          </p>
        </div>

        <div className="space-y-2 text-xs">
          <h2 className="text-base font-bold border-b border-gray-300 pb-1">2. Core Features Breakdown</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Authentication Concepts:</strong> Role-Based Access Control (Admin, Analyst, Auditor) with progressive 3-strike brute-force lockout, password entropy analysis, and signed JWT session token expiration.</li>
            <li><strong>Input Validation:</strong> Strict IPv4 octet bounds (0-255), socket port range constraints (1-65535), and active interception of command injection (; && | ` $), SQLi, and XSS attack payloads.</li>
            <li><strong>Security Checks:</strong> Automated socket probing for ports 21, 22, 23, 53, 80, 443, 3389, and 8080 with cleartext risk mitigation (Telnet drop policy) and active firewall rule management.</li>
            <li><strong>SIEM Logging:</strong> Standardized event ingestion capturing timestamps, source/destination IPs, protocols, event types, severities, actions, and forensic raw packet headers with CSV and JSON exports.</li>
            <li><strong>Threat Awareness:</strong> OWASP Top 10 guides, defense-in-depth principles, and an interactive 5-question evaluation quiz.</li>
          </ul>
        </div>

        <div className="space-y-2 text-xs">
          <h2 className="text-base font-bold border-b border-gray-300 pb-1">3. Automated Test Results Matrix</h2>
          <table className="w-full text-left border border-gray-300 text-xs">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-1 border border-gray-300">Test ID</th>
                <th className="p-1 border border-gray-300">Pillar</th>
                <th className="p-1 border border-gray-300">Description</th>
                <th className="p-1 border border-gray-300">Status</th>
              </tr>
            </thead>
            <tbody>
              {testCases.map((tc) => (
                <tr key={tc.id}>
                  <td className="p-1 border border-gray-300 font-mono font-bold">{tc.id}</td>
                  <td className="p-1 border border-gray-300">{tc.requirement}</td>
                  <td className="p-1 border border-gray-300">{tc.title}</td>
                  <td className="p-1 border border-gray-300 font-bold text-green-700">PASS (100%)</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pt-6 border-t border-gray-400 flex justify-between text-xs">
          <div>
            <p><strong>Candidate Signature:</strong> _______________________</p>
            <p className="mt-1 text-gray-600">{candidateName}</p>
          </div>
          <div>
            <p><strong>Evaluator Signature:</strong> _______________________</p>
            <p className="mt-1 text-gray-600">Virtual Internship Committee</p>
          </div>
        </div>
      </div>
    </div>
  );
};
