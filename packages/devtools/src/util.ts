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

export const xmlDemo = `
<script type="text/template" id="template">
  <view id="container">
    <text id="testText" class="redText" value="hello canvas"></text>
  </view>
</script>
`;

export const devtoolsNotInitCode = `
// 引入minigame-canvas-engine-devtools之后，layoutDevtools会自动挂载到windows
window.layoutDevtools.init(Layout);
`