<template>
  <div class="footer">
    <div>
      <a href="https://github.com/hardlydifficult/ethgc" target="_blank">
        <img src="../../assets/3rdParty/GitHub-Mark-32px.png" width="16px"/>
      </a>
      <a href="https://twitter.com/HardlyDifficult" target="_blank">
        <img src="../../assets/3rdParty/Twitter_Social_Icon_Circle_Color.png" width="16px" />
      </a>
    </div>
    <br>
    This is still very much WIP.
    <a href="https://github.com/hardlydifficult/ethgc/issues/new">Issues, suggestions: let me know</a>!
    <br><br>
    Support development of this tool: tip with
      <span v-tooltip="'3EPAsFwUBh1JvPJVqoycXpYVfDE4v3WdQ1'" v-on:click="$clipboard('3EPAsFwUBh1JvPJVqoycXpYVfDE4v3WdQ1')">
        BTC <i class="far fa-copy" />
      </span>,
      <span v-tooltip="'0x7A23608a8eBe71868013BDA0d900351A83bb4Dc2'" v-on:click="$clipboard('0x7A23608a8eBe71868013BDA0d900351A83bb4Dc2')">
        ETH <i class="far fa-copy" />
      </span>,
      or
      <span v-tooltip="'TNbiopsxqPGk5XicApWJwEbZZ7uLJfpvfm'" v-on:click="$clipboard('TNbiopsxqPGk5XicApWJwEbZZ7uLJfpvfm')">
        TRX <i class="far fa-copy" />
      </span>
    </div>
</template>

<script>
export default {
}
</script>
<style>
.footer
{
  font-size: .6em;
  border-top:1px solid black;
  margin-top: 2em;
  padding-top: .5em;
  margin-bottom: 2em;
}
</style>
