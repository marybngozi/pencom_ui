<template>
  <section class="dash rounded px-3 pb-5 pt-2">
    <div class="coln mb-5">
      <!-- print button -->
      <div class="d-flex justify-content-end py-2">
        <button class="btn-print" v-print="printObj">Print</button>
      </div>

      <!-- start Print Content-->
      <div v-if="showMandate" class="container-fluid" id="printArea">
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
                <p class="mb-1">
                  Company Code:
                  <b>{{ companyCode }}</b>
                </p>
                <p>
                  Period:
                  <b>{{ this.month }}, {{ this.year }}</b>
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
                <table class="table border">
                  <template v-for="(pfc, i) in items">
                    <thead class="" :key="pfc._id">
                      <tr>
                        <th style="width: 10%" scope="col">PFC</th>
                        <th style="width: 60%" scope="col">
                          {{ pfc.pfc }}
                        </th>
                        <th style="width: 5%" scope="col">Count</th>
                        <th style="width: 20%" cope="col">Amount</th>
                      </tr>
                    </thead>
                    <tbody :key="i">
                      <tr v-for="(pfa, k) in pfc.pfas" :key="k">
                        <th></th>
                        <td>{{ pfa.pfa }}</td>
                        <td>{{ pfa.itemCount }}</td>
                        <td>{{ pfa.pfaAmount | toCurrency }}</td>
                      </tr>
                      <tr>
                        <th>Total</th>
                        <td></td>
                        <td>{{ pfc.itemCount }}</td>
                        <td>{{ pfc.pfcAmount | toCurrency }}</td>
                      </tr>
                    </tbody>
                  </template>

                  <tfoot>
                    <tr>
                      <th style="width: 10%" scope="col"></th>
                      <th style="width: 60%" scope="col">Grand Total</th>
                      <th style="width: 5%" scope="col"></th>
                      <th style="width: 20%" scope="col">
                        {{ grandTotal | toCurrency }}
                      </th>
                    </tr>
                  </tfoot>
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
                      Mandate also sent to email
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
      <!-- end Print content -->

      <!-- loader -->
      <div
        v-else-if="!showMandate && getting"
        class="text-center mt-5 text-secondary"
      >
        <i class="fas fa-spinner fa-spin fa-3x"></i>
        <span>Getting Mandate...</span>
      </div>

      <!-- broken link -->
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
      items: [],
      grandTotal: 0,
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
      const qText = `${location.origin}${this.$route.fullPath}`;

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
      this.items = data.items;
      this.companyCode = value.companyCode;
      this.companyName = value.companyName;
      this.itemName = value.itemName;
      this.amount = this.items[0].invoiceAmount;
      this.month = this.$months[this.items[0].month];
      this.year = this.items[0].year;
      this.paymentStatus = this.items[0].paymentStatus;
      this.invoiceNo = this.items[0].invoiceNo;

      // get the totals
      this.grandTotal = this.items[0].invoiceAmount;

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
.btn-print {
  padding: 6px 1.875rem;
  font-size: 1rem;
  background: #17517e;
  border: none;
  border-radius: 1.875rem;
  font-weight: 700;
  color: #ffffff;
}
#printArea {
  overflow-y: scroll;
  height: calc(100vh - 150px);
}
#printArea::-webkit-scrollbar {
  display: none;
}
#printArea {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
