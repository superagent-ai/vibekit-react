import React, { useEffect, useRef, useState, useCallback } from "react";

export interface VibeKitModalProps {
  isOpen: boolean;
  onClose: () => void;
  url?: string;
  title?: string;
  width?: number;
  height?: number;
  children?: React.ReactNode;
}

const DEFAULTS = {
  width: 800,
  height: 620,
  minHeight: 200,
  maxHeightRatio: 0.95,
  maxWidthRatio: 0.95,
  animationDuration: 300,
};

const MESSAGES = {
  COPY: "VIBEKIT_COPY",
  RESIZE: "VIBEKIT_RESIZE",
};

export const VibeKitModal: React.FC<VibeKitModalProps> = ({
  isOpen,
  onClose,
  url,
  title = "Modal",
  width = DEFAULTS.width,
  height = DEFAULTS.height,
  children,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [modalHeight, setModalHeight] = useState(height);
  const [shouldRender, setShouldRender] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const handleMessage = useCallback((event: MessageEvent) => {
    if (iframeRef.current && event.source !== iframeRef.current.contentWindow)
      return;
    if (!event.data || !event.data.type) return;

    switch (event.data.type) {
      case MESSAGES.COPY:
        copyToClipboard(event.data.content);
        break;
      case MESSAGES.RESIZE:
        adjustHeight(event.data.height);
        break;
    }
  }, []);

  const copyToClipboard = async (content: string) => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(content);
      } else {
        fallbackCopyToClipboard(content);
      }
    } catch (error) {
      // Silently fail
      console.warn("Failed to copy to clipboard:", error);
    }
  };

  const fallbackCopyToClipboard = (content: string) => {
    const textArea = document.createElement("textarea");
    textArea.value = content;
    textArea.style.position = "fixed";
    textArea.style.opacity = "0";
    textArea.style.pointerEvents = "none";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
  };

  const adjustHeight = (contentHeight: number) => {
    const maxHeight = window.innerHeight * DEFAULTS.maxHeightRatio;
    const newHeight = Math.max(
      DEFAULTS.minHeight,
      Math.min(maxHeight, contentHeight)
    );
    setModalHeight(newHeight);
  };

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const handleIframeError = () => {
    setIsLoading(false);
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) {
      onClose();
    }
  };

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    },
    [isOpen, onClose]
  );

  // Handle modal opening animation
  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      document.body.style.overflow = "hidden";
      setIsLoading(!!url);

      // Trigger animation after mounting with a small delay to ensure initial render
      const timer = setTimeout(() => {
        setIsAnimating(true);
      }, 10);

      return () => clearTimeout(timer);
    } else if (shouldRender) {
      // Start closing animation
      setIsAnimating(false);
      document.body.style.overflow = "";

      // Unmount after animation completes
      const timer = setTimeout(() => {
        setShouldRender(false);
        // Clear iframe src after animation
        if (iframeRef.current) {
          iframeRef.current.src = "about:blank";
        }
      }, DEFAULTS.animationDuration);

      return () => clearTimeout(timer);
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, url, shouldRender]);

  useEffect(() => {
    window.addEventListener("message", handleMessage);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("message", handleMessage);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleMessage, handleKeyDown]);

  if (!shouldRender) return null;

  return (
    <div
      ref={overlayRef}
      className={`vibekit-modal-overlay ${isAnimating ? "active" : ""}`}
      onClick={handleOverlayClick}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 10000,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        opacity: isAnimating ? 1 : 0,
        visibility: isAnimating ? "visible" : "hidden",
        transition: `all ${DEFAULTS.animationDuration}ms ease`,
      }}
    >
      <div
        className="vibekit-modal"
        style={{
          background: "white",
          borderRadius: "8px",
          boxShadow:
            "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          maxWidth: `${DEFAULTS.maxWidthRatio * 100}vw`,
          maxHeight: `${DEFAULTS.maxHeightRatio * 100}vh`,
          width: `${width}px`,
          height: `${modalHeight}px`,
          minHeight: `${DEFAULTS.minHeight}px`,
          position: "relative",
          transform: isAnimating ? "scale(1)" : "scale(0.7)",
          transition: `transform ${DEFAULTS.animationDuration}ms ease, height ${DEFAULTS.animationDuration}ms ease`,
          overflow: "hidden",
        }}
      >
        <button
          className="vibekit-modal-close"
          onClick={onClose}
          aria-label="Close modal"
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#6b7280",
            width: "32px",
            height: "32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "6px",
            transition: "all 0.2s ease",
            zIndex: 1,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#f3f4f6";
            e.currentTarget.style.color = "#374151";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
            e.currentTarget.style.color = "#6b7280";
          }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m18 6-12 12"></path>
            <path d="m6 6 12 12"></path>
          </svg>
        </button>

        <div
          className="vibekit-modal-body"
          style={{ height: "100%", position: "relative" }}
        >
          {isLoading && url && (
            <div
              className="vibekit-modal-loading"
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                color: "#6b7280",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg
                className="vibekit-loader"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  animation: "vibekit-spin 1s linear infinite",
                }}
              >
                <path d="M21 12a9 9 0 11-6.219-8.56" />
              </svg>
            </div>
          )}

          {url ? (
            <iframe
              ref={iframeRef}
              src={url}
              className="vibekit-modal-iframe"
              style={{
                width: "100%",
                height: `${modalHeight}px`,
                border: "none",
                display: isLoading ? "none" : "block",
              }}
              onLoad={handleIframeLoad}
              onError={handleIframeError}
              title={title}
            />
          ) : (
            children
          )}
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
          @keyframes vibekit-spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `,
        }}
      />
    </div>
  );
};
