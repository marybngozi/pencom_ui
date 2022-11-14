<template>
  <section class="dash rounded px-3 pb-5 pt-2">
    <div class="coln">
      <div class="form mb-5">
        <h4 class="mb-4">Process Schedule</h4>

        <div class="mt-4">
          <label for="itemCode">
            <span class="text-danger">*</span>
            Item
          </label>
          <select
            name="itemCode"
            v-model="form.itemCode"
            id="itemCode"
            class="form-control"
          >
            <option :value="null">- select an Item -</option>
            <option
              v-for="item in allItems"
              :value="item.itemCode"
              :key="item.itemCode"
            >
              {{ item.itemName }}
            </option>
          </select>
        </div>

        <div class="mt-4">
          <label class="d-flex justify-content-between" for="year">
            <span>
              <span class="text-danger">*</span>
              Year
            </span>
            <span class="fs-8 text-info">As contained in the upload</span>
          </label>
          <select
            name="year"
            v-model="form.year"
            id="year"
            class="form-control"
          >
            <option :value="null">- select a year -</option>
            <option v-for="year in years" :value="year" :key="year">
              {{ year }}
            </option>
          </select>
        </div>

        <div class="mt-4">
          <label class="d-flex justify-content-between" for="month">
            <span>
              <span class="text-danger">*</span>
              Month
            </span>
            <span class="fs-8 text-info">As contained in the upload</span>
          </label>
          <select
            name="month"
            v-model="form.month"
            id="month"
            class="form-control"
          >
            <option :value="null">- select a month -</option>
            <option v-for="(month, i) in $months" :value="i" :key="i">
              {{ month }}
            </option>
          </select>
        </div>

        <button
          :disabled="!getReady || getting"
          @click="getSummary"
          class="btn mt-4 w-100 button"
        >
          <span>Get Summary</span>
          <span
            v-if="getting"
            class="spinner-border spinner-border-sm text-light ml-3"
            role="status"
          ></span>
        </button>
      </div>

      <div v-if="items" class="my-4 pb-5">
        <div class="d-flex justify-content-end my-2">
          <button
            :disabled="!items"
            @click="processSchedule()"
            class="btn btn-sm button px-4"
          >
            Process Schedule
          </button>
        </div>

        <table v-for="(pfc, key, i) in items" :key="i" class="table">
          <thead class="thead-dark-blue">
            <tr>
              <th style="width: 10%" scope="col">PFC</th>
              <th style="width: 60%" scope="col">{{ key }}</th>
              <th style="width: 5%" scope="col">Count</th>
              <th style="width: 20%" cope="col">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(pfa, k) in pfc" :key="k">
              <th></th>
              <td style="width: 10%" scope="col">{{ pfa.pfaName }}</td>
              <td style="width: 10%" scope="col">{{ pfa.count }}</td>
              <td style="width: 10%" scope="col">
                {{ pfa.amount | toCurrency }}
              </td>
            </tr>
          </tbody>
        </table>

        <table class="table">
          <tfoot class="thead-dark-blue">
            <tr>
              <th scope="col">Grand Total</th>
              <th scope="col" colspan="2"></th>
              <th scope="col">{{ grandTotal | toCurrency }}</th>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  </section>
</template>
<script>
import { mapGetters } from "vuex";
import { secureAxios } from "../../services/AxiosInstance";

export default {
  name: "ProcessSchedule",
  data() {
    return {
      getting: false,
      processing: false,
      form: {
        itemCode: null,
        year: null,
        month: null,
      },
      processForm: {
        itemCode: null,
        year: null,
        month: null,
      },
      grandTotal: 0,
      items: null,
      scheduleItems: [],
    };
  },
  computed: {
    ...mapGetters(["allItems"]),

    years() {
      const yearArr = [];
      for (let i = new Date().getFullYear(); i >= 1990; i--) {
        yearArr.push(i);
      }
      return yearArr;
    },

    getReady() {
      return this.form.itemCode && this.form.year && this.form.month;
    },
  },

  methods: {
    async getSummary() {
      if (!this.getReady) {
        this.$swal({
          icon: "error",
          text: "Fill all fields",
        });
        return;
      }

      try {
        this.getting = true;

        const api = "schedule/summarize";
        const res = await secureAxios.post(api, this.form);

        this.getting = false;
        if (!res) {
          return;
        }

        const { data } = res;

        if (!data.data.data.length) {
          this.$swal({
            icon: "error",
            text: "No record found",
          });
          return;
        }

        this.items = data.data.summary;
        this.scheduleItems = data.data.data;

        // get the totals
        this.grandTotal = 0;
        for (const key in this.items) {
          if (Object.hasOwnProperty.call(this.items, key)) {
            const pfc = this.items[key];

            const total = pfc.reduce((a, obj) => {
              return a + obj.amount;
            }, 0);
            const count = pfc.reduce((a, obj) => {
              return a + obj.count;
            }, 0);

            pfc.push({
              pfaName: "Total",
              count: count,
              amount: total,
            });

            this.grandTotal += total;
          }
        }

        this.processForm = { ...this.form };

        // clear the form
        Object.keys(this.form).forEach((key) => {
          this.form[key] = null;
        });
      } catch (err) {
        console.log(err);
        this.getting = false;
      }
    },

    async processSchedule() {
      // warn
      const result = await this.$swal({
        icon: "question",
        title: `Are you sure you want to process this schedule?`,
        showDenyButton: true,
        confirmButtonText: "Yes",
        denyButtonText: "No",
      });

      if (!result.isConfirmed) {
        return;
      }

      try {
        this.processing = true;

        const api = "schedule/process";

        const res = await secureAxios.post(api, {
          payDetails: {
            amount: this.grandTotal.toFixed(2),
            ...this.processForm,
            scheduleUrl: `${location.origin}${location.pathname}/schedule-mandate`,
          },
          payData: this.scheduleItems,
        });

        this.processing = false;
        if (!res) {
          return;
        }

        const { data } = res;

        console.log(data);

        this.$swal({
          icon: "success",
          text: data.message,
        });

        // go to the processed list page
        this.$router.push({ path: `/make-payment/${data.data}` });
      } catch (err) {
        console.log(err);
        this.processing = false;
      }
    },
  },
};
</script>
<style scoped>
@import "../../assets/css/dashboard.css";
</style>
