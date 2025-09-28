// Cookie utility functions
export const setCookie = (name: string, value: string, days: number = 7): void => {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  
  // Get current domain
  const domain = window.location.hostname === 'localhost' ? undefined : `.${window.location.hostname}`;
  
  // Build cookie string with proper attributes
  let cookieString = `${name}=${value};expires=${expires.toUTCString()};path=/`;
  
  // Add domain if not localhost
  if (domain) {
    cookieString += `;domain=${domain}`;
  }
  
  // Add secure flag for HTTPS
  if (window.location.protocol === 'https:') {
    cookieString += ';secure';
  }
  
  // Add SameSite attribute
  cookieString += ';SameSite=Lax';
  
  document.cookie = cookieString;
};

export const getCookie = (name: string): string | null => {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

export const removeCookie = (name: string): void => {
  const domain = window.location.hostname === 'localhost' ? undefined : `.${window.location.hostname}`;
  let cookieString = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`;
  
  if (domain) {
    cookieString += `;domain=${domain}`;
  }
  
  document.cookie = cookieString;
};

export const clearAllCookies = (): void => {
  const cookies = document.cookie.split(";");
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i];
    const eqPos = cookie.indexOf("=");
    const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
    removeCookie(name);
  }
};

// Check if cookies are enabled
export const areCookiesEnabled = (): boolean => {
  try {
    document.cookie = "testCookie=1";
    const hasCookie = document.cookie.indexOf("testCookie=") !== -1;
    document.cookie = "testCookie=1;expires=Thu, 01 Jan 1970 00:00:00 UTC";
    return hasCookie;
  } catch (e) {
    return false;
  }
};
