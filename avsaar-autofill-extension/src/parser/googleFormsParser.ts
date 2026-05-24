import { setNativeValue } from '../utils/nativeSetter';
import { StudentProfile } from '../storage/chromeStorage';
import { matchField, normalizeText } from '../matcher/fuseMatcher';

export type FieldType = 'text' | 'textarea' | 'radio' | 'dropdown' | 'checkbox' | 'unknown';

export interface FormQuestion {
  container: HTMLElement;
  label: string;
  type: FieldType;
  inputElement: HTMLElement; // The main input or listbox
  radioOptions?: { element: HTMLElement; labelText: string }[];
}

/**
 * Scans the DOM and extracts all Google Forms question blocks.
 */
export const parseGoogleForm = (): FormQuestion[] => {
  const questions: FormQuestion[] = [];
  
  // Google Forms groups each question inside role="listitem" container
  const questionBlocks = document.querySelectorAll('[role="listitem"]');

  questionBlocks.forEach((block) => {
    const container = block as HTMLElement;

    // 1. Locate and extract the question label text
    let label = '';
    
    // Check for role="heading" which is the standard Google Forms question header
    const headingEl = container.querySelector('[role="heading"]');
    if (headingEl) {
      // Find the first inner span or read text content
      const labelSpan = headingEl.querySelector('span');
      label = labelSpan ? labelSpan.textContent || '' : headingEl.textContent || '';
    } else {
      // Fallback: search for elements with typical class names or labels
      const possibleHeading = container.querySelector('div[id*="i"]');
      if (possibleHeading) {
        label = possibleHeading.textContent || '';
      }
    }

    // Clean up label (remove required asterisk indicators etc.)
    label = label.trim();
    if (!label) return; // Skip if no label is found

    // 2. Identify the input control inside the question container
    let type: FieldType = 'unknown';
    let inputElement: HTMLElement | null = null;
    let radioOptions: { element: HTMLElement; labelText: string }[] = [];

    // Check for standard text input or textarea
    const textInput = container.querySelector('input[type="text"], input[type="email"], input[type="number"], input[type="date"], input[type="url"]') as HTMLInputElement | null;
    const textareaInput = container.querySelector('textarea') as HTMLTextAreaElement | null;

    if (textInput) {
      type = 'text';
      inputElement = textInput;
    } else if (textareaInput) {
      type = 'textarea';
      inputElement = textareaInput;
    } else {
      // Check for Custom Radio Buttons (Google Forms uses role="radio" on custom divs)
      const radioEls = container.querySelectorAll('[role="radio"]');
      if (radioEls.length > 0) {
        type = 'radio';
        // The first option element acts as a reference input element
        inputElement = radioEls[0] as HTMLElement;

        radioEls.forEach((radio) => {
          // In Google Forms, the option label text is usually in a sibling or adjacent container
          // Let's traverse up to the parent option container, and search for its text content
          const optionContainer = radio.closest('[role="presentation"], label, div');
          if (optionContainer) {
            // Find spans inside optionContainer excluding the radio button visual elements itself
            const spans = optionContainer.querySelectorAll('span');
            let optionText = '';
            
            // Usually the last span or the one with specific typography contains the label text
            if (spans.length > 0) {
              optionText = spans[spans.length - 1].textContent || '';
            } else {
              optionText = optionContainer.textContent || '';
            }

            optionText = optionText.trim();
            if (optionText) {
              radioOptions.push({
                element: radio as HTMLElement,
                labelText: optionText
              });
            }
          }
        });
      } else {
        // Check for Custom Dropdown (Google Forms uses role="listbox" on custom divs)
        const listboxEl = container.querySelector('[role="listbox"]') as HTMLElement | null;
        if (listboxEl) {
          type = 'dropdown';
          inputElement = listboxEl;
        }
      }
    }

    if (inputElement && type !== 'unknown') {
      questions.push({
        container,
        label,
        type,
        inputElement,
        radioOptions: radioOptions.length > 0 ? radioOptions : undefined
      });
    }
  });

  return questions;
};

/**
 * Automates the filling of a single parsed Google Forms question based on student profile.
 * Returns true if the field was successfully filled, false otherwise.
 */
/**
 * Standardizes formats like DD/MM/YYYY or DD-MM-YYYY to YYYY-MM-DD for native HTML date inputs.
 */
const formatDateForInput = (value: string): string => {
  const parts = value.split(/[\/\-]/);
  if (parts.length === 3) {
    const p0 = parts[0].trim();
    const p1 = parts[1].trim();
    const p2 = parts[2].trim();
    
    // Check if year is already first (YYYY-MM-DD)
    if (p0.length === 4) {
      return `${p0}-${p1.padStart(2, '0')}-${p2.padStart(2, '0')}`;
    }
    
    // Format DD-MM-YYYY to YYYY-MM-DD
    return `${p2}-${p1.padStart(2, '0')}-${p0.padStart(2, '0')}`;
  }
  return value;
};

/**
 * Helper to check if a DOM element is fully visible in the viewport and not display: none.
 */
const isElementVisible = (el: HTMLElement): boolean => {
  if (!el.isConnected) return false;
  if (el.offsetWidth === 0 && el.offsetHeight === 0) return false;
  
  // Check computed display/visibility on self
  const style = window.getComputedStyle(el);
  if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') return false;
  
  // Standard parent check (often parent popup div is hidden)
  let parent = el.parentElement;
  while (parent) {
    const pStyle = window.getComputedStyle(parent);
    if (pStyle.display === 'none' || pStyle.visibility === 'hidden') return false;
    parent = parent.parentElement;
  }
  
  return true;
};

/**
 * Smart matching for option texts, handling abbreviations for branches and college names.
 */
const matchOptionText = (optionText: string, targetValue: string, matchedKey?: string): boolean => {
  const optLower = optionText.toLowerCase().trim().replace(/[&]/g, 'and'); // Replace & with 'and' for uniform text comparison
  const tgtLower = targetValue.toLowerCase().trim().replace(/[&]/g, 'and');
  
  if (optLower === tgtLower || optLower.includes(tgtLower) || tgtLower.includes(optLower)) {
    return true;
  }
  
  // Special abbreviation rules for KIIT branches (essential for University placement forms!)
  if (matchedKey === 'branch') {
    const branchAbbreviations: Record<string, string[]> = {
      'computer science and engineering': ['cse', 'computer science'],
      'computer science and system engineering': ['csse', 'cs&se', 'computer science and system engineering'],
      'computer science and communication engineering': ['csce', 'cs&ce', 'computer science and communication engineering'],
      'electronics and computer science engineering': ['ecs', 'electronics and computer science engineering'],
      'electronics and telecommunication engineering': ['etc', 'ece', 'electronics and telecommunication engineering', 'electronics and communication engineering'],
      'electronics and electrical engineering': ['eee', 'electronics and electrical engineering'],
      'electrical engineering': ['ee', 'electrical engineering'],
      'mechanical engineering': ['me', 'mechanical engineering'],
      'mechatronics': ['mech', 'mechatronics'],
      'civil engineering': ['ce', 'civil engineering'],
      'information technology': ['it', 'information technology']
    };

    // Find the matching profile target branch key
    let targetBranchKey = '';
    for (const [fullBranch, synonyms] of Object.entries(branchAbbreviations)) {
      if (tgtLower.includes(fullBranch) || fullBranch.includes(tgtLower) || synonyms.some(syn => tgtLower === syn)) {
        targetBranchKey = fullBranch;
        break;
      }
    }

    if (targetBranchKey) {
      // Check if optionText matches any of the synonyms for the matched target branch key
      const allowedSynonyms = branchAbbreviations[targetBranchKey];
      return allowedSynonyms.some(syn => {
        const synNorm = syn.toLowerCase().replace(/[&]/g, 'and');
        const cleanSyn = synNorm.replace(/\s+/g, '');
        const cleanOpt = optLower.replace(/\s+/g, '');

        if (synNorm.length <= 5) {
          const words = optLower.split(/[^a-z0-9]+/);
          return words.includes(synNorm) || cleanOpt === cleanSyn;
        }

        return cleanOpt === cleanSyn || cleanOpt.includes(cleanSyn) || cleanSyn.includes(cleanOpt);
      });
    }
  }
  
  // Special rules for Stream / Program matching (B.Tech, M.Tech, etc.)
  if (matchedKey === 'stream') {
    const streamAbbreviations: Record<string, string[]> = {
      'btech': ['b.tech', 'btech', 'b. tech', 'b tech', 'bachelor of technology'],
      'mtech': ['m.tech', 'mtech', 'm. tech', 'm tech', 'master of technology'],
      'mca': ['mca', 'm.c.a.', 'master of computer applications'],
      'bca': ['bca', 'b.c.a.', 'bachelor of computer applications'],
      'mba': ['mba', 'm.b.a.', 'master of business administration']
    };

    // Find the target stream key
    let targetStreamKey = '';
    for (const [key, synonyms] of Object.entries(streamAbbreviations)) {
      if (tgtLower.includes(key) || synonyms.some(syn => tgtLower === syn || tgtLower.includes(syn))) {
        targetStreamKey = key;
        break;
      }
    }

    if (targetStreamKey) {
      const allowedSynonyms = streamAbbreviations[targetStreamKey];
      return allowedSynonyms.some(syn => {
        const synNorm = syn.toLowerCase().replace(/[&]/g, 'and');
        const cleanSyn = synNorm.replace(/[\.\s]/g, '');
        const cleanOpt = optLower.replace(/[\.\s]/g, '');
        return cleanOpt === cleanSyn || cleanOpt.includes(cleanSyn) || cleanSyn.includes(cleanOpt);
      });
    }
  }

  // Special rules for College Name matching
  if (matchedKey === 'collegeName') {
    if (tgtLower.includes('kalinga') || tgtLower.includes('kiit') || tgtLower.includes('technology')) {
      if (optLower.includes('kiit') || optLower.includes('kalinga') || optLower.includes('kiit-du') || optLower.includes('kiit university') || optLower.includes('kalinga institute')) {
        return true;
      }
    }
  }

  // Special rules for YOP (Year of Passing)
  if (matchedKey === 'gradYear' || matchedKey === 'tenthYear' || matchedKey === 'twelfthYear') {
    // Exact match for digits
    const cleanOptDigits = optLower.replace(/\D/g, '');
    const cleanTgtDigits = tgtLower.replace(/\D/g, '');
    if (cleanOptDigits && cleanTgtDigits && cleanOptDigits === cleanTgtDigits) {
      return true;
    }
  }
  
  return false;
};

/**
 * Safely simulates standard and framework-specific click operations
 * by dispatching mousedown, mouseup, and click events sequentially.
 */
const simulateClick = (element: HTMLElement) => {
  try {
    element.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true, view: window }));
    element.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true, view: window }));
    element.click();
  } catch (error) {
    console.error('Failed to simulate click on element:', error);
    element.click(); // Standard fallback
  }
};

/**
 * Automates the filling of a single parsed Google Forms question based on student profile.
 * Returns true if the field was successfully filled, false otherwise.
 */
export const autofillQuestion = async (
  question: FormQuestion,
  profile: StudentProfile
): Promise<{ filled: boolean; confidence: number; matchedFieldKey?: keyof StudentProfile; filledValue?: string }> => {
  // Find matching field in profile using semantic matcher
  const match = matchField(question.label);
  if (!match) {
    return { filled: false, confidence: 0 };
  }

  const profileValue = profile[match.key];
  // If the profile field doesn't have any saved value, we can't fill it
  if (profileValue === undefined || profileValue === null || profileValue.trim() === '') {
    return { filled: false, confidence: match.confidence, matchedFieldKey: match.key };
  }

  const cleanVal = profileValue.trim();

  if (question.type === 'text' || question.type === 'textarea') {
    const input = question.inputElement as HTMLInputElement | HTMLTextAreaElement;
    
    // Format dates correctly if input type is "date"
    let valToFill = cleanVal;
    if (input instanceof HTMLInputElement && (input.type === 'date' || question.label.toLowerCase().includes('date') || question.label.toLowerCase().includes('dob'))) {
      valToFill = formatDateForInput(cleanVal);
    }
    
    setNativeValue(input, valToFill);
    
    // Highlight animation for visual feedback (SaaS style)
    triggerAutofillHighlight(input);
    
    return { 
      filled: true, 
      confidence: match.confidence, 
      matchedFieldKey: match.key,
      filledValue: valToFill 
    };
  }

  if (question.type === 'radio' && question.radioOptions) {
    // Select the radio option that matches our clean value
    let matchedOption = question.radioOptions.find(opt => 
      matchOptionText(opt.labelText, cleanVal, match.key)
    );

    // Special matching for gender: e.g. "M" -> "Male", "F" -> "Female"
    if (!matchedOption && match.key === 'gender') {
      const gLower = cleanVal.toLowerCase();
      if (gLower.startsWith('m')) {
        matchedOption = question.radioOptions.find(opt => opt.labelText.toLowerCase().startsWith('m'));
      } else if (gLower.startsWith('f')) {
        matchedOption = question.radioOptions.find(opt => opt.labelText.toLowerCase().startsWith('f'));
      }
    }

    if (matchedOption) {
      simulateClick(matchedOption.element);
      triggerAutofillHighlight(matchedOption.element);
      return { 
        filled: true, 
        confidence: match.confidence, 
        matchedFieldKey: match.key,
        filledValue: matchedOption.labelText 
      };
    }
  }
  if (question.type === 'dropdown') {
    const listbox = question.inputElement;
    
    // Find the best click target to open the dropdown (clicking child span is 1000% more robust in dynamic frameworks)
    const innerSpan = listbox.querySelector('span');
    const innerContent = listbox.querySelector('[class*="Content"]');
    const innerPresentation = listbox.querySelector('[role="presentation"]');
    const clickTarget = innerSpan || innerContent || innerPresentation || listbox;
    
    // Open the Google Forms custom dropdown by simulating click
    simulateClick(clickTarget as HTMLElement);

    return new Promise((resolve) => {
      let attempts = 0;
      const maxAttempts = 20; // Poll for up to 1000ms (20 * 50ms) to allow rendering in slow devices
      
      const checkAndFillDropdown = () => {
        // Query options appended to document body using highly comprehensive selectors
        const optionEls = Array.from(document.querySelectorAll('[role="option"], .quantumWizMenuPaperselectOption, .exportOption, [class*="MenuPaperselectOption"]')) as HTMLElement[];
        
        // CRITICAL FILTER: Only target options that are currently visible on the screen!
        const visibleOptions = optionEls.filter(opt => isElementVisible(opt));

        if (visibleOptions.length > 0) {
          let clicked = false;
          let matchedText = '';

          // 1. Try exact synonym/abbreviation match
          visibleOptions.forEach((opt) => {
            if (clicked) return;
            const optText = opt.textContent || '';
            if (matchOptionText(optText, cleanVal, match.key)) {
              simulateClick(opt);
              clicked = true;
              matchedText = optText;
            }
          });

          // 2. Fallback starts-with match
          if (!clicked) {
            visibleOptions.forEach((opt) => {
              if (clicked) return;
              const optText = (opt.textContent || '').toLowerCase().trim();
              const valLower = cleanVal.toLowerCase().trim();
              if (optText.startsWith(valLower) || valLower.startsWith(optText)) {
                simulateClick(opt);
                clicked = true;
                matchedText = opt.textContent || '';
              }
            });
          }

          // Close dropdown safely if option was not clicked
          if (!clicked) {
            simulateClick(clickTarget as HTMLElement); // Toggle close
          } else {
            triggerAutofillHighlight(listbox);
          }

          resolve({
            filled: clicked,
            confidence: match.confidence,
            matchedFieldKey: match.key,
            filledValue: clicked ? matchedText : undefined
          });
        } else if (attempts < maxAttempts) {
          attempts++;
          setTimeout(checkAndFillDropdown, 50); // Poll again in 50ms
        } else {
          // Timeout - safely close listbox to keep the DOM clean
          simulateClick(clickTarget as HTMLElement);
          resolve({
            filled: false,
            confidence: match.confidence,
            matchedFieldKey: match.key
          });
        }
      };
      
      // Start polling
      checkAndFillDropdown();
    });
  }

  return { filled: false, confidence: match.confidence, matchedFieldKey: match.key };
};

/**
 * Triggers a premium visual feedback highlight animation on autofilled elements.
 */
const triggerAutofillHighlight = (element: HTMLElement) => {
  const originalTransition = element.style.transition;
  const originalShadow = element.style.boxShadow;
  
  element.style.transition = 'box-shadow 0.3s ease-in-out, background-color 0.3s ease-in-out';
  // Use Avsaar's gorgeous signature violet/indigo color for glow
  element.style.boxShadow = '0 0 12px rgba(99, 102, 241, 0.6)';
  element.style.backgroundColor = 'rgba(99, 102, 241, 0.05)';

  setTimeout(() => {
    element.style.boxShadow = originalShadow;
    element.style.backgroundColor = '';
    setTimeout(() => {
      element.style.transition = originalTransition;
    }, 300);
  }, 1000);
};
