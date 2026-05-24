import contentStyles from './content.css?inline';
import { getProfile, defaultProfile, StudentProfile } from '../storage/chromeStorage';
import { parseGoogleForm, autofillQuestion, FormQuestion } from '../parser/googleFormsParser';

// Encapsulate all elements under a Shadow DOM to prevent CSS collision
let shadowRoot: ShadowRoot | null = null;
let shadowContainer: HTMLElement | null = null;

let isAutofillActive = false; // Tracks if the user has clicked "Fill Form" in the current session
let isCurrentlyFilling = false; // Prevents recursive loop inside MutationObserver
const processedQuestionLabels = new Set<string>(); // Tracks processed questions on current page to avoid loops
let currentProfile: StudentProfile = { ...defaultProfile };

// Track parsed results
interface FilledFieldDetail {
  label: string;
  value: string;
  confidence: number;
  type: 'filled' | 'low' | 'unmatched';
}

let sessionResults = {
  total: 0,
  filled: 0,
  low: 0,
  unmatched: 0,
  details: [] as FilledFieldDetail[]
};

/**
 * Initializes the Avsaar Autofill Assistant UI.
 */
const init = async () => {
  // Avoid duplicate injection
  if (document.getElementById('avsaar-autofill-root')) return;

  // 1. Fetch the user's student profile
  currentProfile = await getProfile();
  
  // 2. Create the Shadow Host element
  shadowContainer = document.createElement('div');
  shadowContainer.id = 'avsaar-autofill-root';
  shadowContainer.style.position = 'fixed';
  shadowContainer.style.top = '0';
  shadowContainer.style.left = '0';
  shadowContainer.style.width = '100%';
  shadowContainer.style.height = '100%';
  shadowContainer.style.pointerEvents = 'none'; // Click through everything by default
  shadowContainer.style.zIndex = '2147483647'; // Max z-index
  document.body.appendChild(shadowContainer);

  // 3. Attach Shadow DOM
  shadowRoot = shadowContainer.attachShadow({ mode: 'open' });

  // 4. Inject styles into Shadow DOM
  const styleEl = document.createElement('style');
  styleEl.textContent = contentStyles;
  shadowRoot.appendChild(styleEl);

  // 5. Construct Floating Action Button
  createFAB();

  // 6. Construct Side Review Panel
  createReviewPanel();

  // 7. Construct Toast notifications element
  createToastContainer();

  // 8. Attach Observer to auto-fill dynamic sections (Multi-page support)
  setupMultiPageObserver();
};

/**
 * Creates the sleek violet Floating Action Button.
 */
const createFAB = () => {
  if (!shadowRoot) return;

  const fabContainer = document.createElement('div');
  fabContainer.className = 'avsaar-fab-container';
  
  const fab = document.createElement('button');
  fab.className = 'avsaar-fab';
  fab.innerHTML = `<span class="avsaar-fab-icon">⚡</span> Fill Placement Form`;
  fab.addEventListener('click', handleFillAction);

  // Small dismiss button (SaaS style)
  const closeBtn = document.createElement('button');
  closeBtn.className = 'avsaar-fab-close';
  closeBtn.innerHTML = '✕';
  closeBtn.title = 'Hide assistant';
  closeBtn.addEventListener('click', () => {
    fabContainer.style.display = 'none';
  });

  fabContainer.appendChild(fab);
  fabContainer.appendChild(closeBtn);
  shadowRoot.appendChild(fabContainer);
};

/**
 * Creates the custom-styled slide-out Side Review Panel.
 */
const createReviewPanel = () => {
  if (!shadowRoot) return;

  // Background overlay
  const overlay = document.createElement('div');
  overlay.className = 'avsaar-panel-overlay';
  overlay.id = 'avsaar-overlay';
  overlay.addEventListener('click', closePanel);

  // Main panel
  const panel = document.createElement('div');
  panel.className = 'avsaar-panel';
  panel.id = 'avsaar-panel';

  // Panel Header
  const header = document.createElement('div');
  header.className = 'avsaar-panel-header';
  
  header.innerHTML = `
    <div class="avsaar-brand-group">
      <div class="avsaar-brand-logo">A</div>
      <div>
        <h1 class="avsaar-brand-title">Avsaar Autofill</h1>
        <div class="avsaar-brand-subtitle">Smart Placement Assistant</div>
      </div>
    </div>
  `;

  const closeBtn = document.createElement('button');
  closeBtn.className = 'avsaar-panel-close';
  closeBtn.innerHTML = '✕';
  closeBtn.addEventListener('click', closePanel);
  header.appendChild(closeBtn);

  // Panel Body
  const body = document.createElement('div');
  body.className = 'avsaar-panel-body';
  body.id = 'avsaar-panel-body';

  // Panel Footer
  const footer = document.createElement('div');
  footer.className = 'avsaar-panel-footer';

  const refillBtn = document.createElement('button');
  refillBtn.className = 'avsaar-btn avsaar-btn-secondary';
  refillBtn.innerHTML = '🔄 Re-scan & Fill';
  refillBtn.addEventListener('click', () => {
    closePanel();
    setTimeout(handleFillAction, 300);
  });

  const doneBtn = document.createElement('button');
  doneBtn.className = 'avsaar-btn avsaar-btn-primary';
  doneBtn.innerHTML = '✓ Verify & Complete';
  doneBtn.addEventListener('click', () => {
    closePanel();
    showToast('Form successfully populated!');
  });

  footer.appendChild(refillBtn);
  footer.appendChild(doneBtn);

  panel.appendChild(header);
  panel.appendChild(body);
  panel.appendChild(footer);

  shadowRoot.appendChild(overlay);
  shadowRoot.appendChild(panel);
};

/**
 * Creates a container for micro-toasts.
 */
let toastEl: HTMLElement | null = null;
const createToastContainer = () => {
  if (!shadowRoot) return;
  toastEl = document.createElement('div');
  toastEl.className = 'avsaar-toast';
  shadowRoot.appendChild(toastEl);
};

/**
 * Triggers a beautiful toast notification.
 */
const showToast = (message: string) => {
  if (!toastEl) return;
  toastEl.innerHTML = `<span class="avsaar-toast-icon">✓</span> ${message}`;
  toastEl.classList.add('active');
  setTimeout(() => {
    toastEl?.classList.remove('active');
  }, 3500);
};

/**
 * Opens the sliding Side Review Panel.
 */
const openPanel = () => {
  if (!shadowRoot) return;
  shadowRoot.getElementById('avsaar-overlay')?.classList.add('active');
  shadowRoot.getElementById('avsaar-panel')?.classList.add('active');
};

/**
 * Closes the sliding Side Review Panel.
 */
const closePanel = () => {
  if (!shadowRoot) return;
  shadowRoot.getElementById('avsaar-overlay')?.classList.remove('active');
  shadowRoot.getElementById('avsaar-panel')?.classList.remove('active');
};

/**
 * Standard trigger when a user clicks the "Fill Placement Form" FAB.
 */
const handleFillAction = async () => {
  if (isCurrentlyFilling) return;
  isCurrentlyFilling = true;
  isAutofillActive = true;
  currentProfile = await getProfile();

  // Clear previously processed question labels for the new scan session
  processedQuestionLabels.clear();

  // Parse questions in Google Forms
  const questions = parseGoogleForm();
  if (questions.length === 0) {
    showToast('No form fields detected. Ensure this is a standard Google Form.');
    isCurrentlyFilling = false;
    return;
  }

  // Clear any existing processed attributes to allow full fresh manual filling
  questions.forEach(q => q.container.removeAttribute('data-avsaar-processed'));

  // Reset counters
  sessionResults = {
    total: questions.length,
    filled: 0,
    low: 0,
    unmatched: 0,
    details: [] as FilledFieldDetail[]
  };

  try {
    // Sequentially fill each detected question, adding critical spacing for custom dropdown popovers!
    for (const q of questions) {
      // Mark element as processed in the DOM to prevent dynamic MutationObserver feedback loops
      q.container.setAttribute('data-avsaar-processed', 'true');
      processedQuestionLabels.add(q.label);
      const res = await autofillQuestion(q, currentProfile);
      
      if (res.filled) {
        if (res.confidence >= 0.8) {
          sessionResults.filled++;
          sessionResults.details.push({
            label: q.label,
            value: res.filledValue || '',
            confidence: res.confidence,
            type: 'filled'
          });
        } else {
          sessionResults.low++;
          sessionResults.details.push({
            label: q.label,
            value: res.filledValue || '',
            confidence: res.confidence,
            type: 'low'
          });
        }
      } else {
        sessionResults.unmatched++;
        sessionResults.details.push({
          label: q.label,
          value: '',
          confidence: 0,
          type: 'unmatched'
        });
      }
      
      // Delay before next element. Dropdowns require longer spacing to close their body popovers!
      if (q.type === 'dropdown') {
        await new Promise(resolve => setTimeout(resolve, 500));
      } else {
        await new Promise(resolve => setTimeout(resolve, 50));
      }
    }
  } catch (error) {
    console.error('Autofill sequence error:', error);
  } finally {
    isCurrentlyFilling = false;
  }

  // Update Review Panel and open it
  populateReviewPanel();
  openPanel();
};

/**
 * Formulates lists and progress bar inside the Side Review Panel.
 */
const populateReviewPanel = () => {
  if (!shadowRoot) return;
  const body = shadowRoot.getElementById('avsaar-panel-body');
  if (!body) return;

  const matchPercent = sessionResults.total > 0 
    ? Math.round(((sessionResults.filled + sessionResults.low) / sessionResults.total) * 100) 
    : 0;

  // Clear existing body
  body.innerHTML = '';

  // 1. Completion metrics card
  const statCard = document.createElement('div');
  statCard.className = 'avsaar-stat-card';
  statCard.innerHTML = `
    <div class="avsaar-stat-row">
      <span class="avsaar-stat-title">Matching Success</span>
      <span class="avsaar-stat-value">${matchPercent}%</span>
    </div>
    <div class="avsaar-stat-bar-bg">
      <div class="avsaar-stat-bar-fill" style="width: ${matchPercent}%"></div>
    </div>
    <div class="avsaar-mini-stats">
      <div class="avsaar-mini-stat-item">
        <div class="avsaar-mini-stat-label">Autofilled</div>
        <div class="avsaar-mini-stat-num filled">${sessionResults.filled}</div>
      </div>
      <div class="avsaar-mini-stat-item">
        <div class="avsaar-mini-stat-label">Warnings</div>
        <div class="avsaar-mini-stat-num low">${sessionResults.low}</div>
      </div>
      <div class="avsaar-mini-stat-item">
        <div class="avsaar-mini-stat-label">Unmatched</div>
        <div class="avsaar-mini-stat-num unmatched">${sessionResults.unmatched}</div>
      </div>
    </div>
  `;
  body.appendChild(statCard);

  // 2. Map groups
  const filledFields = sessionResults.details.filter(d => d.type === 'filled');
  const lowFields = sessionResults.details.filter(d => d.type === 'low');
  const unmatchedFields = sessionResults.details.filter(d => d.type === 'unmatched');

  // Warnings / Low confidence first (SaaS UX)
  if (lowFields.length > 0) {
    const lowSection = document.createElement('div');
    lowSection.innerHTML = `<h2 class="avsaar-section-title">⚠️ Review Low Confidence (${lowFields.length})</h2>`;
    const list = document.createElement('div');
    list.className = 'avsaar-field-list';
    
    lowFields.forEach(f => {
      const item = document.createElement('div');
      item.className = 'avsaar-field-item';
      item.innerHTML = `
        <div class="avsaar-field-info">
          <span class="avsaar-field-label" title="${f.label}">${f.label}</span>
          <span class="avsaar-field-value" title="${f.value}">${f.value}</span>
        </div>
        <span class="avsaar-field-badge low">${Math.round(f.confidence * 100)}% Match</span>
      `;
      list.appendChild(item);
    });
    
    lowSection.appendChild(list);
    body.appendChild(lowSection);
  }

  // Filled Fields
  if (filledFields.length > 0) {
    const filledSection = document.createElement('div');
    filledSection.innerHTML = `<h2 class="avsaar-section-title">✓ Filled Successfully (${filledFields.length})</h2>`;
    const list = document.createElement('div');
    list.className = 'avsaar-field-list';

    filledFields.forEach(f => {
      const item = document.createElement('div');
      item.className = 'avsaar-field-item';
      item.innerHTML = `
        <div class="avsaar-field-info">
          <span class="avsaar-field-label" title="${f.label}">${f.label}</span>
          <span class="avsaar-field-value" title="${f.value}">${f.value}</span>
        </div>
        <span class="avsaar-field-badge filled">Autofilled</span>
      `;
      list.appendChild(item);
    });

    filledSection.appendChild(list);
    body.appendChild(filledSection);
  }

  // Unmatched Fields
  if (unmatchedFields.length > 0) {
    const unmatchedSection = document.createElement('div');
    unmatchedSection.innerHTML = `<h2 class="avsaar-section-title">✕ Empty / Unmatched Fields (${unmatchedFields.length})</h2>`;
    const list = document.createElement('div');
    list.className = 'avsaar-field-list';

    unmatchedFields.forEach(f => {
      const item = document.createElement('div');
      item.className = 'avsaar-field-item';
      item.innerHTML = `
        <div class="avsaar-field-info">
          <span class="avsaar-field-label" title="${f.label}">${f.label}</span>
          <span class="avsaar-field-value">No saved profile field matched this question.</span>
        </div>
        <span class="avsaar-field-badge unmatched">Manual Fill</span>
      `;
      list.appendChild(item);
    });

    unmatchedSection.appendChild(list);
    body.appendChild(unmatchedSection);
  }
};

/**
 * Sets up a MutationObserver to listen for Google Forms page transitions (multi-page).
 */
const setupMultiPageObserver = () => {
  const formContent = document.body;
  if (!formContent) return;

  let debounceTimer: any = null;

  const observer = new MutationObserver(() => {
    // CRITICAL: Bypasses observations if we are already programmatically modifying the DOM!
    if (isCurrentlyFilling) return;

    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      // Re-verify if we aren't already filling to avoid late debounced clashing
      if (isCurrentlyFilling) return;

      const currentQuestions = parseGoogleForm();
      
      // CRITICAL LOOP BLOCKER: Filter out questions that have already been filled on this page
      const newQuestions = currentQuestions.filter(q => !q.container.hasAttribute('data-avsaar-processed'));
      
      // If we are currently in an active autofill session (user clicked fill once)
      // and brand-new questions appear (e.g. they clicked next page), we auto-trigger filling!
      if (isAutofillActive && newQuestions.length > 0) {
        // Run a silent autofill on the new questions without showing the review panel automatically
        silentAutofill(newQuestions);
      }
    }, 400);
  });

  observer.observe(formContent, {
    childList: true,
    subtree: true
  });
};

/**
 * Silently autofills fields (triggered on page transition) with the premium violet highlight.
 */
const silentAutofill = async (questions: FormQuestion[]) => {
  if (isCurrentlyFilling) return;
  isCurrentlyFilling = true;
  let filledAny = false;
  
  try {
    for (const q of questions) {
      // Mark element as processed in the DOM immediately to prevent MutationObserver triggers
      q.container.setAttribute('data-avsaar-processed', 'true');
      processedQuestionLabels.add(q.label);

      // Only fill fields that are not already completed (empty value)
      const isInputTextEmpty = q.inputElement instanceof HTMLInputElement && !q.inputElement.value;
      const isTextareaEmpty = q.inputElement instanceof HTMLTextAreaElement && !q.inputElement.value;
      const isDropdownSelectable = q.type === 'dropdown' && q.inputElement.textContent?.includes('Choose');

      if (isInputTextEmpty || isTextareaEmpty || isDropdownSelectable || q.type === 'radio') {
        const res = await autofillQuestion(q, currentProfile);
        if (res.filled) {
          filledAny = true;
        }
      }

      // Spacing delay before next element. Dropdowns require longer spacing (500ms) to finish their closing animations!
      if (q.type === 'dropdown') {
        await new Promise(resolve => setTimeout(resolve, 500));
      } else {
        await new Promise(resolve => setTimeout(resolve, 50));
      }
    }
  } catch (error) {
    console.error('Silent autofill error:', error);
  } finally {
    isCurrentlyFilling = false;
  }

  if (filledAny) {
    showToast('Avsaar auto-populated this section for you!');
  }
};

// Run script
init();
