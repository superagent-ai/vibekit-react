export function generateVibeKitPrompt(): string {
  return `You are tasked with integrating VibeKit into a React application. VibeKit is a comprehensive UI component library that provides modern, accessible, and customizable components.

Follow these steps to integrate VibeKit:

1. Install VibeKit:
   \`\`\`bash
   npm install @vibe-kit/react
   \`\`\`

2. Import and use VibeKit components:
   \`\`\`tsx
   import { VibeKitButton } from "@vibe-kit/react";
   
   export default function App() {
     return (
       <div>
         <VibeKitButton app="default">
           Integrate VibeKit
         </VibeKitButton>
       </div>
     );
   }
   \`\`\`

3. The VibeKitButton component provides:
   - One-click integration wizard
   - GitHub repository selection
   - Automatic PR creation
   - Copy-to-clipboard prompts for AI assistants
   - Support for different integration modes

4. Customize the integration by:
   - Adding specific instructions for your use case
   - Selecting the appropriate repository
   - Choosing between PR creation or prompt copying

The component will handle the complete integration workflow, including authentication and repository management.`;
}

export function generateVibeKitPromptForStripe(): string {
  return `You are tasked with integrating Stripe Portal into a React application using VibeKit. This integration will add customer portal functionality to your app.

Follow these steps to integrate Stripe Portal:

1. Install required dependencies:
   \`\`\`bash
   npm install @vibe-kit/react stripe
   \`\`\`

2. Set up environment variables:
   \`\`\`env
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   \`\`\`

3. Import and use the VibeKitButton for Stripe:
   \`\`\`tsx
   import { VibeKitButton } from "@vibe-kit/react";
   
   export default function App() {
     return (
       <div>
         <VibeKitButton app="stripe">
           Add Stripe Portal
         </VibeKitButton>
       </div>
     );
   }
   \`\`\`

4. The Stripe Portal integration provides:
   - Customer billing portal access
   - Subscription management
   - Payment method updates
   - Billing history access
   - Invoice downloads

5. Customize the integration by:
   - Specifying where to place the portal button
   - Adding custom styling and branding
   - Configuring portal features and permissions

The component will generate the necessary Stripe Portal implementation including authentication, session creation, and portal redirection.`;
}
