<template>
  <footer class="footer bg-dark text-white">
    <div>
      <div>
        Giveaway ETH, tokens or NFTs with a simple redeem code.
      </div>
      <div>
        <a
          class="text-light"
          href="https://github.com/hardlydifficult/ethgc/issues/new"
          >Find an issue, have a suggestion: let me know</a
        >
      </div>
      <div>
        Support development of this tool: tip with
        <span
          v-tooltip="'3EPAsFwUBh1JvPJVqoycXpYVfDE4v3WdQ1 (click to copy)'"
          @click="$clipboard('3EPAsFwUBh1JvPJVqoycXpYVfDE4v3WdQ1')"
        >
          BTC <i class="far fa-copy" /> </span
        >,
        <span
          v-tooltip="
            '0x7A23608a8eBe71868013BDA0d900351A83bb4Dc2 (click to copy)'
          "
          @click="$clipboard('0x7A23608a8eBe71868013BDA0d900351A83bb4Dc2')"
        >
          ETH <i class="far fa-copy" /> </span
        >, or
        <span
          v-tooltip="'TNbiopsxqPGk5XicApWJwEbZZ7uLJfpvfm (click to copy)'"
          @click="$clipboard('TNbiopsxqPGk5XicApWJwEbZZ7uLJfpvfm')"
        >
          TRX <i class="far fa-copy" />
        </span>
      </div>
    </div>
    <div>
      <a href="https://github.com/hardlydifficult/ethgc" target="_blank">
        <img
          v-tooltip="'GitHub'"
          src="../../assets/3rdParty/GitHub-Mark-32px.png"
          width="32px"
        />
      </a>
      <a href="https://twitter.com/HardlyDifficult" target="_blank">
        <img
          v-tooltip="'Twitter'"
          src="../../assets/3rdParty/Twitter_Social_Icon_Circle_Color.png"
          width="32px"
        />
      </a>
    </div>
  </footer>
</template>
<style>
.footer {
  flex-shrink: 0;
  /* Prevent Chrome, Opera, and Safari from letting these items shrink to smaller than their content's default minimum size. */
  padding: 20px;
}
</style>
