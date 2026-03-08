import { render, screen } from "@testing-library/react";
import { RiskBadge } from "@/components/RiskBadge";

describe("RiskBadge", () => {
  it("renders critical band with correct label", () => {
    render(<RiskBadge band="critical" />);
    expect(screen.getByText("CRITICAL")).toBeInTheDocument();
  });

  it("renders high risk band", () => {
    render(<RiskBadge band="high" />);
    expect(screen.getByText(/high/i)).toBeInTheDocument();
  });

  it("renders watch band", () => {
    render(<RiskBadge band="watch" />);
    expect(screen.getByText(/watch/i)).toBeInTheDocument();
  });

  it("renders stable band", () => {
    render(<RiskBadge band="stable" />);
    expect(screen.getByText(/stable/i)).toBeInTheDocument();
  });

  it("applies risk-pulse class for critical band", () => {
    const { container } = render(<RiskBadge band="critical" />);
    const badge = container.firstChild as HTMLElement;
    expect(badge.className).toContain("risk-pulse");
  });

  it("does not apply risk-pulse for stable band", () => {
    const { container } = render(<RiskBadge band="stable" />);
    const badge = container.firstChild as HTMLElement;
    expect(badge.className).not.toContain("risk-pulse");
  });
});
