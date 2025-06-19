import React, { useState } from "react";
import { VibeKitModal } from "./components/VibeKitModal";

export interface VibeKitButtonProps {
  token: string;
  buttonText?: string;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export const VibeKitButton: React.FC<VibeKitButtonProps> = ({
  token,
  buttonText = "🖖 Add VibeKit to your app",
  className = "",
  style = {},
  children,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!token) {
      alert("Error: No VibeKit token found. Please provide a valid token.");
      return;
    }

    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const url = `https://app.vibekit.sh/embed/${token}?embed=true`;

  const defaultStyle: React.CSSProperties = {
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "14px",
    fontFamily: "system-ui, -apple-system, sans-serif",
    transition: "background-color 0.2s ease",
    ...style,
  };

  return (
    <>
      <button
        id="vibekit-button"
        data-vibekit-token={token}
        onClick={handleClick}
        className={className}
        style={defaultStyle}
        onMouseEnter={(e) => {
          if (!style.backgroundColor) {
            e.currentTarget.style.backgroundColor = "#0056b3";
          }
        }}
        onMouseLeave={(e) => {
          if (!style.backgroundColor) {
            e.currentTarget.style.backgroundColor = "#007bff";
          }
        }}
      >
        {children || buttonText}
      </button>

      <VibeKitModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        url={url}
        title="VibeKit - Add to your app"
      />
    </>
  );
};
