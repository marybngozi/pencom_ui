<template>
  <section class="dash rounded px-3 pb-5 pt-2">
    <div class="coln mb-5">
      <h4 class="mb-4">Schedule Mandate</h4>

      <!-- <div class="card"> -->
      <div class="d-flex justify-content-end card-header py-2">
        <button class="btn btn-primary px-2 btn-sm" v-print="printObj">
          Print
        </button>
      </div>

      <!-- Start Content-->
      <div v-if="showMandate" class="container-fluid">
        <div class="row" id="scheduleReciept">
          <div class="card-body p-0">
            <div class="row d-flex justify-content-between p-3 px-1">
              <div class="col-md-4">
                <h1 class="font-weight-bold">MANDATE</h1>
              </div>
              <div class="col-md-3 text-right">
                Date: {{ new Date() | moment("DD-MM-YYYY") }}
              </div>
            </div>

            <hr class="my-3" />

            <div class="row pb-3 p-3 px-5">
              <div class="col-md-6 col-xs-12">
                <h5 class="font-weight-bold mb-4">Beneficiary Information</h5>
                <p class="mb-1">
                  Name: <b>{{ companyName }}</b>
                </p>
                <p>
                  Company Code:
                  <b>{{ companyCode }}</b>
                </p>
              </div>

              <div class="col-md-6 col-xs-12 text-right">
                <h4 class="font-weight-bold mb-4">Payment Information</h4>
                <h5>
                  Item: <b>{{ itemName }}</b>
                </h5>
                <p class="mb-1 text-uppercase">
                  Invoice No:
                  <b class="h5 font-weight-bolder">{{ invoiceNo }}</b>
                </p>
                <p class="text-uppercase">
                  Amount:
                  <b class="h5 font-weight-bolder">{{ amount | toCurrency }}</b>
                </p>
                <p class="mb-1">&nbsp;</p>
              </div>
            </div>

            <div class="row p-3 px-5">
              <div class="col-md-12">
                <table class="table table-striped">
                  <thead>
                    <tr>
                      <th
                        class="border-0 text-uppercase small font-weight-bold"
                      >
                        Description
                      </th>
                      <th
                        class="border-0 text-uppercase small font-weight-bold"
                      >
                        Pencom Category
                      </th>
                      <th
                        class="border-0 text-uppercase small font-weight-bold"
                      >
                        Period
                      </th>
                      <th
                        class="border-0 text-uppercase small font-weight-bold"
                      >
                        Amount
                      </th>
                      <th
                        class="border-0 text-uppercase small font-weight-bold"
                      >
                        Paid
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Pencom Payment</td>
                      <td>{{ itemName }}</td>
                      <td>{{ month }}, {{ year }}</td>
                      <td>{{ amount | toCurrency }}</td>
                      <td>{{ paymentStatus == 0 ? "Not paid" : "Paid" }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div class="container-fluid border border-dark text-dark mb-5">
              <div class="row p-5 d-flex justify-content-between">
                <div class="">
                  <span class="">
                    <img :src="qCode" alt="" width="90" height="90" />
                  </span>
                </div>
                <div class="">
                  <div class="">
                    <h5 class="">Note to Agent</h5>
                    <span>
                      Proceed to any Bank to make Payment to fund your wallet.
                      Mandate also sent to email ({{ userEmail }})
                    </span>
                  </div>
                  <div class="mt-5">
                    <h5 class="">Note to Bank Teller</h5>
                    <span>
                      Visit
                      <a
                        class="text-decoration-none"
                        target="_blank"
                        href="https://www.quickteller.com/"
                        >https://www.quickteller.com</a
                      >
                      to make payment for this mandate.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- end container-fluid -->

      <div
        v-else-if="!showMandate && getting"
        class="text-center mt-5 text-secondary"
      >
        <i class="fas fa-spinner fa-spin fa-3x"></i>
        <span>Getting Mandate...</span>
      </div>

      <div v-else class="text-center mt-5 text-secondary">
        <i class="fas fa-unlink text-secondary fa-3x mt-2"></i>
        <span>Link is broken or invalid</span>
      </div>
    </div>
  </section>
</template>
<script>
import QRCode from "qrcode";
import { guestAxios } from "../../services/AxiosInstance";

export default {
  name: "Mandate",
  data() {
    return {
      getting: true,
      printObj: {
        id: "scheduleReciept",
        popTitle: "Pencom MANDATE",
      },
      showMandate: false,
      companyName: null,
      qCode: "#",
      todayDate: null,
      itemName: null,
      itemCode: null,
      amount: null,
      invoiceNo: null,
      year: null,
      month: null,
      paymentStatus: null,
    };
  },

  async beforeCreate() {
    try {
      this.getting = true;

      const invoiceNo = this.$route.params.invoiceNo;

      if (!invoiceNo) {
        this.$router.push({ path: "/404" });
      }

      // Generating QRcode for the route
      const qText = `${location.origin}/${this.$route.fullPath}`;

      // With promises
      this.qCode = await QRCode.toDataURL(qText);

      const api = "schedule/get-mandate";
      const res = await guestAxios.post(api, { invoiceNo });

      this.getting = false;
      if (!res) {
        this.$router.push({ path: "/404" });
        return;
      }

      const { data } = res;

      const value = data.data;
      this.companyCode = value.companyCode;
      this.companyName = value.companyName;
      this.itemName = value.itemName;
      this.amount = value.item.amount;
      this.month = value.item.month;
      this.year = value.item.year;
      this.paymentStatus = value.item.paymentStatus;
      this.invoiceNo = value.item.invoiceNo;

      this.showMandate = true;
    } catch (err) {
      console.log(err);
      this.getting = false;
    }
  },
};
</script>
<style scoped>
@import "../../assets/css/dashboard.css";
</style>
