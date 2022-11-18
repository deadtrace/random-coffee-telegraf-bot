const parseForMarkdown = (str) =>
  str
    .replace(/_/gi, "\\_")
    .replace(/-/gi, "\\-")
    .replace("~", "\\~")
    .replace(/`/gi, "\\`")
    .replace(/\./g, "\\.")
    .replace(/\</g, "\\<")
    .replace(/\>/g, "\\>")
    .replace(/\)/g, "\\)")
    .replace(/\(/g, "\\(");

export default parseForMarkdown;
