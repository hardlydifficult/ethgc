<template>
  <div>
    <div class="container py-3">
      <div class="row justify-content-center">
        <div class="col-xl-4">
          <button
            @click="cookieClickedDecline"
            v-if="status === 'accept'"
            class="btn btn-primary mb-4"
          >
            Disable Local Storage
          </button>
          <button
            @click="cookieClickedAccept"
            v-else-if="status === 'decline'"
            class="btn btn-primary mb-4"
          >
            Enable Local Storage
          </button>
        </div>
      </div>
    </div>

    <vue-cookie-accept-decline
      :ref="'myPanel1'"
      :elementId="'myPanel1'"
      :debug="false"
      :position="'bottom-left'"
      :type="'floating'"
      :disableDecline="false"
      :transitionName="'slideFromBottom'"
      :showPostponeButton="false"
      @status="cookieStatus"
      @clicked-accept="cookieClickedAccept"
      @clicked-decline="cookieClickedDecline"
      @clicked-postpone="cookieClickedPostpone"
      @removed-cookie="cookieRemovedCookie"
    >
      <!-- Optional -->
      <div slot="postponeContent">
        &times;
      </div>

      <!-- Optional -->
      <div slot="message">
        <div>
          We use local storage to save recent inputs.
        </div>
        <small class="float-right pt-2">
          <a href="/docs/localStorage" target="_blank">Learn More</a>
        </small>
      </div>

      <!-- Optional -->
      <div slot="declineContent">
        Opt Out
      </div>

      <!-- Optional -->
      <div slot="acceptContent">
        Ok
      </div>
    </vue-cookie-accept-decline>
  </div>
</template>

<script>
export default {
  data() {
    return {
      status: null
    };
  },
  methods: {
    cookieStatus(status) {
      console.log("status: " + status);
      this.status = status;
    },
    cookieClickedAccept() {
      console.log("here in accept");
      this.status = "accept";
    },
    cookieClickedDecline() {
      console.log("here in decline");
      this.status = "decline";
    },
    cookieClickedPostpone() {
      console.log("here in postpone");
      this.status = "postpone";
    },
    cookieRemovedCookie() {
      console.log("here in cookieRemoved");
      this.status = null;
      this.$refs.myPanel1.init();
    },

    removeCookie() {
      console.log("Cookie removed");
      this.$refs.myPanel1.removeCookie();
    }
  },
  computed: {
    statusText() {
      return this.status || "No cookie set";
    }
  }
};
</script>

<style lang="scss">
$lighter-grey: #eee;
$light-grey: #ddd;
$grey: darken($light-grey, 9%);
$green: #4caf50;
$dark-green: darken($green, 8%);
$red: #f44336;
$dark-red: darken($red, 8%);
$white: #fff;
$off-white: darken($white, 2%);
$black: #333;
$transition: all 0.2s ease;
.cookie {
  // Bar
  &__bar {
    -ms-overflow-style: none;
    position: fixed;
    overflow: hidden;
    box-sizing: border-box;
    z-index: 9999;
    width: 100%;
    background: $lighter-grey;
    padding: 20px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: column;
    box-shadow: 0 -4px 4px rgba($grey, 0.05);
    border-top: 1px solid $light-grey;
    border-bottom: 1px solid $light-grey;
    font-size: 1rem;
    font-family: -apple-system, BlinkMacSystemFont, Roboto, Oxygen, Ubuntu,
      Cantarell, “Fira Sans”, “Droid Sans”, “Helvetica Neue”, Arial, sans-serif;
    line-height: 1.5;
    @media (min-width: 768px) {
      flex-direction: row;
    }
    &--bottom {
      bottom: 0;
      left: 0;
      right: 0;
    }
    &--top {
      top: 0;
      left: 0;
      right: 0;
    }
    &__postpone-button {
      margin-right: auto;
      -ms-flex: 1 1 auto;
      @media (min-width: 768px) {
        margin-right: 10px;
      }
      &:hover {
        opacity: 0.8;
        cursor: pointer;
      }
    }
    &__content {
      margin-right: 0;
      margin-bottom: 0;
      font-size: 0.9rem;
      overflow: auto;
      width: 100%;
      -ms-flex: 1 1 auto;
      @media (min-width: 768px) {
        margin-right: auto;
        margin-bottom: 0;
      }
    }
    &__buttons {
      transition: $transition;
      display: flex;
      flex-direction: column;
      width: 100%;
      @media (min-width: 768px) {
        flex-direction: row;
        width: auto;
      }
      &__button {
        display: inline-block;
        font-weight: 400;
        text-align: center;
        white-space: nowrap;
        vertical-align: middle;
        user-select: none;
        border: 1px solid transparent;
        padding: 0.375rem 0.75rem;
        line-height: 1.5;
        border-radius: 3px;
        font-size: 0.9rem;
        &:hover {
          cursor: pointer;
          text-decoration: none;
        }
        &--accept {
          -ms-flex: 1 1 auto;
          background: $green;
          background: linear-gradient(lighten($green, 5%), $green);
          color: $white;
          &:hover {
            background: $dark-green;
          }
        }
        &--decline {
          -ms-flex: 1 1 auto;
          background: $red;
          background: linear-gradient(lighten($red, 5%), $red);
          color: $white;
          margin-bottom: 10px;
          &:hover {
            background: $dark-red;
          }
          @media (min-width: 768px) {
            margin-bottom: 0;
            margin-right: 10px;
          }
        }
      }
    }
  }
  // Floating
  &__floating {
    -ms-overflow-style: none;
    position: fixed;
    overflow: hidden;
    box-sizing: border-box;
    z-index: 9999;
    width: 90%;
    background: $off-white;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    box-shadow: 0 4px 8px rgba($grey, 0.3);
    border: 1px solid $light-grey;
    font-size: 1rem;
    font-family: -apple-system, BlinkMacSystemFont, Roboto, Oxygen, Ubuntu,
      Cantarell, “Fira Sans”, “Droid Sans”, “Helvetica Neue”, Arial, sans-serif;
    line-height: 1.5;
    border-radius: 6px;
    @media (min-width: 768px) {
      max-width: 300px;
    }
    // For now I think the best idea is to show the panel centered
    // and on the bottom when on small screens
    bottom: 10px;
    left: 0;
    right: 0;
    margin: 0 auto;
    @media (min-width: 768px) {
      &--bottom-left {
        bottom: 20px;
        left: 20px;
        right: auto;
        margin: 0 0;
      }
    }
    @media (min-width: 768px) {
      &--bottom-right {
        bottom: 20px;
        right: 20px;
        left: auto;
        margin: 0 0;
      }
    }
    @media (min-width: 768px) {
      &--top-right {
        top: 20px;
        bottom: auto;
        right: 20px;
        left: auto;
        margin: 0 0;
      }
    }
    @media (min-width: 768px) {
      &--top-left {
        top: 20px;
        bottom: auto;
        right: auto;
        left: 20px;
        margin: 0 0;
      }
    }
    &__postpone-button {
      display: inline-flex;
      padding: 5px 0 0 20px;
      margin-bottom: -10px;
      margin-right: auto;
      &:hover {
        opacity: 0.8;
        cursor: pointer;
      }
    }
    &__content {
      font-size: 0.95rem;
      margin-bottom: 0;
      padding: 15px 20px;
      overflow: auto;
      @media (min-width: 768px) {
        margin-bottom: 0;
      }
    }
    &__buttons {
      transition: $transition;
      display: flex;
      flex-direction: row;
      height: auto;
      width: 100%;
      &__button {
        background-color: $lighter-grey;
        font-weight: bold;
        font-size: 0.9rem;
        width: 100%;
        min-height: 40px;
        white-space: nowrap;
        user-select: none;
        border-bottom: 1px solid $light-grey;
        border-top: 1px solid $light-grey;
        border-left: none;
        border-right: none;
        padding: 0.375rem 0.75rem;
        &:first-child {
          border-right: 1px solid $light-grey;
        }
        &:hover {
          cursor: pointer;
          text-decoration: none;
        }
        &--accept {
          color: $green;
          -ms-flex: 1 1 auto;
          &:hover {
            background: $dark-green;
            color: $white;
          }
        }
        &--decline {
          color: $red;
          -ms-flex: 1 1 auto;
          &:hover {
            background: $dark-red;
            color: $white;
          }
        }
      }
    }
  }
}
// Animations
// slideFromBottom
.slideFromBottom-enter,
.slideFromBottom-leave-to {
  transform: translate(0px, 10em);
}
.slideFromBottom-enter-to,
.slideFromBottom-leave {
  transform: translate(0px, 0px);
}
.slideFromBottom-enter-active {
  transition: transform 0.2s ease-out;
}
.slideFromBottom-leave-active {
  transition: transform 0.2s ease-in;
}
// slideFromTop
.slideFromTop-enter,
.slideFromTop-leave-to {
  transform: translate(0px, -10em);
}
.slideFromTop-enter-to,
.slideFromTop-leave {
  transform: translate(0px, 0px);
}
.slideFromTop-enter-active {
  transition: transform 0.2s ease-out;
}
.slideFromTop-leave-active {
  transition: transform 0.2s ease-in;
}
// fade
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
