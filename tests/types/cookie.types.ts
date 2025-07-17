// ===== TYPESCRIPT INTERFACES EXPLANATION =====
// Interfaces are TypeScript's way of defining the structure/shape of objects
// They act as contracts - any object using this interface MUST have these properties
// Interfaces are compile-time only and don't exist in the final JavaScript

// ===== INTERFACE WITH REQUIRED AND OPTIONAL PROPERTIES =====
export interface ExpectedCookies {
  // Required property - any object using this interface MUST have this property
  // Type annotation: this must be an array of strings
  requiredCookies: string[];
  
  // Optional property - the '?' makes this property optional
  // Objects can have this property or not, TypeScript won't complain either way
  // If present, it must be an array of strings
  optionalCookies?: string[];
}

// ===== INTERFACE WITH ALL REQUIRED PROPERTIES =====
export interface CookieValidationResult {
  // Boolean type - can only be true or false
  isValid: boolean;
  
  // Array of strings - contains names of missing cookies
  missingRequired: string[];
  
  // Number type - count of optional cookies found
  foundOptional: number;
  
  // Number type - total number of optional cookies expected
  totalOptional: number;
}

// ===== INTERFACE WITH BOOLEAN PROPERTIES =====
// This interface represents the structure of consent cookie validation results
export interface ConsentCookieContent {
  // All properties are boolean - they represent yes/no states
  hasYesConsent: boolean;
  hasYesAction: boolean;
  hasYesNecessary: boolean;
}

// ===== TYPESCRIPT EXPORT EXPLANATION =====
// 'export' keyword makes these interfaces available for import in other files
// Without 'export', these would only be usable within this file
// Other files can import these using: import { InterfaceName } from './cookie.types'
