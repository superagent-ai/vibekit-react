# @vibe-kit/react

A comprehensive React component library providing modern, accessible, and customizable UI components with one-click integration capabilities.

## Installation

```bash
npm install @vibe-kit/react
```

## Components

### VibeKitButton

The `VibeKitButton` component provides a comprehensive integration wizard that allows users to:
- Connect their GitHub account
- Select repositories
- Generate pull requests automatically
- Copy integration prompts for AI assistants like Cursor, Windsurf, and Devin

#### Basic Usage

```tsx
import { VibeKitButton } from "@vibe-kit/react";

export default function App() {
  return (
    <VibeKitButton>
      <button className="px-4 py-2 bg-blue-600 text-white rounded">
        Add VibeKit to my app
      </button>
    </VibeKitButton>
  );
}
```

#### Stripe Integration

```tsx
import { VibeKitButton } from "@vibe-kit/react";

export default function App() {
  return (
    <VibeKitButton app="stripe">
      <button className="px-4 py-2 bg-purple-600 text-white rounded">
        Add Stripe Portal
      </button>
    </VibeKitButton>
  );
}
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | - | The trigger element (required) |
| `app` | `"default" \| "stripe"` | `"default"` | The type of integration |
| `className` | `string` | - | Additional CSS classes |

### Features

- **GitHub Integration**: Seamlessly connect with GitHub repositories
- **Pull Request Generation**: Automatically create PRs with integration code
- **AI Assistant Support**: Generate prompts for Cursor, Windsurf, Devin, and other AI tools
- **Dual Integration Modes**: Support for both VibeKit and Stripe Portal integrations
- **TypeScript Support**: Full TypeScript support with proper type definitions
- **Accessible**: Built with accessibility in mind using Radix UI primitives

### Additional Components

- `Button`: Basic button component
- `VibeKitBaseButton`: Branded version of the basic button

### Hooks

- `useGitHubAuth`: GitHub authentication hook

### Utilities

- `cn`: Utility for merging class names
- `generateVibeKitPrompt`: Generate integration prompts for VibeKit
- `generateVibeKitPromptForStripe`: Generate integration prompts for Stripe Portal

## Development

```bash
npm install
npm run dev      # Start development server
npm run build    # Build for production
npm test         # Run tests
```

## License

MIT 