<template>
  <section class="dash rounded px-3 pb-5 pt-2">
    <div class="coln mb-5">
      <h4 class="mb-4">Schedule Payment Details</h4>

      <!-- for payment details -->
      <div class="justify-content-center col-md-11 col-lg-9 mx-auto my-5">
        <div v-if="showData" class="row justify-content-around mt-3">
          <div>
            <p class="bg-light py-3 px-4">
              Name:
              <span class="font-weight-bold">{{
                paymentDetails.companyName
              }}</span>
            </p>
            <p class="bg-light py-3 px-4">
              Email:
              <span class="font-weight-bold">{{ paymentDetails.email }}</span>
            </p>
            <p class="bg-light py-3 px-4">
              Company Code:
              <span class="font-weight-bold">{{
                paymentDetails.companyCode
              }}</span>
            </p>
            <p class="bg-light py-3 px-4">
              Month:
              <span class="font-weight-bold">
                {{ $months[paymentDetails.month] }}
              </span>
            </p>
          </div>

          <div>
            <p class="bg-light py-3 px-4">
              Invoice No:
              <span class="font-weight-bold">{{
                paymentDetails.invoiceNo
              }}</span>
            </p>
            <p class="bg-light py-3 px-4">
              Amount:
              <span class="font-weight-bold">
                {{ paymentDetails.amount | toCurrency }}
              </span>
            </p>
            <p class="bg-light py-3 px-4">
              Item:
              <span class="font-weight-bold">
                {{ paymentDetails.itemName }}
              </span>
            </p>
            <p class="bg-light py-3 px-4">
              Year:
              <span class="font-weight-bold">
                {{ paymentDetails.year }}
              </span>
            </p>
          </div>
        </div>

        <div v-if="!showData" class="row justify-content-center mt-5">
          <div
            class="spinner-grow text-secondary"
            style="width: 3rem; height: 3rem"
            role="status"
          >
            <span class="sr-only">Loading...</span>
          </div>
        </div>
      </div>

      <hr v-if="showData" />

      <!-- for payment options -->
      <div
        v-if="showData"
        class="justify-content-center col-md-11 col-lg-9 mx-auto mt-3 mb-4"
      >
        <h6 class="text-center font-weight-bolder">Select Payment Options</h6>

        <div class="row justify-content-around mt-3">
          <div class="col-md-4" style="height: 200px">
            <button
              @click="walletPayment()"
              class="btn py-4 w-100 h-100 bg-light"
              :disabled="!enableWallet || wpaying"
            >
              <span class="text-info font-weight-bold">Wallet</span>
              <br /><br />
              <span
                >Wallet Amount:
                <span class="font-weight-bold">{{
                  wallet.amount | toCurrency
                }}</span></span
              ><br /><br />
              <small class="text-black-50" v-if="enableWallet">
                Your Wallet will be debited, since there is enough fund
              </small>
              <small class="text-black-50" v-else>
                Your wallet is empty<br />
                Use the Quick Teller to fund your Wallet
              </small>
            </button>
          </div>

          <div class="col-md-4" style="height: 200px">
            <!-- TODO Disabled untill real book and hold is implemented -->
            <button
              disabled
              @click="bookAndHold()"
              class="btn py-4 w-100 h-100 bg-light"
            >
              <span class="text-info font-weight-bold">Web Payment</span>
              <br /><br />
              <small class="text-black-50">
                Click to Pay using Quickteller, Bank Transfer, Card or USSD
              </small>
            </button>
          </div>

          <div class="col-md-4" style="height: 200px">
            <router-link
              target="_blank"
              :to="'/schedule-mandate/' + paymentDetails.invoiceNo"
              class="btn w-100 h-100 bg-light text-info font-weight-bold pt-5"
              :disabled="!enableWallet"
            >
              <span> Bank Branch </span>
              <br /><br />
              <small class="text-black-50">
                You have to take the Mandate and proceed to make payment in the
                Bank over the counter
              </small>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { secureAxios } from "../../services/AxiosInstance";

export default {
  name: "Payment",
  data() {
    return {
      getting: true,
      wpaying: false,
      paymentDetails: {},
      showData: false,
      wallet: {},
      enableWallet: false,
      showModal: false,
      custReference: null,
      fullPage: false,
    };
  },

  async beforeCreate() {
    try {
      this.getting = true;

      const invoiceNo = this.$route.params.invoiceNo;

      if (!invoiceNo) {
        this.$router.push({ path: "/view-processed" });
      }

      const api = `schedule/payment/${invoiceNo}`;
      const res = await secureAxios.get(api);

      this.getting = false;
      if (!res) {
        this.$router.push({ path: "/view-processed" });
        return;
      }

      const { data } = res;

      this.paymentDetails = data.data;
      this.wallet = data.wallet;
      this.enableWallet = this.wallet.amount >= this.paymentDetails.amount;

      this.showData = true;
    } catch (err) {
      console.log(err);
      this.getting = false;
    }
  },

  methods: {
    async walletPayment() {
      try {
        if (!this.enableWallet) {
          this.$swal({
            icon: "error",
            text: "Wallet Insufficient fund",
          });
          return;
        }

        const result = await this.$swal({
          icon: "question",
          title: `Your wallet balance will be used to clear the schdeule`,
          showDenyButton: true,
          confirmButtonText: "Ok",
          denyButtonText: "No",
        });

        if (!result.isConfirmed) {
          return;
        }

        const loader = this.$loading.show({
          // Optional parameters
          loader: "bars",
          color: "#0b2238",
          backgroundColor: "#343232",
          height: 100,
          width: 100,
        });

        this.wpaying = true;

        const api = "payment/wallet";

        const res = await secureAxios.post(api, {
          invoiceNo: this.paymentDetails.invoiceNo,
          walletCode: this.wallet.walletCode,
          companyCode: this.paymentDetails.companyCode,
        });

        this.wpaying = false;
        loader.hide();
        if (!res) {
          return;
        }

        const { data } = res;

        this.$swal({
          icon: "success",
          text: data.message,
        });

        // go to processed list
        this.$router.push({ path: "/view-processed" });
      } catch (err) {
        console.log(err);
        this.wpaying = false;
      }
    },

    bookAndHold() {
      // make request for the interswitch book and hold
      const baseU = `${this.$urlupload}/bookandhold`;
      const findObj = {
        stateCode: this.paymentDetails.stateCode,
        custReference: this.paymentDetails.custReference,
      };

      this.$http
        .post(baseU, findObj, {
          headers: {
            "x-access-token": this.token,
          },
        })
        .then((response) => {
          // console.log(response.data.data);
          if (response.data.data.code == "S200") {
            this.$swal(response.data.data.message, "", "success");
            // this.$router.push({path: `/schedulereceipt/${this.paymentDetails.custReference}`});

            // make route and open in a new page
            let routeData = this.$router.resolve({
              path: `/schedulereceipt/${this.paymentDetails.custReference}`,
            });
            window.open(routeData.href, "_blank");
          } else {
            this.$swal(response.data.data.message, "", "error");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>
<style scoped>
@import "../../assets/css/dashboard.css";
</style>
