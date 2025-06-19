# VibeKit React

A lightweight React component library for integrating VibeKit modals into your applications. **Zero dependencies, fully customizable, unstyled by default.**

## Installation

```bash
npm install @vibe-kit/onboard
```

## Usage

### React/Next.js Usage

The simplest way to use VibeKit is with the `VibeKitButton` component:

```tsx
import { VibeKitButton } from '@vibe-kit/onboard';

function App() {
  return (
    <div>
      <VibeKitButton 
        token="your-vibekit-token-here"
        buttonText="🖖 Add VibeKit to your app"
        className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
        // Add your own styles - components are unstyled by default
      />
    </div>
  );
}
```

## Props

### VibeKitButton Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `token` | `string` | **required** | Your VibeKit token |
| `buttonText` | `string` | `"🖖 Add VibeKit to your app"` | Text displayed on the button |
| `className` | `string` | `""` | CSS class for the button |
| `style` | `React.CSSProperties` | `{}` | Inline styles for the button |
| `children` | `React.ReactNode` | `undefined` | Custom button content (overrides buttonText) |

### VibeKitModal Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isOpen` | `boolean` | **required** | Whether the modal is open |
| `onClose` | `() => void` | **required** | Function called when modal should close |
| `url` | `string` | `undefined` | URL to display in the iframe |
| `title` | `string` | `"Modal"` | Title for the modal (for accessibility) |
| `width` | `number` | `900` | Modal width in pixels |
| `height` | `number` | `620` | Modal height in pixels |
| `children` | `React.ReactNode` | `undefined` | Custom content (used instead of iframe if provided) |

## Features

- ✅ **Zero dependencies** - No third-party libraries required
- ✅ **Unstyled by default** - Complete styling freedom
- ✅ **TypeScript support** - Full type safety
- ✅ **Next.js compatible** - Works with SSR/SSG
- ✅ **Responsive** - Adapts to different screen sizes
- ✅ **Accessible** - Keyboard navigation and ARIA support
- ✅ **Framework agnostic** - Works with any CSS solution (Tailwind, styled-components, CSS modules, etc.)
- ✅ **Vanilla JS support** - Works without React
- ✅ **Message handling** - Supports iframe communication
- ✅ **Auto-resize** - Modal adjusts to content height

## 🎨 Styling

**VibeKit components are completely unstyled by default.** This gives you full control over the appearance. See our [**Styling Guide**](./STYLES.md) for examples with:

- Tailwind CSS
- Styled Components  
- CSS Modules
- Material-UI
- Chakra UI
- Vanilla CSS
- And more!

## Browser Support

- Chrome/Edge 88+
- Firefox 87+
- Safari 14+

## License

MIT
