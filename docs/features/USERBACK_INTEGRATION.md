# Userback Feedback Widget Integration

This document outlines the implementation of the Userback feedback widget in the Metric Mapping application.

## 🎯 Overview

The Userback widget allows users to submit feedback, bug reports, and feature requests directly from within the application. The integration automatically identifies users via Clerk authentication and provides different behavior for development and production environments.

## 🔧 Implementation

### Core Components

1. **`UserbackProvider`** (`src/components/feedback/UserbackProvider.tsx`)
   - Used in **production/staging** environments
   - Integrates with **Clerk authentication**
   - Automatically identifies logged-in users
   - Disabled in development by default

2. **`DevUserbackProvider`** (`src/components/feedback/DevUserbackProvider.tsx`)
   - Used in **development** environment
   - Works with development auth system
   - Can be enabled via environment variable
   - Provides development user context

3. **`FeedbackButton`** (`src/components/feedback/FeedbackButton.tsx`)
   - Manual trigger for feedback widget
   - Can be placed anywhere in the UI
   - Customizable styling and size

### Integration Points

#### App.tsx Integration

```typescript
// Production mode
<ClerkSupabaseProvider>
  <AuthenticatedSupabaseProvider>
    <UserbackProvider>
      {/* App routes */}
    </UserbackProvider>
  </AuthenticatedSupabaseProvider>
</ClerkSupabaseProvider>

// Development mode
<DevAuthProvider>
  <AuthenticatedSupabaseProvider>
    <DevUserbackProvider>
      {/* App routes */}
    </DevUserbackProvider>
  </AuthenticatedSupabaseProvider>
</DevAuthProvider>
```

#### User Menu Integration

- **Production**: Feedback option in user dropdown menu
- **Development**: Feedback button in homepage header (when enabled)

## 🔑 Configuration

### Userback Token

```typescript
// Both providers use the same token
const USERBACK_TOKEN = "A-qbFmEFfLIKBhMnA3cIQCtd5fH";
```

### Environment Variables

#### Development Mode

```bash
# Optional: Enable Userback in development
VITE_ENABLE_USERBACK_DEV=true
```

### User Identification

#### Production (Clerk Users)

```typescript
{
  user_data: {
    id: user.id,                    // Clerk user ID
    info: {
      name: user.fullName,          // User's full name
      email: user.emailAddress,     // Primary email
      created_at: user.createdAt,   // Account creation date
      last_sign_in: user.lastSignInAt // Last sign-in timestamp
    }
  }
}
```

#### Development (Mock Users)

```typescript
{
  user_data: {
    id: "dev-user" || user.id,
    info: {
      name: user.name || "Development User",
      email: user.email || "dev@canvasm.app",
      environment: "development"
    }
  }
}
```

## 🎨 Widget Configuration

### Default Settings

```typescript
const options = {
  smarty: true, // Enable smart feedback detection
  delay: 2000, // Wait 2 seconds before showing (1000ms in dev)
  user_data: {
    // User identification (see above)
    // ...
  },
};
```

### Smart Features

- **Smarty Mode**: Automatically detects user frustration and prompts for feedback
- **Delayed Initialization**: Waits for page load before showing
- **User Context**: Includes user information for better support

## 🚀 Usage

### Automatic Widget

The widget will automatically appear based on Userback's smart detection algorithms:

- User clicks rapidly (frustration detection)
- User stays on error pages
- Custom triggers based on user behavior

### Manual Trigger

Users can manually open the feedback widget:

1. **Production**: Click "Give Feedback" in user menu
2. **Development**: Click "Give Feedback" button in header (if enabled)
3. **Programmatic**: Call `window.Userback.open()`

### Example Usage

```typescript
// Manual trigger anywhere in the app
const handleFeedback = () => {
  if (window.Userback) {
    window.Userback.open();
  }
};
```

## 🛠️ Development Setup

### Enable in Development

1. Add environment variable:

   ```bash
   VITE_ENABLE_USERBACK_DEV=true
   ```

2. Restart development server:

   ```bash
   npm run dev
   ```

3. Look for feedback button in homepage header

### Testing

- **Development**: Look for console logs: `🔧 Userback initialized for development`
- **Production**: Check user menu for "Give Feedback" option
- **Widget**: Should appear automatically based on user behavior

## 🔍 Debugging

### Console Logs

The integration provides detailed console logging:

```typescript
// Successful initialization
"✅ Userback widget successfully initialized";

// User identification
"🔧 Userback initialized with user: { id, name, email }";

// Environment detection
"🔧 Userback disabled in development mode";
"🔧 Development mode detected - using DevUserbackProvider";

// Errors
"❌ Error initializing Userback: [error details]";
```

### Common Issues

1. **Widget not appearing**
   - Check browser console for initialization logs
   - Verify user authentication status
   - Check environment detection

2. **User not identified**
   - Verify Clerk user is loaded (`isLoaded = true`)
   - Check user object has required fields
   - Look for user identification logs

3. **Development mode issues**
   - Ensure `VITE_ENABLE_USERBACK_DEV=true` is set
   - Check that development auth provider is active
   - Verify feedback button appears in header

## 🔐 Security Considerations

### Data Privacy

- **User Identification**: Only basic user info (name, email, ID) is shared
- **No Sensitive Data**: No authentication tokens or sensitive data transmitted
- **Opt-in**: Users must manually trigger feedback (except smart detection)

### Environment Separation

- **Development**: Uses development-specific user context
- **Production**: Uses real user authentication data
- **Token**: Same token used across environments (Userback handles environment separation)

## 📋 Feedback Types

The widget supports multiple feedback types:

- 🐛 **Bug Reports**: Issue reporting with screenshots
- 💡 **Feature Requests**: New feature suggestions
- 📝 **General Feedback**: Overall experience feedback
- 📷 **Visual Feedback**: Screenshot-based feedback with annotations

## 🔄 Future Enhancements

### Potential Improvements

1. **Custom Triggers**: Add context-specific feedback triggers
2. **Feedback Analytics**: Track feedback patterns and user satisfaction
3. **Integration**: Connect with project management tools
4. **Customization**: Brand the widget to match app design

### Configuration Options

- Custom widget positioning
- Environment-specific settings
- Advanced user segmentation
- Feedback routing based on user type

---

## 📞 Support

For Userback-specific issues:

- **Userback Documentation**: https://help.userback.io/
- **Widget Configuration**: https://help.userback.io/en/articles/1893067-userback-widget-configuration
- **API Reference**: https://help.userback.io/en/articles/2982866-userback-widget-api

For integration issues:

- Check browser console for error logs
- Verify environment configuration
- Test user authentication flow
