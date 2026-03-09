# Ad Integration Pseudocode (WeChat Rewarded Video)

```js
const ad = wx.createRewardedVideoAd({ adUnitId: 'adunit-xxxx' });

export async function showRewardedAd({ onReward, onCancel }) {
  try {
    await ad.load();
    await ad.show();
  } catch (e) {
    onCancel?.('load_or_show_failed');
    return;
  }

  ad.onClose((res) => {
    if (res && res.isEnded) onReward?.();
    else onCancel?.('interrupted');
  });

  ad.onError((err) => onCancel?.(err));
}
```

## Placement
- revive entry after failure
- double reward at result screen

## Guardrails
- max 2 rewarded prompts per round
- no forced watch before first gameplay loop
- fallback rewards disabled if ad fails
