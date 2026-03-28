import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Activity, 
  AlertTriangle, 
  Users, 
  CheckCircle, 
  ShieldAlert, 
  UserPlus, 
  Radio, 
  Satellite, 
  Navigation, 
  Terminal,
  BarChart3,
  Bell,
  Send,
  Zap,
  Loader2
} from 'lucide-react';
import { analyzeSARData } from '../services/geminiService';
import { SARData, Alert } from '../types';
import { cn } from '../lib/utils';

const METRICS = [
  { label: 'Active Alerts', value: '5', sub: '2 new', color: 'text-alert-red', icon: AlertTriangle },
  { label: 'Disasters This Month', value: '12', sub: 'vs 10 last month', color: 'text-warning-orange', icon: Activity },
  { label: 'People Saved', value: '14,252', color: 'text-radar-green', icon: CheckCircle },
  { label: 'Success Rate', value: '85%', color: 'text-satellite-blue', icon: Zap },
  { label: 'Deaths Prevented', value: '1,240', color: 'text-purple-500', icon: ShieldAlert },
  { label: 'Affected Population', value: '32,100', color: 'text-yellow-400', icon: Users },
];

const INITIAL_ALERTS: Alert[] = [
  { id: '1', type: 'earthquake', location: 'Tiruvannamalai', time: '2 mins ago', severity: 'HIGH', peopleAffected: 1200, status: 'ACTIVE' },
  { id: '2', type: 'flood', location: 'Chennai', time: '15 mins ago', severity: 'MEDIUM', peopleAffected: 5400, status: 'ACTIVE' },
  { id: '3', type: 'landslide', location: 'Nilgiris', time: '1 hour ago', severity: 'HIGH', peopleAffected: 300, status: 'ACTIVE' },
  { id: '4', type: 'flood', location: 'Madurai', time: '3 hours ago', severity: 'LOW', peopleAffected: 800, status: 'RESOLVED' },
  { id: '5', type: 'tsunami', location: 'Nagapattinam', time: '5 hours ago', severity: 'MEDIUM', peopleAffected: 2500, status: 'RESOLVED' },
];

const TELEMETRY_LOGS = [
  "SYSTEM: Initializing telemetry handshake...",
  "NRSC: Authentication successful",
  "SAR: Radar frequency 5.4 GHz C-band active",
  "SATELLITE: RISAT-1A orbit confirmed 529.4km",
  "AI: SAR analysis engine ready",
  "ALERT: Monitoring Tamil Nadu region",
];

export default function Dashboard() {
  const [logs, setLogs] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<SARData | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>(INITIAL_ALERTS);
  const [toast, setToast] = useState<string | null>(null);
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setLogs(prev => [...prev, TELEMETRY_LOGS[index % TELEMETRY_LOGS.length]]);
      index++;
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      const result = await analyzeSARData();
      setAnalysisResult(result);
      if (result.disaster_type !== 'normal') {
        const newAlert: Alert = {
          id: Date.now().toString(),
          type: result.disaster_type,
          location: result.region,
          time: 'Just now',
          severity: result.risk.toUpperCase() as any,
          peopleAffected: result.people_affected,
          status: 'ACTIVE'
        };
        setAlerts(prev => [newAlert, ...prev.slice(0, 4)]);
      }
    } catch (error) {
      console.error(error);
      setToast("Analysis failed. Check API key.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const sendAlert = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="p-4 lg:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="space-y-2 border-l-4 border-satellite-blue pl-4">
        <h1 className="text-3xl lg:text-5xl font-bold tracking-tighter uppercase terminal-text">
          D-SQUARE | Disaster Detection System
        </h1>
        <p className="text-satellite-blue font-medium tracking-widest uppercase text-sm lg:text-base">
          NISAR Satellite SAR Analysis Platform
        </p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {METRICS.map((m, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-telemetry-bg border border-white/10 p-4 rounded-lg space-y-2 hover:border-white/30 transition-colors"
          >
            <div className="flex justify-between items-start">
              <m.icon className={cn("w-5 h-5", m.color)} />
            </div>
            <div>
              <p className="text-2xl font-bold terminal-text">{m.value}</p>
              <p className="text-[10px] uppercase text-white/50 font-semibold">{m.label}</p>
              {m.sub && <p className={cn("text-[9px] font-bold", m.color)}>{m.sub}</p>}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Telemetry Panel */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-telemetry-bg border border-white/10 rounded-xl overflow-hidden flex flex-col h-[400px]">
            <div className="bg-white/5 px-4 py-2 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-radar-green" />
                <span className="text-xs font-bold uppercase tracking-widest">Live Ground Station Feed</span>
              </div>
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <div className="w-2 h-2 rounded-full bg-yellow-500" />
                <div className="w-2 h-2 rounded-full bg-radar-green" />
              </div>
            </div>
            <div className="flex-1 p-4 overflow-y-auto terminal-text text-sm space-y-1 bg-black">
              {logs.map((log, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-radar-green"
                >
                  <span className="text-white/30 mr-2">[{new Date().toLocaleTimeString()}]</span>
                  {log}
                </motion.div>
              ))}
              <div ref={logEndRef} />
            </div>
          </div>

          {/* SAR Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-telemetry-bg border border-white/10 p-6 rounded-xl space-y-4">
              <div className="flex items-center gap-3">
                <Satellite className="w-6 h-6 text-satellite-blue" />
                <h3 className="font-bold uppercase tracking-wider">SAR Telemetry Panel</h3>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                  <p className="text-white/40 uppercase text-[10px]">Satellite</p>
                  <p className="font-bold">RISAT-1A / EOS-04</p>
                </div>
                <div className="space-y-1">
                  <p className="text-white/40 uppercase text-[10px]">Altitude</p>
                  <p className="font-bold">529.4 km</p>
                </div>
                <div className="space-y-1">
                  <p className="text-white/40 uppercase text-[10px]">Orbit</p>
                  <p className="font-bold">SSO 97.5°</p>
                </div>
                <div className="space-y-1">
                  <p className="text-white/40 uppercase text-[10px]">Frequency</p>
                  <p className="font-bold">5.4 GHz C-band</p>
                </div>
              </div>
            </div>

            <div className="bg-telemetry-bg border border-white/10 p-6 rounded-xl space-y-4">
              <div className="flex items-center gap-3">
                <Radio className="w-6 h-6 text-radar-green" />
                <h3 className="font-bold uppercase tracking-wider">Ground Stations</h3>
              </div>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-center">
                  <span>Shadnagar NRSC</span>
                  <span className="text-radar-green font-bold uppercase">Authenticated</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Lucknow ISTRAC</span>
                  <span className="text-warning-orange font-bold uppercase">Standby</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Antarctic AGEOS</span>
                  <span className="text-satellite-blue font-bold uppercase">Monitoring</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Analysis & Alerts */}
        <div className="space-y-6">
          <div className="bg-satellite-blue/10 border border-satellite-blue/30 p-6 rounded-xl space-y-4">
            <h3 className="font-bold uppercase tracking-wider flex items-center gap-2">
              <Zap className="w-5 h-5 text-satellite-blue" />
              AI SAR Analysis
            </h3>
            <button 
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="w-full bg-satellite-blue hover:bg-satellite-blue/80 disabled:opacity-50 text-white font-bold py-4 rounded-lg transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-sm"
            >
              {isAnalyzing ? <Loader2 className="w-5 h-5 animate-spin" /> : "Simulate & Analyze"}
            </button>

            <AnimatePresence>
              {analysisResult && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={cn(
                    "p-4 rounded-lg border-2 space-y-2",
                    analysisResult.risk === 'high' ? "bg-alert-red/20 border-alert-red/50" : 
                    analysisResult.risk === 'medium' ? "bg-warning-orange/20 border-warning-orange/50" : 
                    "bg-radar-green/20 border-radar-green/50"
                  )}
                >
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold uppercase text-sm">{analysisResult.disaster_type} Detected</h4>
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-white/20">
                      {analysisResult.risk} RISK
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[10px] uppercase font-bold text-white/70">
                    <p>Moisture: {analysisResult.soil_moisture}</p>
                    <p>Deformation: {analysisResult.deformation}</p>
                    <p>Vibration: {analysisResult.vibration}</p>
                    <p>Region: {analysisResult.region}</p>
                  </div>
                  <p className="text-xs font-medium border-t border-white/10 pt-2 mt-2">
                    <span className="text-radar-green">ACTION:</span> {analysisResult.safety_action}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Active Alerts List */}
          <div className="bg-telemetry-bg border border-white/10 p-6 rounded-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold uppercase tracking-wider">Active Alerts</h3>
              <Bell className="w-4 h-4 text-alert-red" />
            </div>
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div key={alert.id} className="bg-white/5 p-3 rounded-lg border border-white/5 hover:border-white/20 transition-colors space-y-1">
                  <div className="flex justify-between items-start">
                    <p className="font-bold uppercase text-xs">{alert.type}</p>
                    <span className={cn(
                      "text-[8px] font-black px-1.5 py-0.5 rounded",
                      alert.severity === 'HIGH' ? "bg-alert-red text-white" : 
                      alert.severity === 'MEDIUM' ? "bg-warning-orange text-white" : "bg-radar-green text-black"
                    )}>
                      {alert.severity}
                    </span>
                  </div>
                  <p className="text-[10px] text-white/60">{alert.location} • {alert.time}</p>
                  <div className="flex justify-between items-center pt-1">
                    <span className="text-[9px] text-white/40 uppercase">{alert.peopleAffected} affected</span>
                    <span className={cn("text-[9px] font-bold uppercase", alert.status === 'ACTIVE' ? "text-alert-red" : "text-radar-green")}>
                      {alert.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-telemetry-bg border border-white/10 p-6 rounded-xl space-y-6">
          <h3 className="font-bold uppercase tracking-wider flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-satellite-blue" />
            Safety Counts
          </h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-xs uppercase font-bold">
                <span>People Warned</span>
                <span className="text-satellite-blue">45,230</span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-satellite-blue w-[85%]" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs uppercase font-bold">
                <span>People Evacuated</span>
                <span className="text-warning-orange">12,100</span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-warning-orange w-[45%]" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs uppercase font-bold">
                <span>Safe Zones Created</span>
                <span className="text-radar-green">23</span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-radar-green w-[70%]" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-telemetry-bg border border-white/10 p-6 rounded-xl space-y-6">
          <h3 className="font-bold uppercase tracking-wider flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-purple-500" />
            Death Count Analytics
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 p-4 rounded-lg">
              <p className="text-2xl font-bold text-purple-500">1,240</p>
              <p className="text-[10px] uppercase text-white/50">Prevented</p>
            </div>
            <div className="bg-white/5 p-4 rounded-lg">
              <p className="text-2xl font-bold text-alert-red">47</p>
              <p className="text-[10px] uppercase text-white/50">Occurred</p>
            </div>
          </div>
          <div className="bg-radar-green/10 border border-radar-green/30 p-4 rounded-lg text-center">
            <p className="text-3xl font-black text-radar-green">96.3%</p>
            <p className="text-xs uppercase font-bold">Reduction Rate</p>
          </div>
        </div>

        <div className="bg-telemetry-bg border border-white/10 p-6 rounded-xl space-y-6">
          <h3 className="font-bold uppercase tracking-wider flex items-center gap-2">
            <Send className="w-5 h-5 text-radar-green" />
            Alerts Sent
          </h3>
          <div className="grid grid-cols-2 gap-2 text-[10px] uppercase font-bold">
            <div className="bg-white/5 p-3 rounded-lg flex justify-between">
              <span>SMS</span>
              <span className="text-radar-green">23,400</span>
            </div>
            <div className="bg-white/5 p-3 rounded-lg flex justify-between">
              <span>App</span>
              <span className="text-radar-green">45,230</span>
            </div>
            <div className="bg-white/5 p-3 rounded-lg flex justify-between">
              <span>Gov</span>
              <span className="text-radar-green">12</span>
            </div>
            <div className="bg-white/5 p-3 rounded-lg flex justify-between">
              <span>SDMA</span>
              <span className="text-radar-green">8</span>
            </div>
          </div>
          <div className="space-y-2">
            <button 
              onClick={() => sendAlert("Alert sent to 45,230 people in region")}
              className="w-full bg-alert-red hover:bg-alert-red/80 text-white text-[10px] font-bold py-2 rounded uppercase tracking-widest flex items-center justify-center gap-2"
            >
              <Users className="w-3 h-3" /> Send Alert to People
            </button>
            <button 
              onClick={() => sendAlert("Notified: NDMA, Tamil Nadu SDMA, District Collector")}
              className="w-full bg-warning-orange hover:bg-warning-orange/80 text-white text-[10px] font-bold py-2 rounded uppercase tracking-widest flex items-center justify-center gap-2"
            >
              <ShieldAlert className="w-3 h-3" /> Alert Disaster Management
            </button>
            <button 
              onClick={() => sendAlert("Emergency broadcast activated")}
              className="w-full bg-satellite-blue hover:bg-satellite-blue/80 text-white text-[10px] font-bold py-2 rounded uppercase tracking-widest flex items-center justify-center gap-2"
            >
              <Radio className="w-3 h-3" /> Emergency Broadcast
            </button>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-radar-green text-black px-6 py-3 rounded-full font-bold shadow-2xl flex items-center gap-2"
          >
            <CheckCircle className="w-5 h-5" />
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
