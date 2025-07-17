// ===== IMPORTS SECTION =====
// TypeScript Import Statement: Importing specific functions/objects from external modules
// The 'import' keyword is used to bring in functionality from other files or npm packages

// Import the 'test' function from Playwright's testing framework
// 'test' is a TypeScript function type that provides the testing context
import { test } from '@playwright/test';

// Import our custom class from a relative file path
// The './' means "look in the current directory"
// TypeScript will automatically add .ts extension when looking for files
// We're importing a CLASS (not a function) - classes are TypeScript/JavaScript constructs for creating objects
import { CookieCustomizationTest } from './workflows/cookie-customization.workflow';

// ===== TEST DEFINITION =====
// 'test()' is a Playwright function that defines a single test case
// TypeScript Function Parameters explained:
// 1. First parameter: string - the test name/description
// 2. Second parameter: async function - the actual test logic

test('do not enable any optional cookies and save preferences', async ({ page }, testInfo) => {
  // ===== FUNCTION PARAMETERS EXPLANATION =====
  // This is TypeScript's "destructuring assignment" syntax
  // { page } - extracts the 'page' property from the first parameter object
  // testInfo - the second parameter containing test metadata
  
  // ===== TYPESCRIPT VARIABLE DECLARATIONS =====
  
  // TypeScript's Optional Chaining Operator (?.)
  // The '?.' means "if metadata exists, then access platform, otherwise return undefined"
  // This prevents errors if metadata is null/undefined
  // Type: string | undefined (union type - can be either string OR undefined)
  const platform = testInfo.project.metadata?.platform;
  
  // Simple property access - getting the project name
  // Type: string (TypeScript knows this is always a string from Playwright's types)
  const projectName = testInfo.project.name;

  // ===== CLASS INSTANTIATION =====
  // TypeScript Class Constructor Call
  // 'new' keyword creates a new instance of the CookieCustomizationTest class
  // We pass three parameters to the constructor:
  // 1. page (Playwright Page object)
  // 2. platform (string | undefined)
  // 3. projectName (string)
  const cookieTest = new CookieCustomizationTest(page, platform, projectName);
  
  // ===== ASYNC/AWAIT PATTERN =====
  // 'await' keyword waits for the Promise to resolve before continuing
  // This is TypeScript/JavaScript's way of handling asynchronous operations
  // execute() returns a Promise<void> (a promise that doesn't return a value)
  await cookieTest.execute();
});