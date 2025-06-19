// Main React components
export { VibeKitButton, type VibeKitButtonProps } from "./VibeKitButton";
export {
  VibeKitModal,
  type VibeKitModalProps,
} from "./components/VibeKitModal";

// Utility functions for opening/closing modals globally
export const openVibeKitModal = (url: string, title?: string) => {
  // This will work with the global modal instance if available
  if (typeof window !== "undefined" && (window as any).openModal) {
    (window as any).openModal(url, title);
  }
};

export const closeVibeKitModal = () => {
  // This will work with the global modal instance if available
  if (typeof window !== "undefined" && (window as any).closeModal) {
    (window as any).closeModal();
  }
};
