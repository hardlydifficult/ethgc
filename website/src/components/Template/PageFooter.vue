<template>
  <footer class="footer bg-primary text-white mt-5">
    <div class="float-right pl-2">
      <a href="/docs"
         target="_blank">
        <i
          v-tooltip="'Documentation<br><small>ethgc.com/docs</small>'"
          class="fas fa-book text-white docIcon mr-1" />
      </a>
      <a href="https://twitter.com/HardlyDifficult"
         target="_blank">
        <img
          v-tooltip="'Twitter<br><small>twitter.com/HardlyDifficult</small>'"
          src="../../assets/3rdParty/Twitter_Social_Icon_Circle_White.svg"
          width="32px">
      </a>
      <a href="https://github.com/hardlydifficult/ethgc"
         target="_blank">
        <img
          v-tooltip="
            'GitHub<br><small>github.com/HardlyDifficult/ethgc</small>'
          "
          class="ml-1"
          src="../../assets/3rdParty/Octicons-mark-github.svg"
          width="32px">
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
          class="pointer"
          @click="
            $copy(
              '3EPAsFwUBh1JvPJVqoycXpYVfDE4v3WdQ1',
              'the developer\'s Bitcoin (BTC) address'
            )
          ">
          BTC <i class="far fa-copy" /> </span>,
        <span
          v-tooltip="
            '0x7A23608a8eBe71868013BDA0d900351A83bb4Dc2<br><small>click to copy</small>'
          "
          class="pointer"
          @click="
            $copy(
              '0x7A23608a8eBe71868013BDA0d900351A83bb4Dc2',
              'the developer\'s Ethereum (ETH) address'
            )
          ">
          ETH <i class="far fa-copy" /> </span>, or
        <span
          v-tooltip="
            'TNbiopsxqPGk5XicApWJwEbZZ7uLJfpvfm<br><small>click to copy</small>'
          "
          class="pointer"
          @click="
            $copy(
              'TNbiopsxqPGk5XicApWJwEbZZ7uLJfpvfm',
              'the developer\'s Tron (TRX) address'
            )
          ">
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
.docIcon {
  font-size: 30px;
  position: relative;
  top: 6px;
}
</style>
