# Cookie Customization Test - Page Object Model Architecture

## 📁 Project Structure

```
tests/
├── config/
│   └── cookie.config.ts          # Centralized cookie expectations
├── pages/
│   └── cookie-consent.page.ts    # Page Object for cookie consent interactions
├── types/
│   └── cookie.types.ts           # TypeScript interfaces and types
├── utils/
│   ├── browser.utils.ts          # Browser-specific utilities
│   └── cookie.validator.ts       # Cookie validation logic
├── workflows/
│   └── cookie-customization.test.ts  # Test workflow orchestration
└── test-3.spec.ts               # Main test file (entry point)
```

## 🎯 Architecture Benefits

### **Page Object Model (POM)**
- **Encapsulation**: UI interactions are encapsulated within page objects
- **Reusability**: Page objects can be reused across multiple tests
- **Maintainability**: Changes to UI elements only require updates in one place
- **Readability**: Tests become more readable and business-focused

### **Separation of Concerns**
- **Configuration**: Cookie expectations centralized in `cookie.config.ts`
- **Validation**: Cookie validation logic isolated in `cookie.validator.ts`
- **Utilities**: Browser-specific helpers in `browser.utils.ts`
- **Types**: Strong typing with TypeScript interfaces in `cookie.types.ts`

## 📋 Component Overview

### `CookieConsentPage` (Page Object)
```typescript
// Primary responsibilities:
- Navigate to the website
- Interact with cookie consent UI elements
- Handle platform-specific interactions
- Retrieve cookies from the browser context
- Orchestrate the complete cookie customization flow
```

### `CookieValidator` (Utility)
```typescript
// Primary responsibilities:
- Wait for consent cookies with retry logic
- Validate cookies against project expectations
- Validate consent cookie content
- Log detailed validation results
```

### `CookieConfig` (Configuration)
```typescript
// Primary responsibilities:
- Define cookie expectations per browser project
- Provide centralized domain configuration
- Supply expected cookies for validation
```

### `BrowserUtils` (Utility)
```typescript
// Primary responsibilities:
- Handle desktop-specific UI interactions
- Manage browser-specific timing requirements
- Provide network idle state handling
```

### `CookieCustomizationTest` (Workflow)
```typescript
// Primary responsibilities:
- Orchestrate the complete test workflow
- Coordinate between page objects and utilities
- Handle test-specific validation and assertions
- Provide clean separation between test logic and implementation
```

## 🔧 Usage Example

```typescript
// Simple test implementation using POM
test('customise which cookies are selected', async ({ page }, testInfo) => {
  const platform = testInfo.project.metadata?.platform;
  const projectName = testInfo.project.name;

  const cookieTest = new CookieCustomizationTest(page, platform, projectName);
  await cookieTest.execute();
});
```

## 🚀 Scalability Features

### **Adding New Browser Support**
```typescript
// Simply add to cookie.config.ts
'New Browser': {
  requiredCookies: ['cookie1@domain.com'],
  optionalCookies: ['cookie2@domain.com']
}
```

### **Extending Page Interactions**
```typescript
// Add new methods to CookieConsentPage
async acceptAllCookies(): Promise<void> {
  await this.acceptAllButton.click();
}
```

### **Custom Validation Rules**
```typescript
// Extend CookieValidator with new validation methods
static validateCustomCookieFeature(cookies: any[]): boolean {
  // Custom validation logic
}
```

## 🛠️ Best Practices Implemented

1. **DRY Principle**: No code duplication across browser configurations
2. **Single Responsibility**: Each class has a clear, focused purpose
3. **Type Safety**: Full TypeScript support with proper interfaces
4. **Error Handling**: Graceful handling of missing elements and timeouts
5. **Logging**: Comprehensive logging for debugging and monitoring
6. **Configurability**: Easy to modify expectations and behaviors
7. **Testability**: Each component can be tested independently

## 🎪 Test Execution Flow

```
test-3.spec.ts
    ↓
CookieCustomizationTest.execute()
    ↓
CookieConsentPage.navigate()
    ↓
CookieConsentPage.openCustomizeModal()
    ↓
BrowserUtils.handleDesktopSpecificUI()
    ↓
CookieConsentPage.savePreferences()
    ↓
BrowserUtils.handleBrowserSpecificWaits()
    ↓
CookieValidator.waitForConsentCookie()
    ↓
CookieValidator.validateCookies()
    ↓
Assertions & Results
```

## ✅ Quality Assurance

- **Cross-browser compatibility**: Tested across Chromium, Firefox, WebKit, Edge, and mobile browsers
- **Reliability**: Robust retry mechanisms and error handling
- **Performance**: Parallel execution support with optimized wait strategies
- **Maintainability**: Clear structure with separated concerns
- **Extensibility**: Easy to add new features and browser support

This architecture provides a solid foundation for scalable, maintainable test automation following industry best practices and design patterns.
