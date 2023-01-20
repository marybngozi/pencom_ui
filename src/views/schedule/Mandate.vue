<template>
  <section class="dash px-3 pb-5 pt-2">
    <div class="coln mb-5">
      <!-- print & back button -->
      <div id="control-btns" class="d-flex justify-content-end gap-5 py-2 mb-3">
        <button v-if="loggedIn" @click="$router.go(-1)" class="btn-back">
          Back
        </button>
        <button class="btn-print" v-print="printObj">Print</button>
      </div>

      <!-- start Print Content-->
      <div v-if="showMandate" class="container-fluid" id="printArea">
        <table
          style="width: 95%; margin: 0 auto; page-break-inside: auto"
          id="scheduleReciept"
        >
          <!-- title -->
          <tr>
            <td
              style="
                width: 50%;
                font-weight: 700;
                font-size: 1.5rem;
                line-height: 2rem;
                color: #053a51;
                padding-bottom: 1.125rem;
              "
            >
              Pension Contribution Mandate
            </td>
            <td
              style="
                width: 50%;
                text-align: right;
                font-weight: 700;
                font-size: 1rem;
                line-height: 1.5rem;
                color: #808080;
                padding-bottom: 1.125rem;
              "
            >
              {{ new Date() | moment("MMMM DD, YYYY") }}
            </td>
          </tr>

          <!-- blue part -->
          <tr>
            <td
              colspan="2"
              style="
                background: #def1ff;
                padding: 2.5rem 1.4375rem;
                width: 100%;
              "
            >
              <table style="width: 100%">
                <tr>
                  <td style="width: 50%">
                    <table>
                      <tr>
                        <td class="blue-small-text">Beneficiary Information</td>
                      </tr>
                      <tr>
                        <td>
                          <span class="blue-slant-text">Company Name:</span>
                          <span class="blue-bold-text">
                            {{ companyName }}
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <span class="blue-slant-text">Company Code:</span>
                          <span class="blue-bold-text">{{ companyCode }}</span>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <span class="blue-slant-text">Schedule Period:</span>
                          <span class="blue-bold-text">
                            {{ this.month }}, {{ this.year }}
                          </span>
                        </td>
                      </tr>
                    </table>
                  </td>

                  <td style="width: 50%; text-align: right">
                    <table style="width: 100%; text-align: right">
                      <tr>
                        <td class="blue-small-text" style="width: 100%">
                          Payment Information
                        </td>
                      </tr>
                      <tr>
                        <td style="width: 100%">
                          <span class="blue-slant-text">Invoice No:</span>
                          <span class="blue-bold-text">{{ invoiceNo }}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="width: 100%">
                          <span class="blue-slant-text">Total Amount:</span>
                          <span class="blue-bold-text">
                            {{ amount | toCurrency }}
                          </span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- data part -->
          <tr>
            <td colspan="2" style="padding: 2.5rem 1.4375rem; width: 100%">
              <table style="width: 100%">
                <tr class="thead" style="width: 100%">
                  <td style="width: 20%">PFC</td>
                  <td style="width: 50%">PFA</td>
                  <td style="width: 10%">Staff Count</td>
                  <td style="width: 20%">AMOUNT (₦)</td>
                </tr>

                <template v-for="(pfc, i) in items">
                  <tr v-for="(pfa, k) in pfc.pfas" :key="i + '-' + k">
                    <td
                      style="
                        font-weight: 400;
                        font-size: 1.25rem;
                        line-height: 1.875rem;
                        color: #17517e;
                      "
                    >
                      <span v-if="k == 0">{{ pfc.pfc }}</span>
                    </td>
                    <td>{{ pfa.pfa }}</td>
                    <td class="gray-sm-box">{{ pfa.itemCount }}</td>
                    <td class="blue-sm-box">
                      {{ pfa.pfaAmount | toCurrency }}
                    </td>
                  </tr>

                  <!-- eslint-disable-next-line vue/require-v-for-key -->
                  <tr>
                    <td
                      style="
                        font-weight: 700;
                        font-size: 1rem;
                        line-height: 1.5rem;
                        color: #c0c0c0;
                      "
                    >
                      Subtotal
                    </td>
                    <td></td>
                    <td class="gray-sm-box" style="background: #f3efef">
                      {{ pfc.itemCount }}
                    </td>
                    <td class="blue-sm-box" style="background: #eff7ff">
                      {{ pfc.pfcAmount | toCurrency }}
                    </td>
                  </tr>
                </template>

                <tr>
                  <td colspan="4" style="padding-top: 1rem"></td>
                </tr>

                <tr>
                  <td
                    style="
                      padding: 10px;
                      background: #eff7ff;
                      font-weight: 700;
                      font-size: 2rem;
                      line-height: 3rem;
                    "
                  >
                    TOTAL
                  </td>
                  <td></td>
                  <td
                    colspan="2"
                    style="
                      padding: 0.625rem 1.25rem;
                      background: #eff7ff;
                      font-weight: 700;
                      font-size: 1.5rem;
                      line-height: 2.25rem;
                    "
                  >
                    {{ grandTotal | toCurrency }}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!--  -->
          <tr>
            <td style="padding: 2.5rem 0 2.5rem 1.4375rem; width: 40%">
              <span class="">
                <img :src="qCode" alt="" width="90" height="90" />
              </span>
            </td>

            <td style="padding: 2.5rem 1.4375rem 2.5rem 0; width: 60%">
              <table>
                <tr>
                  <th style="font-size: 1.3rem">To make payment</th>
                </tr>
                <tr>
                  <td>
                    Proceed to any commercial bank, use
                    <b>Paydirect Pencom Payment</b> to make payment
                  </td>
                </tr>
                <tr>
                  <td style="font-size: 0.7rem"><b>OR</b></td>
                </tr>
                <tr>
                  <td>
                    <span>
                      Visit
                      <a
                        class="text-decoration-none"
                        target="_blank"
                        href="https://biopay.ng/pencom/"
                        >https://biopay.ng/pencom</a
                      >
                      to make payment via the web.
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
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

  computed: {
    loggedIn() {
      return !!this.$store.state.user;
    },
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
table {
  border-collapse: inherit;
}
@media print {
  table {
    page-break-inside: avoid;
  }
  #control-btns {
    display: none !important;
  }
  #hubspot-messages-iframe-container {
    display: none !important;
  }
}
#printArea {
  overflow-y: auto;
  height: calc(100vh - 90px);
}
#printArea::-webkit-scrollbar {
  display: none;
}
#printArea {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.btn-print {
  padding: 0.375rem 1.875rem;
  font-size: 1rem;
  background: #17517e;
  border: none;
  border-radius: 1.875rem;
  font-weight: 700;
  color: #ffffff;
}
.btn-back {
  padding: 0.375rem 1.875rem;
  border: 1px solid #c7c7c7;
  border-radius: 2.5rem;
  font-weight: 700;
  font-size: 1rem;
  line-height: 1.375rem;
  color: #808080;
}
.gap-5 {
  gap: 0.4rem;
}
.blue-small-text {
  font-weight: 400;
  font-size: 0.75rem;
  line-height: 1.125rem;
  color: #03435f;
}
.blue-slant-text {
  font-style: italic;
  font-weight: 400;
  font-size: 1rem;
  line-height: 1.5rem;
  color: #252a2f;
}
.blue-bold-text {
  font-weight: 700;
  font-size: 1rem;
  line-height: 1.5rem;
  color: #252a2f;
  margin-left: 4px;
}
.thead {
  font-weight: 700;
  font-size: 0.75rem;
  line-height: 1.125rem;
  color: #17517e;
}
.blue-sm-box {
  padding: 10px;
  border: 2px solid #bde2ff;
  font-weight: 700;
  font-size: 1rem;
  line-height: 1.5rem;
  color: #2b2b2b;
}
.gray-sm-box {
  padding: 10px;
  border: 2px solid #eeeeee;
  text-align: center;
  font-weight: 500;
  font-size: 1rem;
  line-height: 1.5rem;
  color: #2b2b2b;
}
</style>
