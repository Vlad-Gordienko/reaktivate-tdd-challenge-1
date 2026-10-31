import { sanitizeText } from "./sanitize";

describe("sanitizeText", () => {
  it("removes a single HTML tag", () => {
    expect(sanitizeText("<b>bold</b>")).toBe("bold");
  });

  it("removes multiple HTML tags", () => {
    expect(sanitizeText("<div><p>Hi <i>there</i></p></div>")).toBe("Hi there");
  });

  it("leaves a string with no tags unchanged", () => {
    expect(sanitizeText("Plain text with no tags")).toBe("Plain text with no tags");
  });

  it("returns an empty string when the input consists only of tags", () => {
    expect(sanitizeText("<script></script>")).toBe("");
  });
});
