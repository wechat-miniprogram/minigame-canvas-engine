/**
 * 复制到剪切板
 * @param value 复制内容
 */
export function clipboard(value: string): void {
  if (typeof navigator.clipboard !== 'undefined') {
    navigator.clipboard.writeText(value);
  } else {
    const textarea = document.createElement('textarea');
    document.body.appendChild(textarea);
    textarea.style.position = 'fixed';
    textarea.style.top = '-100px';
    textarea.value = value;
    textarea.select();
    document.execCommand('copy', true);
    document.body.removeChild(textarea);
  }
}