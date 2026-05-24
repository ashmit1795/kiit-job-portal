import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, GradCap, FileText, CheckCircle, ShieldAlert, 
  HelpCircle, Settings, ArrowRight, Download, Upload, 
  RotateCcw, Sparkles, ShieldCheck
} from 'lucide-react';
import { 
  getProfile, saveProfile, clearProfile, StudentProfile, 
  defaultProfile, getProfileCompletionPercentage 
} from '../storage/chromeStorage';

type Tab = 'home' | 'profile' | 'settings' | 'help';
type ProfileStep = 'personal' | 'academic' | 'professional';

export default function PopupApp() {
  const [profile, setProfile] = useState<StudentProfile>({ ...defaultProfile });
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [profileStep, setProfileStep] = useState<ProfileStep>('personal');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [completionPercent, setCompletionPercent] = useState<number>(0);

  // Load profile on load
  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    const data = await getProfile();
    setProfile(data);
    setCompletionPercent(getProfileCompletionPercentage(data));
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleInputChange = (field: keyof StudentProfile, value: string) => {
    const updated = { ...profile, [field]: value };
    setProfile(updated);
    setCompletionPercent(getProfileCompletionPercentage(updated));
  };

  const handleSave = async () => {
    await saveProfile(profile);
    showToast('Profile saved successfully!');
  };

  const handleReset = async () => {
    if (window.confirm('Are you sure you want to clear all your saved profile data?')) {
      await clearProfile();
      setProfile({ ...defaultProfile });
      setCompletionPercent(0);
      showToast('Profile reset completed!');
    }
  };

  // Mock profile helper for fast testing on Google Forms
  const handleLoadMockData = () => {
    const mockProfile: StudentProfile = {
      fullName: 'Ashmit Patra',
      personalEmail: 'ashmitpatra77@gmail.com',
      collegeEmail: '23053541@kiit.ac.in',
      phone: '8480476322',
      gender: 'Male',
      dob: '12/10/2004',
      nationality: 'Indian',
      currentLocation: 'Bhubaneswar, Odisha',
      rollNo: '23053541',
      branch: 'Computer Science & Engineering(CSE)',
      stream: 'B.Tech',
      cgpa: '9.21',
      tenthPercentage: '93.2',
      tenthYear: '2021',
      twelfthPercentage: '95.6',
      twelfthYear: '2023',
      backlogs: '0',
      gradYear: '2027',
      collegeName: 'Kalinga Institute of Industrial Technology (KIIT)',
      resumeLink: 'https://drive.google.com/file/d/1A2B3C4D5E6F7G8H9I0J/view',
      linkedin: 'https://linkedin.com/in/ashmit1116',
      github: 'https://github.com/ashmit1795',
      portfolio: 'https://ashmit.dev'
    };
    setProfile(mockProfile);
    setCompletionPercent(getProfileCompletionPercentage(mockProfile));
    showToast('Mock student profile loaded!');
  };

  // Backup profile to JSON
  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(profile, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `avsaar_profile_backup.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Profile backup exported!');
  };

  // Import profile from JSON
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = async (event) => {
        try {
          const imported = JSON.parse(event.target?.result as string);
          // Simple validation check
          if (imported.fullName !== undefined) {
            const merged = { ...defaultProfile, ...imported };
            setProfile(merged);
            await saveProfile(merged);
            setCompletionPercent(getProfileCompletionPercentage(merged));
            showToast('Profile imported and saved!');
          } else {
            showToast('Invalid backup file structure!');
          }
        } catch {
          showToast('Failed to parse backup file!');
        }
      };
    }
  };

  return (
    <div className="w-[480px] min-h-[580px] bg-dark-950 text-slate-100 flex flex-col relative select-none">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-4 left-4 right-4 bg-brand-600 border border-brand-400 text-white px-4 py-2.5 rounded-lg shadow-xl text-xs font-semibold flex items-center gap-2 z-50 justify-center"
          >
            <CheckCircle size={14} />
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Premium Header */}
      <header className="p-5 border-b border-slate-800 bg-dark-900/60 backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center font-bold text-lg shadow-lg shadow-brand-500/20 text-white">
            A
          </div>
          <div>
            <h1 className="text-base font-extrabold tracking-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              Avsaar Assistant
            </h1>
            <p className="text-[10px] text-slate-500 font-medium">Placement Autofill Companion</p>
          </div>
        </div>

        <button 
          onClick={handleLoadMockData}
          className="text-[10px] font-semibold flex items-center gap-1 bg-brand-500/10 hover:bg-brand-500/20 text-brand-400 border border-brand-500/30 px-2.5 py-1.5 rounded-full transition-all"
        >
          <Sparkles size={10} />
          Load Mock Profile
        </button>
      </header>

      {/* Tabs Layout */}
      <main className="flex-1 p-5 overflow-y-auto max-h-[440px]">
        <AnimatePresence mode="wait">
          
          {/* TAB 1: HOME / ONBOARDING */}
          {activeTab === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col gap-4"
            >
              {/* Progress Panel */}
              <div className="p-4 rounded-xl bg-dark-900 border border-slate-800/80 flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-400 font-medium">Profile Completion</span>
                  <span className="text-sm font-bold text-brand-400">{completionPercent}%</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-brand-500 to-brand-400 transition-all duration-500" 
                    style={{ width: `${completionPercent}%` }}
                  />
                </div>
                
                {completionPercent === 100 ? (
                  <div className="flex items-center gap-2 text-[11px] text-emerald-400 font-medium bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20">
                    <CheckCircle size={12} />
                    <span>Your profile is fully complete! Ready to autofill.</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-between text-[11px] text-amber-400 bg-amber-500/5 p-2.5 rounded-lg border border-amber-500/15">
                    <span>Fill in missing fields to reach high autofill match rates.</span>
                    <button 
                      onClick={() => setActiveTab('profile')}
                      className="text-brand-400 font-bold hover:underline flex items-center gap-0.5"
                    >
                      Complete <ArrowRight size={10} />
                    </button>
                  </div>
                )}
              </div>

              {/* Instructions list */}
              <div className="flex flex-col gap-2.5">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">How to use</h3>
                
                <div className="grid grid-cols-1 gap-2">
                  <div className="p-3.5 rounded-lg bg-dark-900/40 border border-slate-900 flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-slate-800 text-[10px] font-bold text-slate-300 flex items-center justify-center shrink-0">1</div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-200">Configure Profile</h4>
                      <p className="text-[10px] text-slate-500 mt-0.5">Click the "Profile" tab below and fill in your academic/personal credentials.</p>
                    </div>
                  </div>
                  
                  <div className="p-3.5 rounded-lg bg-dark-900/40 border border-slate-900 flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-slate-800 text-[10px] font-bold text-slate-300 flex items-center justify-center shrink-0">2</div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-200">Open any Google Form</h4>
                      <p className="text-[10px] text-slate-500 mt-0.5">Navigate to your college placement drive or internship form.</p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-lg bg-dark-900/40 border border-slate-900 flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-brand-500/20 text-[10px] font-bold text-brand-400 flex items-center justify-center shrink-0">3</div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-200">⚡ Click "Fill Placement Form"</h4>
                      <p className="text-[10px] text-slate-500 mt-0.5">Click the floating button on the bottom right. The assistant will match and fill fields instantly!</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Security Shield Card */}
              <div className="p-3.5 rounded-xl bg-slate-900/30 border border-slate-800/40 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                  <ShieldCheck size={16} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">100% Secure & Local</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">Your profile is saved directly in local storage. No trackers, no databases, no server uploads.</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 2: PROFILE EDITOR */}
          {activeTab === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col gap-4"
            >
              {/* Steps Headers */}
              <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs font-medium">
                {(['personal', 'academic', 'professional'] as ProfileStep[]).map(step => (
                  <button
                    key={step}
                    onClick={() => setProfileStep(step)}
                    className={`flex-1 py-1.5 rounded-md text-center capitalize transition-all ${
                      profileStep === step 
                        ? 'bg-slate-800 text-white font-bold shadow-sm' 
                        : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {step}
                  </button>
                ))}
              </div>

              {/* Steps Forms container */}
              <div className="flex flex-col gap-3 min-h-[300px]">
                
                {/* STEP A: PERSONAL */}
                {profileStep === 'personal' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-2 gap-3">
                    <div className="col-span-2 flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Full Name</label>
                      <input 
                        type="text" 
                        value={profile.fullName} 
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        placeholder="Ashmit Senapati"
                        className="glass-input p-2 rounded-lg text-xs"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Personal Email</label>
                      <input 
                        type="email" 
                        value={profile.personalEmail} 
                        onChange={(e) => handleInputChange('personalEmail', e.target.value)}
                        placeholder="ashmit@gmail.com"
                        className="glass-input p-2 rounded-lg text-xs"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">College Email</label>
                      <input 
                        type="email" 
                        value={profile.collegeEmail} 
                        onChange={(e) => handleInputChange('collegeEmail', e.target.value)}
                        placeholder="2205123@kiit.ac.in"
                        className="glass-input p-2 rounded-lg text-xs"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Phone Number</label>
                      <input 
                        type="text" 
                        value={profile.phone} 
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="9876543210"
                        className="glass-input p-2 rounded-lg text-xs"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Gender</label>
                      <select 
                        value={profile.gender} 
                        onChange={(e) => handleInputChange('gender', e.target.value)}
                        className="glass-input p-2 rounded-lg text-xs h-[32px] bg-dark-950"
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">DOB (dd/mm/yyyy)</label>
                      <input 
                        type="text" 
                        value={profile.dob} 
                        onChange={(e) => handleInputChange('dob', e.target.value)}
                        placeholder="12/10/2004"
                        className="glass-input p-2 rounded-lg text-xs"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Nationality</label>
                      <input 
                        type="text" 
                        value={profile.nationality} 
                        onChange={(e) => handleInputChange('nationality', e.target.value)}
                        placeholder="Indian"
                        className="glass-input p-2 rounded-lg text-xs"
                      />
                    </div>

                    <div className="col-span-2 flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Current Location</label>
                      <input 
                        type="text" 
                        value={profile.currentLocation} 
                        onChange={(e) => handleInputChange('currentLocation', e.target.value)}
                        placeholder="Bhubaneswar, Odisha"
                        className="glass-input p-2 rounded-lg text-xs"
                      />
                    </div>
                  </motion.div>
                )}

                {/* STEP B: ACADEMIC */}
                {profileStep === 'academic' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Roll Number</label>
                      <input 
                        type="text" 
                        value={profile.rollNo} 
                        onChange={(e) => handleInputChange('rollNo', e.target.value)}
                        placeholder="2205123"
                        className="glass-input p-2 rounded-lg text-xs"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Graduation Year</label>
                      <input 
                        type="text" 
                        value={profile.gradYear} 
                        onChange={(e) => handleInputChange('gradYear', e.target.value)}
                        placeholder="2026"
                        className="glass-input p-2 rounded-lg text-xs"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Branch</label>
                      <input 
                        type="text" 
                        value={profile.branch} 
                        onChange={(e) => handleInputChange('branch', e.target.value)}
                        placeholder="Computer Science & Engineering"
                        className="glass-input p-2 rounded-lg text-xs"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Stream</label>
                      <input 
                        type="text" 
                        value={profile.stream} 
                        onChange={(e) => handleInputChange('stream', e.target.value)}
                        placeholder="B.Tech"
                        className="glass-input p-2 rounded-lg text-xs"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Current CGPA</label>
                      <input 
                        type="text" 
                        value={profile.cgpa} 
                        onChange={(e) => handleInputChange('cgpa', e.target.value)}
                        placeholder="9.24"
                        className="glass-input p-2 rounded-lg text-xs"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Active Backlogs</label>
                      <input 
                        type="text" 
                        value={profile.backlogs} 
                        onChange={(e) => handleInputChange('backlogs', e.target.value)}
                        placeholder="0"
                        className="glass-input p-2 rounded-lg text-xs"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">10th Percentage (%)</label>
                      <input 
                        type="text" 
                        value={profile.tenthPercentage} 
                        onChange={(e) => handleInputChange('tenthPercentage', e.target.value)}
                        placeholder="95.6"
                        className="glass-input p-2 rounded-lg text-xs"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">10th Passing Year</label>
                      <input 
                        type="text" 
                        value={profile.tenthYear} 
                        onChange={(e) => handleInputChange('tenthYear', e.target.value)}
                        placeholder="2020"
                        className="glass-input p-2 rounded-lg text-xs"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">12th Percentage (%)</label>
                      <input 
                        type="text" 
                        value={profile.twelfthPercentage} 
                        onChange={(e) => handleInputChange('twelfthPercentage', e.target.value)}
                        placeholder="92.4"
                        className="glass-input p-2 rounded-lg text-xs"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">12th Passing Year</label>
                      <input 
                        type="text" 
                        value={profile.twelfthYear} 
                        onChange={(e) => handleInputChange('twelfthYear', e.target.value)}
                        placeholder="2022"
                        className="glass-input p-2 rounded-lg text-xs"
                      />
                    </div>

                    <div className="col-span-2 flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">College Name</label>
                      <input 
                        type="text" 
                        value={profile.collegeName} 
                        onChange={(e) => handleInputChange('collegeName', e.target.value)}
                        placeholder="Kalinga Institute of Industrial Technology"
                        className="glass-input p-2 rounded-lg text-xs"
                      />
                    </div>
                  </motion.div>
                )}

                {/* STEP C: PROFESSIONAL */}
                {profileStep === 'professional' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Resume GDrive Link</label>
                      <input 
                        type="text" 
                        value={profile.resumeLink} 
                        onChange={(e) => handleInputChange('resumeLink', e.target.value)}
                        placeholder="https://drive.google.com/file/d/..."
                        className="glass-input p-2 rounded-lg text-xs"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">LinkedIn Profile Link</label>
                      <input 
                        type="text" 
                        value={profile.linkedin} 
                        onChange={(e) => handleInputChange('linkedin', e.target.value)}
                        placeholder="https://linkedin.com/in/username"
                        className="glass-input p-2 rounded-lg text-xs"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">GitHub Profile Link</label>
                      <input 
                        type="text" 
                        value={profile.github} 
                        onChange={(e) => handleInputChange('github', e.target.value)}
                        placeholder="https://github.com/username"
                        className="glass-input p-2 rounded-lg text-xs"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Portfolio Website Link</label>
                      <input 
                        type="text" 
                        value={profile.portfolio} 
                        onChange={(e) => handleInputChange('portfolio', e.target.value)}
                        placeholder="https://mywebsite.com"
                        className="glass-input p-2 rounded-lg text-xs"
                      />
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2.5 pt-2">
                <button
                  onClick={handleSave}
                  className="flex-1 py-2.5 rounded-lg text-white font-bold text-xs bg-brand-500 hover:bg-brand-600 transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-brand-500/10"
                >
                  Save Changes
                </button>
              </div>
            </motion.div>
          )}

          {/* TAB 3: SETTINGS & DATA PRIVACY */}
          {activeTab === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col gap-4"
            >
              {/* Privacy statement */}
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col gap-2.5">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                  <ShieldCheck size={16} />
                  <span>Privacy Pledge</span>
                </div>
                <p className="text-[10.5px] text-slate-400 leading-relaxed">
                  Avsaar respects your data privacy. The Autofill Assistant saves your profile **strictly inside your local Chrome browser storage**. 
                  It does **NOT** use any backend servers, trackers, cookies, or cloud databases. 
                  Nothing leaves your device.
                </p>
              </div>

              {/* Data Operations */}
              <div className="flex flex-col gap-2">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Profile Management</h3>
                
                <div className="flex flex-col gap-2">
                  <button 
                    onClick={handleExport}
                    className="flex items-center justify-between p-3 rounded-lg bg-dark-900 hover:bg-dark-900/80 border border-slate-800 transition-all text-xs font-semibold text-slate-300"
                  >
                    <div className="flex items-center gap-2">
                      <Download size={14} className="text-slate-400" />
                      <span>Backup/Export Profile</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-medium">JSON format</span>
                  </button>

                  <label 
                    className="flex items-center justify-between p-3 rounded-lg bg-dark-900 hover:bg-dark-900/80 border border-slate-800 transition-all text-xs font-semibold text-slate-300 cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Upload size={14} className="text-slate-400" />
                      <span>Restore/Import Profile</span>
                    </div>
                    <input 
                      type="file" 
                      accept=".json" 
                      onChange={handleImport} 
                      className="hidden" 
                    />
                    <span className="text-[10px] text-slate-500 font-medium">Upload file</span>
                  </label>

                  <button 
                    onClick={handleReset}
                    className="flex items-center justify-between p-3 rounded-lg bg-red-950/20 hover:bg-red-950/30 border border-red-900/30 transition-all text-xs font-semibold text-red-400"
                  >
                    <div className="flex items-center gap-2">
                      <RotateCcw size={14} />
                      <span>Clear All Local Data</span>
                    </div>
                    <span className="text-[10px] text-red-500/80 font-medium">Irreversible</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 4: FAQ / HELP */}
          {activeTab === 'help' && (
            <motion.div
              key="help"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col gap-3.5"
            >
              <div className="flex flex-col gap-2">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Frequently Asked Questions</h3>
              </div>

              <div className="flex flex-col gap-3 max-h-[350px] overflow-y-auto pr-1">
                <div className="p-3.5 rounded-lg bg-dark-900 border border-slate-800/80">
                  <h4 className="text-xs font-bold text-white">How does semantic autofill work?</h4>
                  <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                    Instead of exact character matches, the extension maps labels using a semantic synonym dictionary and **Fuse.js** fuzzy matching algorithms. 
                    This handles variations like "Roll No" versus "University Roll Number".
                  </p>
                </div>

                <div className="p-3.5 rounded-lg bg-dark-900 border border-slate-800/80">
                  <h4 className="text-xs font-bold text-white">What elements does it support?</h4>
                  <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                    It fully supports **text inputs, multi-line textareas, custom radio selections (such as Gender / Options)**, and **custom Google Forms dropdown choices**.
                  </p>
                </div>

                <div className="p-3.5 rounded-lg bg-dark-900 border border-slate-800/80">
                  <h4 className="text-xs font-bold text-white">Does it fill multi-page forms?</h4>
                  <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                    Yes! The assistant listens for page mutations in Google Forms. 
                    Once you initiate an autofill, navigating to the "Next" page will trigger automatic fillings in the subsequent sections silently!
                  </p>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* Modern bottom navigation */}
      <footer className="p-3 border-t border-slate-800 bg-dark-900/60 backdrop-blur-md flex items-center justify-around">
        <button 
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center gap-1.5 text-[10px] font-semibold transition-all ${
            activeTab === 'home' ? 'text-brand-400 scale-105' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <Sparkles size={16} />
          <span>Home</span>
        </button>

        <button 
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center gap-1.5 text-[10px] font-semibold transition-all ${
            activeTab === 'profile' ? 'text-brand-400 scale-105' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <User size={16} />
          <span>Profile</span>
        </button>

        <button 
          onClick={() => setActiveTab('settings')}
          className={`flex flex-col items-center gap-1.5 text-[10px] font-semibold transition-all ${
            activeTab === 'settings' ? 'text-brand-400 scale-105' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <Settings size={16} />
          <span>Settings</span>
        </button>

        <button 
          onClick={() => setActiveTab('help')}
          className={`flex flex-col items-center gap-1.5 text-[10px] font-semibold transition-all ${
            activeTab === 'help' ? 'text-brand-400 scale-105' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          <HelpCircle size={16} />
          <span>Help</span>
        </button>
      </footer>
    </div>
  );
}
