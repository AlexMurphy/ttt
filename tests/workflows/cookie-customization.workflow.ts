// ===== TYPESCRIPT IMPORTS WITH TYPE INFORMATION =====
// Import statements bring in types and functionality from external modules

// Importing specific types and functions from Playwright
// 'Page' is a TypeScript interface that defines the structure of a browser page object
// 'expect' is a function for making assertions in tests
import { Page, expect } from '@playwright/test';

// Importing custom classes (these are TypeScript classes we've defined)
import { CookieConsentPage } from '../pages/cookie-consent.page';
import { CookieValidator } from '../utils/cookie.validator';
import { BrowserUtils } from '../utils/browser.utils';
import { CookieConfig } from '../config/cookie.config';

// Importing TypeScript interfaces (type definitions)
// Interfaces define the shape/structure of objects
import { ExpectedCookies } from '../types/cookie.types';

// ===== TYPESCRIPT CLASS DECLARATION =====
// 'export' keyword makes this class available for import in other files
// 'class' is a TypeScript/JavaScript construct for creating reusable object templates
export class CookieCustomizationTest {
  
  // ===== CLASS PROPERTIES WITH TYPESCRIPT ACCESS MODIFIERS =====
  // 'private' means these properties can only be accessed within this class
  // 'readonly' means the property can only be set once (in constructor) and never changed
  
  // TypeScript Type Annotation: ': Page' specifies this property must be a Page type
  private readonly page: Page;
  
  // TypeScript Class Type: CookieConsentPage is a custom class we imported
  private readonly cookieConsentPage: CookieConsentPage;
  
  // TypeScript Union Type: 'string | undefined' means this can be either a string OR undefined
  private readonly platform: string | undefined;
  
  // Simple TypeScript type annotation - this must be a string
  private readonly projectName: string;

  // ===== TYPESCRIPT CONSTRUCTOR =====
  // Constructor is a special method that runs when creating a new instance of the class
  // TypeScript Parameter Types: each parameter has a type annotation
  constructor(page: Page, platform: string | undefined, projectName: string) {
    // 'this' keyword refers to the current instance of the class
    // We're assigning constructor parameters to class properties
    this.page = page;
    
    // TypeScript Class Instantiation: creating a new instance of CookieConsentPage
    // We pass 'page' as a parameter to its constructor
    this.cookieConsentPage = new CookieConsentPage(page);
    
    this.platform = platform;
    this.projectName = projectName;
  }

  // ===== TYPESCRIPT ASYNC METHOD WITH RETURN TYPE =====
  // 'async' keyword means this method returns a Promise
  // 'Promise<void>' means it returns a Promise that doesn't resolve to any value
  // 'void' is TypeScript's way of saying "no return value"
  async execute(): Promise<void> {
    // ===== ASYNC/AWAIT PATTERN EXPLANATION =====
    // 'await' pauses execution until the Promise resolves
    // Each of these methods returns a Promise, so we need await
    
    await this.cookieConsentPage.navigate();
    
    // ===== TYPESCRIPT VARIABLE WITH INFERRED TYPE =====
    // TypeScript automatically infers that 'cookiesBefore' is an array type
    // The actual type will be something like: Array<Cookie> or Cookie[]
    const cookiesBefore = await this.cookieConsentPage.getCookies();
    
    // Perform cookie customization - these are async operations
    await this.cookieConsentPage.openCustomizeModal();
    
    // ===== STATIC METHOD CALLS =====
    // These are static methods (called on the class, not an instance)
    // We pass 'this.page' and 'this.platform' as parameters
    await BrowserUtils.handleDesktopSpecificUI(this.page, this.platform);
    await this.cookieConsentPage.savePreferences();
    
    // Handle browser-specific requirements
    await BrowserUtils.handleBrowserSpecificWaits(this.page, this.projectName);
    await BrowserUtils.waitForNetworkIdle(this.page);
    
    // ===== TYPESCRIPT METHOD WITH SPECIFIC RETURN TYPE =====
    // This method specifically returns a Promise that resolves to a cookie array
    const cookiesAfter = await CookieValidator.waitForConsentCookie(this.page);

    // ===== CALLING PRIVATE METHOD =====
    // This calls another method within the same class (private method)
    await this.validateCookies(cookiesBefore, cookiesAfter);
  }

  // ===== PRIVATE METHOD WITH TYPED PARAMETERS =====
  // 'private' means this method can only be called from within this class
  // 'any[]' is a TypeScript type meaning "array of any type" 
  // (In real code, we'd want more specific types like Cookie[])
  private async validateCookies(cookiesBefore: any[], cookiesAfter: any[]): Promise<void> {
    // ===== TYPESCRIPT STATIC METHOD CALL WITH TYPED RETURN =====
    // This method returns a specific type defined in our types file
    // TypeScript knows the return type is 'ExpectedCookies | undefined' (union type)
    const projectExpectations = CookieConfig.getExpectedCookies(this.projectName);
    
    // ===== TYPESCRIPT TYPE GUARD =====
    // This if statement acts as a "type guard" 
    // After this check, TypeScript knows projectExpectations is NOT undefined
    if (!projectExpectations) {
      // ===== TEMPLATE LITERAL WITH INTERPOLATION =====
      // Backticks (`) allow us to embed variables using ${variable} syntax
      console.log(`\n⚠️  No validation rules defined for project: ${this.projectName}`);
      return; // Early return - exits the method here
    }

    // ===== STATIC METHOD CALLS WITH MULTIPLE PARAMETERS =====
    // These methods are called on the class itself, not an instance
    CookieValidator.logCookieValidation(this.projectName, cookiesBefore, cookiesAfter, projectExpectations);
    
    // ===== VARIABLE WITH INFERRED TYPE FROM METHOD RETURN =====
    // TypeScript infers the type from the method's return type
    const validationResult = CookieValidator.validateCookies(cookiesAfter, projectExpectations);
    
    // ===== CALLING PRIVATE METHODS WITH PARAMETERS =====
    // These are methods defined later in this same class
    this.assertRequiredCookies(validationResult, cookiesAfter);
    
    // Validate consent cookie functionality
    await this.validateConsentCookie(cookiesAfter);
    
    console.log('\n✅ All required cookies validated successfully!');
  }

  // ===== PRIVATE METHOD WITH TYPED PARAMETERS =====
  // 'any' type is used here but in production code we'd use specific interfaces
  private assertRequiredCookies(validationResult: any, cookiesAfter: any[]): void {
    // ===== TYPESCRIPT PROPERTY ACCESS AND TYPE CHECKING =====
    // Accessing the 'isValid' property from the validationResult object
    if (!validationResult.isValid) {
      // ===== ARRAY METHOD WITH TYPESCRIPT =====
      // '.join()' is a JavaScript/TypeScript array method that combines array elements into a string
      // TypeScript knows 'missingRequired' is an array because of the method return type
      console.log(`\n⚠️  Missing required cookies: ${validationResult.missingRequired.join(', ')}`);
      
      // ===== ARRAY MAP METHOD WITH TYPESCRIPT =====
      // '.map()' transforms each array element using the provided function
      // TypeScript Arrow Function: (c) => ... is a concise function syntax
      // 'c' represents each cookie object in the array
      const availableCookies = cookiesAfter.map(c => `${c.name}@${c.domain}`).join(', ');
      console.log(`Available cookies: ${availableCookies}`);
      
      // ===== FOR...OF LOOP WITH TYPESCRIPT =====
      // This loops through each element in the missingRequired array
      // TypeScript knows each 'missingCookie' is a string type
      for (const missingCookie of validationResult.missingRequired) {
        // ===== PLAYWRIGHT EXPECT ASSERTION =====
        // This is a test assertion - if the condition fails, the test fails
        // The first parameter is what we're testing (false = failure condition)
        // The second parameter is the error message if the assertion fails
        expect(false, `Required cookie ${missingCookie} should be present after customization. Available cookies: ${availableCookies}`).toBe(true);
      }
    }
  }

  // ===== ASYNC PRIVATE METHOD =====
  // This method returns Promise<void> because it's async but doesn't return a value
  private async validateConsentCookie(cookiesAfter: any[]): Promise<void> {
    // ===== TYPESCRIPT ARRAY.SOME() METHOD =====
    // '.some()' returns a boolean - true if ANY element passes the test function
    // TypeScript Arrow Function with implicit return (no {} braces means return the expression)
    const consentCookieUpdated = cookiesAfter.some(cookie => 
      // ===== LOGICAL AND OPERATOR WITH METHOD CHAINING =====
      // Both conditions must be true: correct name AND value contains 'consent:yes'
      // '.includes()' is a string method that returns boolean
      cookie.name === CookieConfig.CONSENT_COOKIE_NAME && cookie.value.includes('consent:yes')
    );
    
    // ===== TYPESCRIPT TERNARY OPERATOR =====
    // condition ? valueIfTrue : valueIfFalse
    // TypeScript knows this will result in a string type
    console.log(`   ${consentCookieUpdated ? '✅' : '❌'} Consent cookie updated: ${consentCookieUpdated}`);
    
    // ===== PLAYWRIGHT EXPECT WITH BOOLEAN ASSERTION =====
    expect(consentCookieUpdated, 'Consent cookie should be updated after customization').toBe(true);
    
    // ===== STATIC METHOD CALL WITH TYPED RETURN =====
    // This method returns a specific interface type defined in our types file
    const consentContent = CookieValidator.validateConsentCookieContent(cookiesAfter);
    CookieValidator.logConsentCookieValidation(consentContent);
    
    // ===== OBJECT PROPERTY ACCESS WITH TYPESCRIPT =====
    // TypeScript knows these properties exist because of the interface definition
    // These properties are boolean types
    expect(consentContent.hasYesConsent, 'Consent cookie should contain consent:yes').toBe(true);
    expect(consentContent.hasYesAction, 'Consent cookie should contain action:yes').toBe(true);
    expect(consentContent.hasYesNecessary, 'Consent cookie should contain necessary:yes').toBe(true);
  }
}

// ===== END OF CLASS DEFINITION =====
// The closing brace marks the end of the CookieCustomizationTest class
