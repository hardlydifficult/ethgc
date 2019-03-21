<template>
  <div>
    Redeem Code
    <input type="text" v-model="card.redeemCode" v-on:input="card.customCode = true" />
    <button v-on:click="randomizeCode()">New</button>
    <StatusIcon v-if="card.customCode && status.status !== 'ERROR'" status="WARNING" message="! Warning ! Be careful when choosing your own code. It must not be something someone could guess easily." />
    <StatusIcon v-if="status" :status="status.status" :message="status.message" />
    <div class="small" v-if="card.customCode">
    </div>
  </div>
</template>

<!-- Since there is already a rich ecosystem of ajax libraries    -->
<!-- and collections of general-purpose utility methods, Vue core -->
<!-- is able to remain small by not reinventing them. This also   -->
<!-- gives you the freedom to use what you're familiar with. -->
<script src="https://cdn.jsdelivr.net/npm/axios@0.12.0/dist/axios.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/lodash@4.13.1/lodash.min.js"></script>

<script>
import StatusIcon from '../../Widgets/StatusIcon'
import Random from '../../../logic/random.js'
const random = new Random()

export default {
  components: {
    StatusIcon
  },
  props: {
    cards: Array,
    index: Number
  },
  data: function () {
    return {
      status: undefined,
      bouncer: _.debounce(this.getCodeAvailable, 2000)
    }
  },
  computed: {
    card: function () {
      if(!this.cards) return undefined
      return this.cards[this.index]
    }
  },
  mounted: function () {
    if (!this.card.redeemCode) {
      this.randomizeCode()
    }
  },
  methods: {
    randomizeCode () {
      this.card.redeemCode = random.getRandomCode(16, true)
      this.card.customCode = false
    },
    getCodeAvailable: async function () {
      let available = await this.ethjs.getAddressIsAvailableByCode(this.card.redeemCode)
      if (available) {
        if(this.card.redeemCode.length < 15) {
          this.status = {
            status: "WARNING",
            message: "This redeem code is available but careful with short codes, someone might steal this card."
          }
        } else {
          this.status = {
            status: "SUCCESS",
            message: "This redeem code is available"
          }
        }
      } else {
        this.status = {
          status: "ERROR",
          message: "This redeem code is already in use, pick another."
        }
      }
    }
  },
  watch: {
    'card.redeemCode': function (newCode, oldCode) {
      this.debouncedGetCodeAvailable()
    }
  },
  created: function () {
    // _.debounce is a function provided by lodash to limit how
    // often a particularly expensive operation can be run.
    // In this case, we want to limit how often we access
    // theapi, waiting until the user has completely
    // finished typing before making the ajax request. To learn
    // more about the _.debounce function (and its cousin
    // _.throttle), visit: https://lodash.com/docs#debounce
    this.debouncedGetCodeAvailable = function () {
      this.bouncer.cancel()

      let found = false;
      for (let i = 0; i < this.index; i++) {
        if (this.cards[i].redeemCode == this.card.redeemCode) {
          found = true;
          break;
        }
      }

      if (found) {
        this.status = {
          status: "ERROR",
          message: "Each card must have a unique redeem code."
        }
      } else {
        this.status = {
          status: "LOADING",
          message: "Checking if this code is already in use..."
        }
        this.bouncer()
      }
    }
  }
}
</script>
