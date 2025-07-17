import { ExpectedCookies } from '../types/cookie.types';

export class CookieConfig {
  static readonly CONSENT_COOKIE_NAME = 'cookieyes-consent';
  static readonly WWW_DOMAIN = '.www.thethinkingtraveller.com';
  static readonly BASE_DOMAIN = '.thethinkingtraveller.com';
  
  // Centralized cookie expectations configuration
  static readonly COOKIE_EXPECTATIONS: { [key: string]: ExpectedCookies } = {
    'chromium': {
      requiredCookies: [
        `${CookieConfig.CONSENT_COOKIE_NAME}@${CookieConfig.WWW_DOMAIN}`,
        `_clck@${CookieConfig.BASE_DOMAIN}`
      ],
      optionalCookies: [
        `tttdemorepath-_zldp@${CookieConfig.BASE_DOMAIN}`,
        `tttdemorepath-_zldt@${CookieConfig.BASE_DOMAIN}`,
        `_uetsid@${CookieConfig.BASE_DOMAIN}`,
        `_uetvid@${CookieConfig.BASE_DOMAIN}`
      ]
    },
    'webkit': {
      requiredCookies: [
        `${CookieConfig.CONSENT_COOKIE_NAME}@${CookieConfig.WWW_DOMAIN}`,
        `_clck@${CookieConfig.BASE_DOMAIN}`
      ],
      optionalCookies: [
        `tttdemorepath-_zldp@${CookieConfig.BASE_DOMAIN}`,
        `tttdemorepath-_zldt@${CookieConfig.BASE_DOMAIN}`,
        `_uetsid@${CookieConfig.BASE_DOMAIN}`,
        `_uetvid@${CookieConfig.BASE_DOMAIN}`
      ]
    },
    'firefox': {
      requiredCookies: [
        `${CookieConfig.CONSENT_COOKIE_NAME}@${CookieConfig.WWW_DOMAIN}`,
        `_clck@${CookieConfig.BASE_DOMAIN}`
      ],
      optionalCookies: [
        `tttdemorepath-_zldp@${CookieConfig.BASE_DOMAIN}`,
        `tttdemorepath-_zldt@${CookieConfig.BASE_DOMAIN}`,
        `_uetsid@${CookieConfig.BASE_DOMAIN}`,
        `_uetvid@${CookieConfig.BASE_DOMAIN}`
      ]
    },
    'Microsoft Edge': {
      requiredCookies: [
        `${CookieConfig.CONSENT_COOKIE_NAME}@${CookieConfig.WWW_DOMAIN}`,
        `_clck@${CookieConfig.BASE_DOMAIN}`
      ],
      optionalCookies: [
        `tttdemorepath-_zldp@${CookieConfig.BASE_DOMAIN}`,
        `tttdemorepath-_zldt@${CookieConfig.BASE_DOMAIN}`,
        `_uetsid@${CookieConfig.BASE_DOMAIN}`,
        `_uetvid@${CookieConfig.BASE_DOMAIN}`
      ]
    },
    'Mobile Chrome': {
      requiredCookies: [
        `${CookieConfig.CONSENT_COOKIE_NAME}@${CookieConfig.WWW_DOMAIN}`,
        `_clck@${CookieConfig.BASE_DOMAIN}`
      ],
      optionalCookies: [
        `tttdemorepath-_zldp@${CookieConfig.BASE_DOMAIN}`,
        `tttdemorepath-_zldt@${CookieConfig.BASE_DOMAIN}`
      ]
    },
    'Mobile Safari': {
      requiredCookies: [
        `${CookieConfig.CONSENT_COOKIE_NAME}@${CookieConfig.WWW_DOMAIN}`,
        `_clck@${CookieConfig.BASE_DOMAIN}`
      ],
      optionalCookies: [
        `tttdemorepath-_zldp@${CookieConfig.BASE_DOMAIN}`,
        `tttdemorepath-_zldt@${CookieConfig.BASE_DOMAIN}`
      ]
    }
  };

  static getExpectedCookies(projectName: string): ExpectedCookies | null {
    return this.COOKIE_EXPECTATIONS[projectName] || null;
  }
}
