<template>
  <footer class="footer bg-primary text-white mt-5">
    <div class="float-right pl-2">
      <a href="https://github.com/hardlydifficult/ethgc" target="_blank">
        <img
          class="mr-1"
          v-tooltip="
            'GitHub<br><small>github.com/HardlyDifficult/ethgc</small>'
          "
          src="../../assets/3rdParty/GitHub-Mark-Light-32px.png"
          width="32px"
        />
      </a>
      <a href="https://twitter.com/HardlyDifficult" target="_blank">
        <img
          v-tooltip="'Twitter<br><small>twitter.com/HardlyDifficult</small>'"
          src="../../assets/3rdParty/Twitter_Social_Icon_Circle_Color.png"
          width="32px"
        />
      </a>
      <a href="https://ethgc.readthedocs.io" target="_blank">
        <img
          v-tooltip="'Read the Docs<br><small>ethgc.readthedocs.io</small>'"
          src="../../assets/3rdParty/rtd-logo-light.svg"
          width="32px"
        />
      </a>
    </div>
    <small>
      <div>
        Giveaway ETH, tokens or NFTs with a simple redeem code
      </div>
      <div class="pt-2">
        Support the developer with a tip in
        <span
          v-tooltip="
            '3EPAsFwUBh1JvPJVqoycXpYVfDE4v3WdQ1<br><small>click to copy</small>'
          "
          @click="$clipboard('3EPAsFwUBh1JvPJVqoycXpYVfDE4v3WdQ1')"
        >
          BTC <i class="far fa-copy" /> </span
        >,
        <span
          v-tooltip="
            '0x7A23608a8eBe71868013BDA0d900351A83bb4Dc2<br><small>click to copy</small>'
          "
          @click="$clipboard('0x7A23608a8eBe71868013BDA0d900351A83bb4Dc2')"
        >
          ETH <i class="far fa-copy" /> </span
        >, or
        <span
          v-tooltip="
            'TNbiopsxqPGk5XicApWJwEbZZ7uLJfpvfm<br><small>click to copy</small>'
          "
          @click="$clipboard('TNbiopsxqPGk5XicApWJwEbZZ7uLJfpvfm')"
        >
          TRX <i class="far fa-copy" />
        </span>
      </div>
    </small>
  </footer>
</template>
<style>
.footer {
  flex-shrink: 0;
  /* Prevent Chrome, Opera, and Safari from letting these items shrink to smaller than their content's default minimum size. */
  padding: 20px;
}
</style>
