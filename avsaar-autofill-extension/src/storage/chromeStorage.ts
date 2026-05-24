export interface StudentProfile {
  // Personal Details
  fullName: string;
  personalEmail: string;
  collegeEmail: string;
  phone: string;
  gender: string;
  dob: string;
  nationality: string;
  currentLocation: string;

  // Academic Details
  rollNo: string;
  branch: string;
  stream: string;
  cgpa: string;
  tenthPercentage: string;
  tenthYear: string;
  twelfthPercentage: string;
  twelfthYear: string;
  backlogs: string;
  gradYear: string;
  collegeName: string;

  // Professional Details
  resumeLink: string;
  linkedin: string;
  github: string;
  portfolio: string;
}

const STORAGE_KEY = 'avsaar_student_profile';

export const defaultProfile: StudentProfile = {
  fullName: '',
  personalEmail: '',
  collegeEmail: '',
  phone: '',
  gender: '',
  dob: '',
  nationality: 'Indian',
  currentLocation: '',
  rollNo: '',
  branch: '',
  stream: 'B.Tech',
  cgpa: '',
  tenthPercentage: '',
  tenthYear: '',
  twelfthPercentage: '',
  twelfthYear: '',
  backlogs: '0',
  gradYear: '',
  collegeName: 'Kalinga Institute of Industrial Technology (KIIT)',
  resumeLink: '',
  linkedin: '',
  github: '',
  portfolio: ''
};

export const getProfile = (): Promise<StudentProfile> => {
  return new Promise((resolve) => {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
      chrome.storage.sync.get([STORAGE_KEY], (result) => {
        if (result && result[STORAGE_KEY]) {
          resolve({ ...defaultProfile, ...result[STORAGE_KEY] });
        } else {
          resolve({ ...defaultProfile });
        }
      });
    } else {
      // Fallback for development/testing in normal browser
      const localData = localStorage.getItem(STORAGE_KEY);
      if (localData) {
        try {
          resolve({ ...defaultProfile, ...JSON.parse(localData) });
        } catch {
          resolve({ ...defaultProfile });
        }
      } else {
        resolve({ ...defaultProfile });
      }
    }
  });
};

export const saveProfile = (profile: StudentProfile): Promise<void> => {
  return new Promise((resolve) => {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
      chrome.storage.sync.set({ [STORAGE_KEY]: profile }, () => {
        resolve();
      });
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
      resolve();
    }
  });
};

export const clearProfile = (): Promise<void> => {
  return new Promise((resolve) => {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
      chrome.storage.sync.remove([STORAGE_KEY], () => {
        resolve();
      });
    } else {
      localStorage.removeItem(STORAGE_KEY);
      resolve();
    }
  });
};

export const hasProfileCompleted = (profile: StudentProfile): boolean => {
  // Check essential core fields to assess profile completion
  const coreFields: (keyof StudentProfile)[] = [
    'fullName',
    'personalEmail',
    'collegeEmail',
    'phone',
    'gender',
    'rollNo',
    'branch',
    'cgpa',
    'tenthPercentage',
    'twelfthPercentage',
    'gradYear'
  ];
  const filledCount = coreFields.filter(field => !!profile[field]).length;
  return filledCount === coreFields.length;
};

export const getProfileCompletionPercentage = (profile: StudentProfile): number => {
  const fields = Object.keys(defaultProfile) as (keyof StudentProfile)[];
  const filledCount = fields.filter(field => {
    const value = profile[field];
    return value !== undefined && value !== null && value.trim() !== '';
  }).length;
  return Math.round((filledCount / fields.length) * 100);
};
