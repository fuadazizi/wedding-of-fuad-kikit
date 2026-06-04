import { describe, it, expect } from "vitest";
import { slugToName } from "./utils";

describe("slugToName", () => {
  it("should convert simple slug to Pascal Case with spaces", () => {
    expect(slugToName("fuad-azizi")).toBe("Fuad Azizi");
    expect(slugToName("kikit-handayani")).toBe("Kikit Handayani");
  });

  it("should support plus signs as separators", () => {
    expect(slugToName("fuad+azizi")).toBe("Fuad Azizi");
    expect(slugToName("kikit+handayani")).toBe("Kikit Handayani");
  });

  it("should support mixed separators", () => {
    expect(slugToName("fuad-azizi+SMA")).toBe("Fuad Azizi SMA");
    expect(slugToName("SMA+negeri-1")).toBe("SMA Negeri 1");
  });

  it("should preserve all-caps words like SMA", () => {
    expect(slugToName("fuad-azizi-SMA")).toBe("Fuad Azizi SMA");
    expect(slugToName("SMA-negeri-1")).toBe("SMA Negeri 1");
    expect(slugToName("alumni-SMA-3")).toBe("Alumni SMA 3");
  });

  it("should handle ampersand symbol with/without spaces and hyphens", () => {
    expect(slugToName("diana-&-partner")).toBe("Diana & Partner");
    expect(slugToName("diana+&+partner")).toBe("Diana & Partner");
    expect(slugToName("diana&partner")).toBe("Diana & Partner");
  });

  it("should handle empty or invalid inputs", () => {
    expect(slugToName("")).toBe("");
    expect(slugToName(null)).toBe("");
    expect(slugToName(undefined)).toBe("");
  });

  it("should handle double delimiters", () => {
    expect(slugToName("fuad--azizi")).toBe("Fuad  Azizi");
    expect(slugToName("fuad++azizi")).toBe("Fuad  Azizi");
    expect(slugToName("fuad+-azizi")).toBe("Fuad  Azizi");
  });

  it("should handle mixed case words correctly", () => {
    expect(slugToName("fuAd-aZiZi")).toBe("Fuad Azizi");
  });
});
