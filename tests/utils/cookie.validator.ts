// ===== TYPESCRIPT IMPORTS WITH TYPE INFORMATION =====
// Import statements bring in types and functionality from external modules

// Importing the 'Page' interface from Playwright
// 'Page' is a TypeScript interface that defines all the properties and methods available on a browser page
import { Page } from '@playwright/test';

// Importing custom TypeScript interfaces we defined
// These interfaces define the exact structure/shape that objects must have
import { ExpectedCookies, CookieValidationResult, ConsentCookieContent } from '../types/cookie.types';

// Importing a custom class for configuration
import { CookieConfig } from '../config/cookie.config';

// ===== TYPESCRIPT CLASS WITH STATIC METHODS =====
// 'export' makes this class available for import in other files
// 'class' is a TypeScript/JavaScript construct for grouping related functionality
export class CookieValidator {
  
  // ===== STATIC ASYNC METHOD WITH TYPESCRIPT PARAMETERS =====
  // 'static' means this method belongs to the class itself, not to instances of the class
  // 'async' means this method returns a Promise and can use 'await' inside
  // TypeScript Parameter Types:
  // - page: Page = must be a Playwright Page object
  // - maxRetries: number = 3 = optional parameter with default value of 3
  // Return Type: Promise<any[]> = Promise that resolves to an array of any type
  static async waitForConsentCookie(page: Page, maxRetries: number = 3): Promise<any[]> {
    
    // ===== TYPESCRIPT VARIABLE DECLARATIONS =====
    // TypeScript can infer types, but let's explain what these become:
    
    // 'let' allows the variable to be reassigned later
    // TypeScript infers this will be 'any[] | undefined' initially
    let cookiesAfter;
    
    // TypeScript knows this is 'number' type from initialization
    let retryCount = 0;
    
    // ===== DO-WHILE LOOP EXPLANATION =====
    // This loop runs at least once, then continues while the condition is true
    do {
      // ===== ASYNC METHOD CHAINING WITH TYPESCRIPT =====
      // page.context() returns a BrowserContext object
      // .cookies() is an async method that returns Promise<Cookie[]>
      // 'await' waits for the Promise to resolve, giving us the actual Cookie array
      cookiesAfter = await page.context().cookies();
      
      // ===== TYPESCRIPT ARRAY.SOME() WITH ARROW FUNCTION =====
      // .some() is a TypeScript/JavaScript array method that returns boolean
      // It tests whether ANY element in the array passes the test function
      // Arrow function: (cookie) => ... is a concise way to write a function
      // TypeScript knows 'cookie' is of type Cookie from the array
      const consentCookieSet = cookiesAfter.some(cookie => 
        // ===== LOGICAL AND OPERATOR (&&) =====
        // Both conditions must be true for the overall expression to be true
        // .includes() is a string method that returns boolean
        cookie.name === CookieConfig.CONSENT_COOKIE_NAME && cookie.value.includes('consent:yes')
      );
      
      // ===== LOGICAL OR OPERATOR (||) IN CONDITIONAL =====
      // If EITHER condition is true, the if block executes
      if (consentCookieSet || retryCount >= maxRetries) {
        break; // 'break' exits the loop immediately
      }
      
      // ===== TEMPLATE LITERAL WITH EXPRESSION =====
      // Backticks allow embedding expressions with ${expression} syntax
      // TypeScript knows retryCount is number, so retryCount + 1 is also number
      console.log(`Retry ${retryCount + 1}: Waiting for consent cookie to be properly set...`);
      
      // ===== PLAYWRIGHT ASYNC METHOD =====
      // Waits for specified milliseconds before continuing
      await page.waitForTimeout(1000);
      
      // ===== INCREMENT OPERATOR =====
      // ++ is shorthand for retryCount = retryCount + 1
      retryCount++;
      
    } while (retryCount < maxRetries); // Continue while this condition is true
    
    // ===== RETURN STATEMENT WITH TYPE =====
    // Returns the cookiesAfter array, which matches our Promise<any[]> return type
    return cookiesAfter;
  }

  // ===== STATIC METHOD WITH TYPED PARAMETERS AND RETURN =====
  // Static method = called on the class itself (CookieValidator.validateCookies())
  // Parameter Types:
  // - cookies: any[] = array of cookie objects (any type for flexibility)
  // - expectations: ExpectedCookies = must match our custom interface structure
  // Return Type: CookieValidationResult = must match our custom interface structure
  static validateCookies(cookies: any[], expectations: ExpectedCookies): CookieValidationResult {
    
    // ===== ARRAY MAP METHOD WITH TYPESCRIPT =====
    // .map() transforms each element in the array using the provided function
    // Arrow function: c => ... where 'c' represents each cookie object
    // Template literal creates a string combining name and domain
    // TypeScript infers this creates string[] (array of strings)
    const cookieKeys = cookies.map(c => `${c.name}@${c.domain}`);
    
    // ===== TYPESCRIPT ARRAY WITH TYPE ANNOTATION =====
    // Explicitly declaring this as an array of strings
    // Starting with empty array that will be populated
    const missingRequired: string[] = [];
    
    // ===== FOR...OF LOOP WITH TYPESCRIPT =====
    // Loops through each element in the requiredCookies array
    // TypeScript knows each 'requiredCookie' is a string (from the interface)
    for (const requiredCookie of expectations.requiredCookies) {
      // ===== ARRAY INCLUDES METHOD WITH NEGATION =====
      // .includes() checks if the array contains the specified element
      // ! operator negates the result (true becomes false, false becomes true)
      if (!cookieKeys.includes(requiredCookie)) {
        // ===== ARRAY PUSH METHOD =====
        // Adds the element to the end of the array
        missingRequired.push(requiredCookie);
      }
    }
    
    // ===== TYPESCRIPT VARIABLE WITH TYPE INFERENCE =====
    // TypeScript automatically infers this is 'number' type from initialization
    let foundOptional = 0;
    
    // ===== OPTIONAL PROPERTY ACCESS WITH TYPE GUARD =====
    // Since optionalCookies is marked with '?' in the interface, it might be undefined
    // This if statement acts as a "type guard" - after this check, TypeScript knows it exists
    if (expectations.optionalCookies) {
      // Inside this block, TypeScript knows optionalCookies is NOT undefined
      for (const optionalCookie of expectations.optionalCookies) {
        if (cookieKeys.includes(optionalCookie)) {
          // ===== INCREMENT OPERATOR =====
          foundOptional++;
        }
      }
    }
    
    // ===== RETURNING OBJECT THAT MATCHES INTERFACE =====
    // This object must match the CookieValidationResult interface exactly
    return {
      // ===== COMPARISON EXPRESSION RETURNING BOOLEAN =====
      // .length === 0 evaluates to true/false, matching isValid: boolean requirement
      isValid: missingRequired.length === 0,
      
      // ===== SHORTHAND PROPERTY SYNTAX =====
      // When property name matches variable name, we can use shorthand
      // missingRequired: missingRequired becomes just missingRequired
      missingRequired,
      foundOptional,
      
      // ===== OPTIONAL CHAINING WITH NULLISH COALESCING =====
      // ?. safely accesses length property (returns undefined if optionalCookies is undefined)
      // || 0 provides a default value of 0 if the left side is undefined/null
      totalOptional: expectations.optionalCookies?.length || 0
    };
  }

  // ===== STATIC METHOD RETURNING SPECIFIC INTERFACE TYPE =====
  // Takes an array of cookies and returns an object matching ConsentCookieContent interface
  static validateConsentCookieContent(cookies: any[]): ConsentCookieContent {
    
    // ===== ARRAY FIND METHOD WITH TYPESCRIPT =====
    // .find() returns the FIRST element that matches the condition, or undefined if none found
    // Arrow function tests each cookie against the condition
    // TypeScript infers the result type as: any | undefined (union type)
    const consentCookie = cookies.find(cookie => cookie.name === CookieConfig.CONSENT_COOKIE_NAME);
    
    // ===== TYPE GUARD WITH EARLY RETURN =====
    // This if statement acts as a type guard
    // If consentCookie is undefined/null, we return a default object
    if (!consentCookie) {
      // ===== OBJECT LITERAL MATCHING INTERFACE =====
      // This object must have exactly the properties defined in ConsentCookieContent interface
      return {
        hasYesConsent: false,
        hasYesAction: false,
        hasYesNecessary: false
      };
    }
    
    // ===== OBJECT WITH COMPUTED PROPERTIES =====
    // After the type guard, TypeScript knows consentCookie is NOT undefined
    // Each property value is computed using the .includes() string method
    return {
      // ===== STRING INCLUDES METHOD RETURNING BOOLEAN =====
      // .includes() checks if the string contains the specified substring
      // Returns boolean, which matches the interface requirement
      hasYesConsent: consentCookie.value.includes('consent:yes'),
      hasYesAction: consentCookie.value.includes('action:yes'),
      hasYesNecessary: consentCookie.value.includes('necessary:yes')
    };
  }

  // ===== STATIC METHOD WITH VOID RETURN TYPE =====
  // 'void' means this method doesn't return anything (just performs actions)
  // All parameters have specific TypeScript types
  static logCookieValidation(projectName: string, cookiesBefore: any[], cookiesAfter: any[], expectations: ExpectedCookies): void {
    
    // ===== TEMPLATE LITERALS WITH EMBEDDED EXPRESSIONS =====
    // Backticks allow embedding variables and expressions using ${} syntax
    console.log(`\n🔍 Validating cookies for ${projectName}...`);
    
    // ===== ARITHMETIC EXPRESSIONS IN TEMPLATE LITERALS =====
    // TypeScript can perform calculations inside template literals
    // .length property returns number, so arithmetic operations work
    console.log(`📊 Cookie count: ${cookiesBefore.length} → ${cookiesAfter.length} (change: ${cookiesAfter.length - cookiesBefore.length})`);
    
    // ===== REUSING ARRAY MAP TRANSFORMATION =====
    // Same pattern as before - transforming cookie objects to strings
    const cookieKeys = cookiesAfter.map(c => `${c.name}@${c.domain}`);
    
    // ===== ITERATING OVER INTERFACE PROPERTY =====
    // requiredCookies comes from the ExpectedCookies interface
    // TypeScript knows this is string[] (array of strings)
    for (const requiredCookie of expectations.requiredCookies) {
      // ===== BOOLEAN VARIABLE WITH DESCRIPTIVE NAME =====
      const isPresent = cookieKeys.includes(requiredCookie);
      
      // ===== TERNARY OPERATOR FOR CONDITIONAL VALUES =====
      // condition ? valueIfTrue : valueIfFalse
      // TypeScript evaluates this to return string type
      console.log(`   ${isPresent ? '✅' : '❌'} ${requiredCookie}: ${isPresent ? 'FOUND' : 'MISSING'} (required)`);
    }
    
    // ===== OPTIONAL PROPERTY HANDLING =====
    // Since optionalCookies might be undefined (marked with ? in interface)
    // we need to check if it exists before using it
    if (expectations.optionalCookies) {
      // ===== VARIABLE SCOPED TO BLOCK =====
      // This variable only exists within this if block
      let optionalFound = 0;
      
      // ===== ITERATION WITH COUNTER TRACKING =====
      for (const optionalCookie of expectations.optionalCookies) {
        const isPresent = cookieKeys.includes(optionalCookie);
        console.log(`   ${isPresent ? '✅' : '⚠️'} ${optionalCookie}: ${isPresent ? 'FOUND' : 'MISSING'} (optional)`);
        
        // ===== CONDITIONAL INCREMENT =====
        // Only increment if the condition is true
        if (isPresent) optionalFound++;
      }
      
      // ===== SAFE PROPERTY ACCESS WITHIN TYPE GUARD =====
      // Inside this if block, TypeScript knows optionalCookies is NOT undefined
      // So we can safely access .length without optional chaining
      console.log(`   📊 Optional cookies found: ${optionalFound}/${expectations.optionalCookies.length}`);
    }
  }

  // ===== STATIC METHOD WITH SINGLE PARAMETER =====
  // Takes a ConsentCookieContent object (must match our interface)
  // Returns void (no return value)
  static logConsentCookieValidation(content: ConsentCookieContent): void {
    
    // ===== OBJECT PROPERTY ACCESS WITH TERNARY OPERATORS =====
    // Accessing boolean properties from the interface
    // Each ternary operator chooses between two string values based on boolean condition
    console.log(`   ${content.hasYesConsent ? '✅' : '❌'} Consent value: ${content.hasYesConsent ? 'YES' : 'NO'}`);
    console.log(`   ${content.hasYesAction ? '✅' : '❌'} Action value: ${content.hasYesAction ? 'YES' : 'NO'}`);
    console.log(`   ${content.hasYesNecessary ? '✅' : '❌'} Necessary value: ${content.hasYesNecessary ? 'YES' : 'NO'}`);
  }
}

// ===== END OF CLASS DEFINITION =====
// The closing brace marks the end of the CookieValidator class
// All methods inside are static, so they're called like: CookieValidator.methodName()
// No need to create instances: you use CookieValidator directly
