<template>
  <section class="dash pb-5 pt-2">
    <div class="coln mb-5">
      <!-- back button -->
      <div
        id="control-btns"
        class="d-flex justify-content-end align-items-center py-2 mb-3"
      >
        <button @click="$router.go(-1)" class="btn-back">Go Back</button>
      </div>

      <!-- for payment -->
      <div
        v-if="showData"
        id="dataArea"
        class="d-flex justify-content-around flex-wrap mt-1 mt-lg-4"
      >
        <div class="box-card col-11 mx-auto mx-lg-0 col-lg-7 mt-3 mt-lg-0">
          <div class="box-head">
            <h6 class="font-weight-bolder">Your Payment details</h6>
          </div>

          <div class="box-info">
            <p>Company Name</p>
            <p>{{ paymentDetails.companyName }}</p>
          </div>
          <div class="box-info">
            <p>Company Code</p>
            <p>{{ paymentDetails.companyCode }}</p>
          </div>
          <div class="box-info">
            <p>Invoice No</p>
            <p>{{ paymentDetails.invoiceNo }}</p>
          </div>
          <div class="box-info">
            <p>Total Amount</p>
            <p>{{ paymentDetails.amount | toCurrency }}</p>
          </div>
          <div class="box-info">
            <p>Contributing year</p>
            <p>{{ paymentDetails.year }}</p>
          </div>
          <div class="box-info">
            <p>Contributing month</p>
            <p>{{ $months[paymentDetails.month] }}</p>
          </div>
        </div>

        <!-- for payment options -->
        <div
          class="box-card col-11 mx-auto mx-lg-0 col-lg-4 mt-5 mt-lg-0 mb-4 mb-lg-0"
        >
          <div class="box-head">
            <h6 class="font-weight-bolder">Your Payment Options</h6>
          </div>

          <div class="pay-btns">
            <button class="pay-btn pay-btn-blue">Pay by Bank Transfer</button>
            <button class="pay-btn pay-btn-white">Pay by USSD</button>
            <router-link
              target="_blank"
              :to="{
                name: 'schedule-mandate',
                params: { invoiceNo: paymentDetails.invoiceNo },
              }"
              class="pay-btn pay-btn-blue"
            >
              Pay at Bank
            </router-link>
          </div>
        </div>
      </div>

      <!-- loader -->
      <div
        v-else-if="!showData && getting"
        class="text-center mt-5 text-secondary"
      >
        <i class="fas fa-spinner fa-spin fa-3x"></i>
        <span>Getting Payment details...</span>
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
/* @import "../../assets/css/dashboard.css"; */
#control-btns {
  height: 72px;
  background: #f9f9f9;
}
#dataArea {
  overflow-y: auto;
  height: calc(100vh - 185px);
}
#dataArea::-webkit-scrollbar {
  display: none;
}
#dataArea {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.btn-back {
  padding: 0.275rem 1.25rem;
  height: 2.6rem;
  border: 1px solid #c7c7c7;
  border-radius: 2.5rem;
  font-weight: 700;
  font-size: 1rem;
  line-height: 1.375rem;
  color: #808080;
  margin-right: 2.19rem;
  background: transparent;
}
.gap-51 {
  gap: 3.1rem;
}
.box-card {
  border: 1px solid #c7c7c7;
  border-radius: 20px;
  padding: 0;
  height: fit-content;
}
.box-head {
  background: #f9f9f9;
  border-radius: 20px 20px 0 0;
}
.box-head h6 {
  padding: 1.6rem 1.5rem;
}
.box-info {
  display: flex;
  justify-content: space-between;
  padding: 1.2rem 1.5rem 0 1.5rem;
}
.box-info p {
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: #252a2f;
}
.box-info p:first-child {
  text-transform: uppercase;
  font-weight: 400;
}
.box-info p:last-child {
  font-weight: 700;
}
.pay-btns {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.pay-btn {
  padding: 0.625rem 1.25rem;
  border-radius: 2.5rem;
  width: 85%;
  margin: 1rem auto;
  text-align: center;
  font-weight: 400;
  font-size: 0.875rem;
  line-height: 1.25rem;
  border: 1px solid #0090ff;
}
.pay-btn.pay-btn-blue {
  background: #0090ff;
  color: #ffffff;
}
.pay-btn.pay-btn-white {
  color: #0090ff;
  background: #ffffff;
}
</style>
