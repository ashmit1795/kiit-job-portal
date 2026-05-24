/**
 * Programmatically inputs a value into React/Closure-controlled HTML input fields
 * by calling their native prototype setters and firing appropriate bubbles events.
 */
export const setNativeValue = (
  element: HTMLInputElement | HTMLTextAreaElement,
  value: string
): void => {
  try {
    let prototype: any = null;

    if (element instanceof HTMLInputElement) {
      prototype = window.HTMLInputElement.prototype;
    } else if (element instanceof HTMLTextAreaElement) {
      prototype = window.HTMLTextAreaElement.prototype;
    }

    if (!prototype) return;

    const valueSetter = Object.getOwnPropertyDescriptor(prototype, 'value')?.set;
    
    if (valueSetter) {
      // Call the prototype setter to bypass the Virtual DOM wrapper
      valueSetter.call(element, value);
    } else {
      // Standard value assign fallback
      element.value = value;
    }

    // Trigger state binding updates inside frameworks (React, Angular, Closure, etc.)
    const inputEvent = new Event('input', { bubbles: true, cancelable: true });
    element.dispatchEvent(inputEvent);

    const changeEvent = new Event('change', { bubbles: true, cancelable: true });
    element.dispatchEvent(changeEvent);

    const blurEvent = new Event('blur', { bubbles: true, cancelable: true });
    element.dispatchEvent(blurEvent);
  } catch (error) {
    console.error('Failed to set native input value programmatically:', error);
    // Simple fallback
    element.value = value;
  }
};
