<template>
  <section class="dash rounded px-3 pb-5 pt-2">
    <div class="coln">
      <div class="form">
        <h4 class="mb-4">List Processed Schedule</h4>

        <div class="mt-4">
          <label for="itemCode"> Item </label>
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

        <div class="mt-3">
          <label class="d-flex justify-content-between" for="dateStart">
            <span> Date range (From) </span>
            <span class="fs-8 text-info">Based on the date of payment</span>
          </label>
          <input
            id="dateStart"
            v-model="form.dateStart"
            class="form-control input"
            type="date"
            placeholder="dd/mm/yyyy"
          />
        </div>

        <div class="mt-2">
          <label for="dateEnd"> Date range (To) </label>
          <input
            id="dateEnd"
            v-model="form.dateEnd"
            class="form-control input"
            type="date"
            placeholder="dd/mm/yyyy"
          />
          <small v-if="dateNotReady" class="text-danger">
            Both dates should be provided or none
          </small>
        </div>

        <button
          :disabled="getting"
          @click="getProcessedSchedule"
          class="btn mt-4 w-100 button"
        >
          <span>Get Processed Schedule</span>
          <span
            v-if="getting"
            class="spinner-border spinner-border-sm text-light ml-3"
            role="status"
          ></span>
        </button>
      </div>

      <!-- Processed schedules -->
      <div class="mt-5 pb-4 mb-5">
        <b-table
          id="my-table"
          :fields="fields"
          small
          outlined
          :busy="getting"
          hover
          :items="items"
          :per-page="perPage"
          :current-page="currentPage"
          show-empty
        >
          <template #cell(transmitted)="data">
            <span v-if="data.value" class="text-primary">Sent</span>
            <span v-else class="text-secondary">Not sent</span>
          </template>

          <template #cell(createdAt)="data">
            {{ data.value | moment("DD-MM-YYYY") }}
          </template>

          <template #cell(period)="data">
            {{ $months[data.item.month] }}, {{ data.item.year }}
          </template>

          <template #cell(amount)="data">
            {{ data.value | toCurrency }}
          </template>

          <template #cell(action)="data">
            <button
              @click="getPfas(data, data.item._id)"
              class="btn btn-sm btn-info m-1"
            >
              {{ data.detailsShowing ? "Hide" : "Show" }} PFAs
            </button>

            <button
              class="btn btn-sm btn-secondary m-1"
              @click="downloadItems(data.item._id)"
            >
              Download
            </button>

            <button
              v-if="!data.item.transmitted"
              v-b-tooltip.hover
              title="Transmit transaction to the PFA"
              class="btn btn-sm btn-primary m-1"
              @click="transmit(data.item._id)"
            >
              Transmit
            </button>
          </template>

          <template #row-details>
            <b-card bg-variant="light">
              <!-- START PFA INNER TABLE -->
              <ListPfaTable
                :batchId="batchId"
                :companyCode="companyCode"
                @showItems="getItems"
                @getDownloads="downloadItems"
                @transmit="transmit"
              />

              <!-- END PFA INNER TABLE -->
            </b-card>
          </template>
        </b-table>

        <b-pagination
          v-model="currentPage"
          :total-rows="rows"
          :per-page="perPage"
          aria-controls="my-table"
          size="sm"
          limit="10"
        >
        </b-pagination>
      </div>

      <!-- Items modal -->
      <b-modal
        id="show-items"
        size="xl"
        scrollable
        :cancel-disabled="true"
        title="Schedule Items"
      >
        <b-table
          id="item-table"
          :fields="fieldsItem"
          outlined
          small
          responsive
          striped
          :busy="fetching"
          hover
          :items="fetchItems"
          :per-page="perPage"
          :current-page="currentPageItem"
          show-empty
        >
          <template #cell(amount)="data">
            {{ data.value | toCurrency }}
          </template>

          <template #cell(employeeNormalContribution)="data">
            {{ data.value | toCurrency }}
          </template>

          <template #cell(employerNormalContribution)="data">
            {{ data.value | toCurrency }}
          </template>

          <template #cell(employeeVoluntaryContribution)="data">
            {{ data.value | toCurrency }}
          </template>

          <template #cell(employerVoluntaryContribution)="data">
            {{ data.value | toCurrency }}
          </template>
        </b-table>

        <b-pagination
          v-model="currentPageItem"
          :total-rows="rowsItem"
          :per-page="perPage"
          aria-controls="item-table"
          size="sm"
          limit="10"
        >
        </b-pagination>

        <template #modal-footer="{ ok }">
          <!-- Emulate built in modal footer ok and cancel button actions -->
          <b-button variant="info" @click="ok()"> OK </b-button>
        </template>
      </b-modal>
    </div>
  </section>
</template>
<script>
import { mapGetters } from "vuex";
import { secureAxios } from "../../services/AxiosInstance";
import ListPfaTable from "@/components/pfa/ListPfaTable.vue";

export default {
  name: "ListContribution",
  components: {
    ListPfaTable,
  },
  data() {
    return {
      getting: false,
      fetching: false,
      perPage: 10,
      currentPage: 1,
      currentPageItem: 1,
      batchId: null,
      companyCode: null,
      pfaCode: null,
      rowsItem: 0,
      form: {
        itemCode: null,
        dateStart: null,
        dateEnd: null,
      },
      items: [],
      fields: [
        {
          key: "companyName",
          label: "Company",
        },
        {
          key: "period",
          label: "Period",
        },
        {
          key: "itemCount",
          label: "Contributions count",
        },
        {
          key: "transmitted",
          label: "Status",
        },
        {
          key: "amount",
          label: "Total Amount",
        },
        {
          key: "createdAt",
          label: "Date",
        },
        {
          key: "action",
          label: "Actions",
        },
      ],
      fieldsItem: [
        {
          key: "staffName",
          label: "Staff Name",
        },
        {
          key: "rsaPin",
          label: "RSA PIN",
        },
        {
          key: "employeeNormalContribution",
          label: "Employee Normal Contribution",
        },
        {
          key: "employerNormalContribution",
          label: "Employer Normal Contribution",
        },
        {
          key: "employeeVoluntaryContribution",
          label: "Employee Voluntary Contribution",
        },
        {
          key: "employerVoluntaryContribution",
          label: "Employer Voluntary Contribution",
        },
        {
          key: "amount",
          label: "Total Amount",
        },
      ],
    };
  },
  async beforeCreate() {
    try {
      this.getting = true;

      const api = "payment/get-batch-contribution";
      const res = await secureAxios.post(api, this.form);

      this.getting = false;
      if (!res) {
        return;
      }

      const { data } = res;
      this.items = data.data;
    } catch (err) {
      console.log(err);
      this.getting = false;
    }
  },
  computed: {
    ...mapGetters(["allItems"]),

    dateNotReady() {
      return (
        (this.form.dateStart && !this.form.dateEnd) ||
        (!this.form.dateStart && this.form.dateEnd)
      );
    },

    rows() {
      return this.items.length;
    },
  },

  methods: {
    async getProcessedSchedule() {
      try {
        if (this.dateNotReady) {
          this.$swal({
            icon: "error",
            text: "Both dates have to be provided",
          });
          return;
        }

        this.getting = true;

        const api = "payment/get-batch-contribution";
        const res = await secureAxios.post(api, this.form);

        this.getting = false;
        if (!res) {
          return;
        }

        const { data } = res;
        this.items = data.data;
      } catch (err) {
        console.log(err);
        this.getting = false;
      }
    },

    async getPfas(data, { batchId, companyCode }) {
      this.batchId = batchId;
      this.companyCode = companyCode;

      data.toggleDetails();
    },

    async getItems({ batchId, companyCode, pfaCode }) {
      this.batchId = batchId;
      this.companyCode = companyCode;
      this.pfaCode = pfaCode;

      this.$bvModal.show("show-items");
    },

    async fetchItems({ currentPage, perPage }) {
      try {
        const api = `payment/get-item-contribution?page=${currentPage}&size=${perPage}`;

        const res = await secureAxios.post(api, {
          pfaCode: this.pfaCode,
          batchId: this.batchId,
          companyCode: this.companyCode,
        });

        if (!res) {
          return [];
        }

        const { data } = res;

        this.rowsItem = data.meta.total;
        return data.data;
      } catch (err) {
        console.log(err);
        return [];
      }
    },

    async downloadItems({ batchId, companyCode, pfaCode }) {
      try {
        const loader = this.$loading.show({
          // Optional parameters
          loader: "bars",
          color: "#0b2238",
          backgroundColor: "#343232",
          height: 100,
          width: 100,
        });

        const api = "payment/download-contributions";

        const res = await secureAxios.post(
          api,
          { batchId, companyCode, pfaCode },
          { responseType: "blob" }
        );

        loader.hide();
        if (!res) {
          return;
        }

        const fileURL = window.URL.createObjectURL(
          new Blob([res.data], { type: "application/vnd.ms-excel" })
        );
        const fileLink = document.createElement("a");

        fileLink.href = fileURL;
        fileLink.setAttribute("download", "Contributions.xlsx");
        document.body.appendChild(fileLink);

        fileLink.click();
      } catch (err) {
        console.log(err);
        this.fetching = false;
      }
    },

    async transmit({ batchId, companyCode, pfaCode }) {
      try {
        const result = await this.$swal({
          icon: "info",
          text: "This batch of contribution will be sent to the individual PFA",
          showDenyButton: true,
          confirmButtonText: "Proceed",
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

        const api = "payment/transmit-contributions";

        const res = await secureAxios.post(api, {
          batchId,
          companyCode,
          pfaCode,
        });

        loader.hide();
        if (!res) {
          return;
        }

        const { data } = res;
        this.$swal({
          icon: "success",
          text: data.message,
        });

        await this.getProcessedSchedule();
      } catch (err) {
        console.log(err);
        this.fetching = false;
      }
    },
  },
};
</script>
<style scoped>
@import "../../assets/css/dashboard.css";
.card-body {
  padding: 0.25rem;
}
</style>
