import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { VibeKitButton, VibeKitButtonProps } from "../src/components/index";

describe("VibeKitButton", () => {
  it("can be imported and rendered", () => {
    render(
      <VibeKitButton>
        <button>VibeKit Integration Button</button>
      </VibeKitButton>
    );
    expect(
      screen.getByRole("button", { name: "VibeKit Integration Button" })
    ).toBeInTheDocument();
  });

  it("renders with default app type", () => {
    render(
      <VibeKitButton>
        <button>Default VibeKit</button>
      </VibeKitButton>
    );
    const trigger = screen.getByRole("button", { name: "Default VibeKit" });
    expect(trigger).toBeInTheDocument();
  });

  it("renders with stripe app type", () => {
    render(
      <VibeKitButton app="stripe">
        <button>Stripe Integration</button>
      </VibeKitButton>
    );
    const trigger = screen.getByRole("button", { name: "Stripe Integration" });
    expect(trigger).toBeInTheDocument();
  });

  it("accepts VibeKitButtonProps type", () => {
    const props: VibeKitButtonProps = {
      app: "default",
      className: "custom-class",
      children: <button>Typed Button</button>,
    };

    render(<VibeKitButton {...props} />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });
});
