import React, { useState } from 'react';
import { Terminal, CheckCircle, ShieldAlert, ArrowRight, CornerDownRight } from 'lucide-react';
import { VALIDATION_PRESETS } from '../data/defaultData';
import { validateNetworkInput } from '../utils/securityEngine';

interface InputValidationTabProps {
  onAddLog: (entry: {
    eventType: string;
    severity: 'INFO' | 'WARNING' | 'HIGH' | 'CRITICAL';
    sourceIp: string;
    description: string;
    actionTaken: 'BLOCKED' | 'FLAGGED' | 'ALLOWED';
    protocol: 'TCP' | 'UDP' | 'ICMP' | 'HTTPS';
  }) => void;
}

export const InputValidationTab: React.FC<InputValidationTabProps> = ({ onAddLog }) => {
  const [selectedType, setSelectedType] = useState<'IP_ADDRESS' | 'PORT' | 'COMMAND' | 'DOMAIN'>('COMMAND');
  const [inputVal, setInputVal] = useState('127.0.0.1; cat /etc/passwd');
  const [loggedNotification, setLoggedNotification] = useState<string | null>(null);

  const validationResult = validateNetworkInput(inputVal, selectedType);

  const handleSelectPreset = (preset: (typeof VALIDATION_PRESETS)[0]) => {
    setSelectedType(preset.type);
    setInputVal(preset.input);
    setLoggedNotification(null);
  };

  const handleDispatchToSiem = () => {
    if (validationResult.threatsDetected.length > 0) {
      onAddLog({
        eventType: 'COMMAND_INJECTION_BLOCKED',
        severity: 'CRITICAL',
        sourceIp: '192.168.1.45',
        description: `Blocked malicious input pattern: ${validationResult.threatsDetected.join(', ')}`,
        actionTaken: 'BLOCKED',
        protocol: 'TCP',
      });
      setLoggedNotification('Interception logged into SIEM Event Console!');
    } else if (!validationResult.isValid) {
      onAddLog({
        eventType: 'INVALID_INPUT_REJECTED',
        severity: 'WARNING',
        sourceIp: '192.168.1.45',
        description: `Rejected malformed input: "${inputVal}" (${validationResult.explanation})`,
        actionTaken: 'BLOCKED',
        protocol: 'TCP',
      });
      setLoggedNotification('Input syntax violation logged into SIEM!');
    } else {
      onAddLog({
        eventType: 'INPUT_VALIDATION_PASSED',
        severity: 'INFO',
        sourceIp: '192.168.1.45',
        description: `Sanitized parameter "${validationResult.sanitizedOutput}" approved for execution.`,
        actionTaken: 'ALLOWED',
        protocol: 'TCP',
      });
      setLoggedNotification('Safe execution logged into SIEM!');
    }

    setTimeout(() => {
      setLoggedNotification(null);
    }, 3500);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Banner */}
      <div className="border border-slate-800 bg-slate-900/60 rounded-xl p-6">
        <div className="text-xs font-mono text-emerald-400 uppercase tracking-wider mb-1">
          Requirement 2 · Practical Cyber Security Concept
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Input Validation & Injection Prevention Workbench
        </h1>
        <p className="text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
          Unsanitized network parameters lead to catastrophic Remote Code Execution (RCE), Command Injection (OWASP A03:2021), and socket buffer overflow. Test real malicious attack payloads against our multi-stage sanitization pipeline.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Preset Attack Payloads */}
        <div className="border border-slate-800 bg-slate-900/40 rounded-xl p-5 space-y-4">
          <div>
            <h2 className="text-sm font-semibold text-white">Preset Test Vectors</h2>
            <p className="text-xs text-slate-400">Click any preset to load attack or baseline payloads</p>
          </div>

          <div className="space-y-2">
            {VALIDATION_PRESETS.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectPreset(preset)}
                className="w-full text-left p-2.5 rounded-lg bg-slate-950/70 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 transition-all text-xs group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-slate-200 group-hover:text-emerald-400 transition-colors">
                    {preset.label}
                  </span>
                  <span
                    className={`font-mono text-[10px] ${
                      preset.category === 'Exploit'
                        ? 'text-red-400'
                        : preset.category === 'Boundary' || preset.category === 'Invalid'
                        ? 'text-amber-400'
                        : 'text-emerald-400'
                    }`}
                  >
                    {preset.category}
                  </span>
                </div>
                <div className="font-mono text-slate-500 text-[11px] truncate mt-1">
                  {preset.input}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Center & Right: Interactive Validation Console */}
        <div className="lg:col-span-2 space-y-6">
          <div className="border border-slate-800 bg-slate-900/40 rounded-xl p-6 space-y-5">
            {/* Input Type Selector */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <label className="text-xs font-semibold text-white">Target Parameter Type:</label>
              <div className="flex items-center gap-1 p-1 bg-slate-950 border border-slate-800 rounded-lg">
                {(['COMMAND', 'IP_ADDRESS', 'PORT', 'DOMAIN'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`px-3 py-1 text-xs font-mono rounded-md transition-colors ${
                      selectedType === type
                        ? 'bg-emerald-500 text-slate-950 font-bold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs text-slate-300">Raw Input String (Command / Parameter):</label>
                <span className="text-[11px] font-mono text-slate-500">Live Sanitizer Active</span>
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={inputVal}
                  onChange={(e) => {
                    setInputVal(e.target.value);
                    setLoggedNotification(null);
                  }}
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
                  placeholder="Type an IP address, command, or injection payload..."
                />
                <Terminal className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              </div>
            </div>

            {/* Verification Result Banner */}
            <div
              className={`p-4 rounded-xl border transition-all ${
                validationResult.isValid
                  ? 'bg-emerald-950/30 border-emerald-800/80'
                  : validationResult.category === 'INJECTION_ATTEMPT'
                  ? 'bg-red-950/40 border-red-800/80'
                  : 'bg-amber-950/30 border-amber-800/80'
              }`}
            >
              <div className="flex items-start gap-3">
                {validationResult.isValid ? (
                  <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                )}
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-mono font-bold uppercase tracking-wide ${
                        validationResult.isValid
                          ? 'text-emerald-400'
                          : validationResult.category === 'INJECTION_ATTEMPT'
                          ? 'text-red-400'
                          : 'text-amber-400'
                      }`}
                    >
                      {validationResult.isValid ? 'INPUT VALIDATION PASSED' : 'SECURITY CHECK VIOLATION'}
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      Category: {validationResult.category}
                    </span>
                  </div>

                  <p className="text-xs text-slate-200 leading-relaxed">
                    {validationResult.explanation}
                  </p>

                  {validationResult.threatsDetected.length > 0 && (
                    <div className="pt-2">
                      <div className="text-[11px] font-semibold text-red-300 mb-1">
                        Detected Vulnerability Signatures:
                      </div>
                      <div className="space-y-1">
                        {validationResult.threatsDetected.map((threat, idx) => (
                          <div
                            key={idx}
                            className="text-xs font-mono text-red-300 bg-red-950/60 px-2 py-1 rounded border border-red-900/60"
                          >
                            &#9888; {threat}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sanitization Pipeline Flow */}
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
              <h3 className="text-xs font-semibold text-slate-300">Sanitization Pipeline Flow</h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
                <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                  <div className="text-[10px] text-slate-500 uppercase mb-1">1. User Raw Input</div>
                  <div className="text-slate-300 break-all">{inputVal || '(empty)'}</div>
                </div>

                <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                  <div className="text-[10px] text-slate-500 uppercase mb-1">2. Boundary Regex Filter</div>
                  <div className="text-slate-300 break-all">
                    {selectedType === 'IP_ADDRESS'
                      ? 'RFC 1918 IPv4 Boundary'
                      : selectedType === 'PORT'
                      ? '1 <= Socket <= 65535'
                      : 'Metacharacter Blacklist'}
                  </div>
                </div>

                <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                  <div className="text-[10px] text-slate-500 uppercase mb-1">3. Safe Sanitized Value</div>
                  <div className="text-emerald-400 break-all font-semibold">
                    {validationResult.sanitizedOutput || 'None (Blocked)'}
                  </div>
                </div>
              </div>
            </div>

            {/* Dispatch to SIEM action */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <button
                onClick={handleDispatchToSiem}
                className="w-full sm:w-auto px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <span>Record Security Action to SIEM</span>
                <CornerDownRight className="w-3.5 h-3.5 text-emerald-400" />
              </button>

              {loggedNotification && (
                <span className="text-xs font-mono text-emerald-400 animate-fade-in flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" />
                  {loggedNotification}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
