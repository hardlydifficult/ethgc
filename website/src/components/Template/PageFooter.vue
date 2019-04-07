<template>
  <div class="footer flex bg-grey-light">
    <div class="flex-1 pr-5 pb-5">
      <div>
        Giveaway ETH, tokens or NFTs with a simple redeem code.
      </div>
      <div class="pt-2">
        <a href="https://github.com/hardlydifficult/ethgc/issues/new">Find an issue, have a suggestion: let me know</a>
      </div>
      <div class="pt-2">
        Support development of this tool: tip with
        <span v-tooltip="'3EPAsFwUBh1JvPJVqoycXpYVfDE4v3WdQ1 (click to copy)'" v-on:click="$clipboard('3EPAsFwUBh1JvPJVqoycXpYVfDE4v3WdQ1')">
          BTC <i class="far fa-copy" />
        </span>,
        <span v-tooltip="'0x7A23608a8eBe71868013BDA0d900351A83bb4Dc2 (click to copy)'" v-on:click="$clipboard('0x7A23608a8eBe71868013BDA0d900351A83bb4Dc2')">
          ETH <i class="far fa-copy" />
        </span>,
        or
        <span v-tooltip="'TNbiopsxqPGk5XicApWJwEbZZ7uLJfpvfm (click to copy)'" v-on:click="$clipboard('TNbiopsxqPGk5XicApWJwEbZZ7uLJfpvfm')">
          TRX <i class="far fa-copy" />
        </span>
      </div>
    </div>
    <div class="flex-none">
      <a
       href="https://github.com/hardlydifficult/ethgc" target="_blank">
        <img
        v-tooltip="'GitHub'"
        src="../../assets/3rdParty/GitHub-Mark-32px.png" width="32px"/>
      </a>
      <a
        href="https://twitter.com/HardlyDifficult" target="_blank">
        <img
        v-tooltip="'Twitter'"
        src="../../assets/3rdParty/Twitter_Social_Icon_Circle_Color.png" width="32px" />
      </a>
    </div>
  </div>
</template>

<script>
export default {
}
</script>
<style>
.footer
{
  bottom: 0;
  width: 100%;

  font-size: .6em;
  margin-top: 1em;
  padding: 0.5em;
  min-height: 6em;
}
</style>
