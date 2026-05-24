import Fuse from 'fuse.js';
import { StudentProfile } from '../storage/chromeStorage';

interface FuseItem {
  key: keyof StudentProfile;
  synonym: string;
}

const SYNONYMS_MAP: Record<keyof StudentProfile, string[]> = {
  fullName: [
    'name', 'full name', 'student name', 'candidate name', 'your name', 
    'name of the student', 'enter your name', 'applicant name', 'name of candidate',
    'first name', 'last name', 'candidate\'s name'
  ],
  personalEmail: [
    'personal email', 'personal mail', 'personal email id', 'personal mail id', 
    'alternate email', 'non-college email', 'email address', 'email id', 'email',
    'personal email address', 'email ID (personal)'
  ],
  collegeEmail: [
    'college email', 'college mail', 'college email id', 'kiit email', 
    'official email', 'university email', 'institute email', 'college email address', 
    'official mail id', 'university email id', 'academic email'
  ],
  phone: [
    'phone', 'phone number', 'mobile', 'mobile number', 'contact', 'contact number', 
    'whatsapp number', 'whatsapp', 'mobile no', 'phone no', 'whatsapp no', 'contact no',
    'mobile number (whatsapp)', 'phone number (whatsapp)'
  ],
  gender: [
    'gender', 'sex', 'identify as'
  ],
  dob: [
    'dob', 'date of birth', 'birth date', 'born', 'd.o.b', 'date of birth (dd/mm/yyyy)'
  ],
  nationality: [
    'nationality', 'citizen', 'citizenship', 'nation'
  ],
  currentLocation: [
    'location', 'current location', 'city', 'state', 'address', 'current address', 
    'native place', 'home town', 'current city', 'place of residence'
  ],
  rollNo: [
    'roll', 'roll number', 'roll no', 'university roll', 'college roll', 
    'registration number', 'reg no', 'reg number', 'rollno', 'university roll number', 
    'registration no', 'kiit roll number', 'kiit roll no', 'student roll no'
  ],
  branch: [
    'branch', 'department', 'specialization', 'branch of study', 'btech branch', 'mtech branch',
    'discipline', 'subject'
  ],
  stream: [
    'stream', 'discipline', 'program', 'degree', 'undergraduate degree', 'pg/ug', 
    'btech stream', 'mtech stream', 'program of study', 'degree course', 'course stream',
    'course', 'course/stream', 'stream/course', 'select stream', 'select course', 'program / stream',
    'choose program', 'choose stream', 'choose course', 'ug/pg program', 'ug/pg', 'ug / pg', 'program (ug/pg)'
  ],
  cgpa: [
    'cgpa', 'cgpa/gpa', 'current cgpa', 'b.tech cgpa', 'pointer', 'grade point', 
    'current cgpa (b.tech)', 'aggregate cgpa', 'average cgpa', 'marks in cgpa',
    'overall cgpa', 'cgpa until now', 'latest cgpa'
  ],
  tenthPercentage: [
    '10th', '10th percentage', '10th %', 'matriculation', 'class 10', 'class x', 
    'x percentage', 'x%', 'secondary percentage', 'secondary %', '10th aggregate', 
    '10th standard percentage', 'class 10 percentage', 'class x percentage',
    'matriculation percentage', '10th marks', 'class 10th'
  ],
  tenthYear: [
    '10th passing year', '10th year', 'class 10 year', 'class x year', 
    'matriculation passing year', 'year of passing 10th', '10th passing', 'year of 10th',
    '10th year of passing', 'class 10th passing year'
  ],
  twelfthPercentage: [
    '12th', '12th percentage', '12th %', 'intermediate', 'class 12', 'class xii', 
    'xii percentage', 'xii%', 'senior secondary percentage', 'senior secondary %', 
    '12th aggregate', '12th standard percentage', 'class 12 percentage', 'class xii percentage',
    'intermediate percentage', '12th marks', 'class 12th', 'diploma percentage', 'diploma %'
  ],
  twelfthYear: [
    '12th passing year', '12th year', 'class 12 year', 'class xii year', 
    'intermediate passing year', 'year of passing 12th', '12th passing', 'year of 12th',
    '12th year of passing', 'class 12th passing year'
  ],
  backlogs: [
    'backlogs', 'active backlogs', 'backlog', 'history of backlogs', 'standing backlogs', 
    'number of backlogs', 'any active backlogs', 'backlogs (if any)', 'number of active backlogs'
  ],
  gradYear: [
    'graduation year', 'year of graduation', 'passing year', 'year of passing', 'batch', 
    'graduation passing year', 'passout year', 'year of graduation (passing year)',
    'expected year of graduation', 'passing batch', 'graduating year', 'yop', 
    'year of passing (yop)', 'passing year (yop)', 'y o p', 'y.o.p', 'grad year', 'gradyear'
  ],
  collegeName: [
    'college name', 'college', 'university name', 'university', 'institute name', 
    'institute', 'name of college', 'name of university', 'kiit', 'college/institute name',
    'college/institute', 'name of college/institute', 'college institute name', 'college institute',
    'name of the college institute', 'name of college institute', 'name of the college/institute'
  ],
  resumeLink: [
    'resume', 'resume link', 'resume url', 'cv', 'cv link', 'cv url', 'drive link', 
    'upload resume', 'gdrive resume link', 'gdrive link for resume', 'resume pdf link',
    'resume google drive link', 'resume drive link', 'resume link (google drive link)',
    'resume link (google drive)', 'resume link (drive link)', 'google drive link of resume',
    'google drive link for resume', 'gdrive link'
  ],
  linkedin: [
    'linkedin', 'linkedin profile', 'linkedin url', 'linkedin link', 
    'linkedin profile link', 'linkedin profile url'
  ],
  github: [
    'github', 'github profile', 'github url', 'github link', 
    'github profile link', 'github profile url'
  ],
  portfolio: [
    'portfolio', 'portfolio website', 'portfolio url', 'portfolio link', 'website', 
    'personal website', 'portfolio website link', 'personal link'
  ]
};

// Create a flat array of FuseItems
const FUSE_ITEMS: FuseItem[] = Object.entries(SYNONYMS_MAP).flatMap(([key, synonyms]) => 
  synonyms.map(synonym => ({
    key: key as keyof StudentProfile,
    synonym: synonym.toLowerCase()
  }))
);

// Instantiate Fuse.js
const fuse = new Fuse(FUSE_ITEMS, {
  keys: ['synonym'],
  threshold: 0.45, // Match tolerance (lower is stricter, higher is looser)
  includeScore: true
});

export interface MatchResult {
  key: keyof StudentProfile;
  confidence: number; // 0 to 1
  matchedSynonym: string;
}

/**
 * Normalizes question title text for better matching results.
 */
export const normalizeText = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/\*/g, '') // Remove asterisks (often used for required fields)
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, ' ') // Replace punctuation with space
    .replace(/\s+/g, ' ') // Collapse multiple spaces
    .trim();
};

/**
 * Matches a form question label with a profile field key.
 */
export const matchField = (questionLabel: string): MatchResult | null => {
  const cleanLabel = normalizeText(questionLabel);
  if (!cleanLabel) return null;

  // 1. Try an exact/prefix match first to yield high confidence
  for (const [key, synonyms] of Object.entries(SYNONYMS_MAP)) {
    const matched = synonyms.find(syn => {
      const cleanSyn = normalizeText(syn);
      return cleanLabel === cleanSyn || 
             cleanLabel.startsWith(cleanSyn + ' ') || 
             cleanLabel.endsWith(' ' + cleanSyn);
    });

    if (matched) {
      return {
        key: key as keyof StudentProfile,
        confidence: 1.0,
        matchedSynonym: matched
      };
    }
  }

  // 2. Perform fuzzy semantic search using Fuse.js
  const results = fuse.search(cleanLabel);
  if (results.length > 0) {
    const bestResult = results[0];
    const score = bestResult.score ?? 1;
    const confidence = parseFloat((1 - score).toFixed(2));

    // Filter out low confidence matches
    if (confidence >= 0.4) {
      return {
        key: bestResult.item.key,
        confidence,
        matchedSynonym: bestResult.item.synonym
      };
    }
  }

  return null;
};
