<template>
  <section class="dash rounded px-3 pb-5 pt-2">
    <div class="coln">
      <h4 class="mb-4">List Uploaded Schedule</h4>

      <!-- Top section -->
      <div class="d-flex justify-content-around">
        <div class="form w-60">
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

          <div class="mt-3">
            <label class="d-flex justify-content-between" for="dateStart">
              <span> Date range (From) </span>
              <span class="fs-8 text-info">Based on the date of upload</span>
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
            :disabled="!getReady || getting"
            @click="getBatches()"
            class="btn mt-4 w-100 button"
          >
            <span>Get Schedule</span>
            <span
              v-if="getting"
              class="spinner-border spinner-border-sm text-light ml-3"
              role="status"
            ></span>
          </button>
        </div>

        <div class="w-40 mt-5">
          <div class="alert alert-info" role="alert">
            <h5 class="">View uploaded schedules</h5>
            <ul>
              <li class="my-2 mx-1">
                You can view your uploaded schedules that has <b>not</b> been
                processed or paid
              </li>
              <li class="m-1">
                You can delete a batch or a single schedule in a batch
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Batch list table -->
      <div v-if="fetched" class="mt-5 mb-4">
        <b-table
          id="my-table"
          :fields="fields"
          outlined
          small
          striped
          :busy="getting"
          hover
          :items="items"
          :per-page="perPage"
          :current-page="currentPage"
          show-empty
        >
          <template #empty>
            <center>No records found</center>
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
              class="btn btn-sm btn-primary mr-2"
              @click="getItems(data.item._id)"
            >
              View Schedules
            </button>
            <button
              class="btn btn-sm btn-info mr-2"
              @click="downloadFile(data.item._id)"
            >
              Download
            </button>
            <button
              class="btn btn-sm btn-danger"
              @click="deleteSchedule(data.item.uploadBatchId)"
            >
              Delete
            </button>
          </template>
        </b-table>

        <b-pagination
          v-model="currentPage"
          :total-rows="rows"
          :per-page="perPage"
          aria-controls="my-table"
          size="sm"
          limit="10"
          page-class="text-blue"
          next-class="text-blue"
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
        class=""
      >
        <!-- centered -->
        <b-table
          id="item-table"
          ref="table"
          :key="key"
          :fields="fieldsItem"
          sticky-header="600px"
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
          <template #cell(createdAt)="data">
            {{ data.value | moment("DD-MM-YYYY") }}
          </template>

          <template #cell(pfaCode)="data">
            {{ data.item.pfa.pfaName }}
          </template>

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

          <template #cell(staffName)="data">
            {{ data.item.firstName }} {{ data.item.lastName }}
          </template>

          <template #cell(action)="data">
            <button
              class="btn btn-sm btn-danger"
              @click="removeSchedule([data.item.id])"
            >
              Delete
            </button>
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

export default {
  name: "ListSchdeule",
  data() {
    return {
      getting: false,
      deleting: false,
      fetching: false,
      fetched: false,
      deleteBatch: false,
      perPage: 10,
      uploadBatchId: null,
      rowsItem: 0,
      key: 1,
      currentPage: 1,
      currentPageItem: 1,
      fetchedItems: [],
      selectedItems: [],
      form: {
        itemCode: null,
        dateStart: null,
        dateEnd: null,
      },
      items: [],
      fields: [
        {
          key: "_id",
          label: "Batch ID",
        },
        {
          key: "period",
          label: "Period",
        },
        {
          key: "amount",
          label: "Total Amount",
        },
        {
          key: "createdAt",
          label: "Uploaded on",
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
          key: "pfaCode",
          label: "PFA",
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
        {
          key: "createdAt",
          label: "Uploaded",
        },
        {
          key: "action",
          label: "Actions",
        },
      ],
    };
  },
  computed: {
    ...mapGetters(["allItems"]),

    rows() {
      return this.items.length;
    },
    getReady() {
      return this.form.itemCode && !this.dateNotReady;
    },
    dateNotReady() {
      return (
        (this.form.dateStart && !this.form.dateEnd) ||
        (!this.form.dateStart && this.form.dateEnd)
      );
    },
  },

  methods: {
    async downloadFile(uploadBatchId) {
      try {
        this.fetching = true;

        const api = "schedule/download-uploaded-items";

        const res = await secureAxios.post(
          api,
          { uploadBatchId },
          { responseType: "blob" }
        );

        this.fetching = false;
        if (!res) {
          return;
        }

        const fileURL = window.URL.createObjectURL(
          new Blob([res.data], { type: "application/vnd.ms-excel" })
        );
        const fileLink = document.createElement("a");

        fileLink.href = fileURL;
        fileLink.setAttribute("download", "Uploaded_schedule.xlsx");
        document.body.appendChild(fileLink);

        fileLink.click();
      } catch (err) {
        console.log(err);
        this.fetching = false;
      }
    },

    formatTableData(data) {
      return data.map((d) => {
        const vd = {
          "STAFF ID": d.staffId,
          "RSA PIN": d.rsaPin,
          AMOUNT: d.amount,
          "STAFF NAME": `${d.firstName} ${d.lastName}`,
          "EMPLOYEE NORMAL CONTRIBUTION": d.employeeNormalContribution,
          "EMPLOYER NORMAL CONTRIBUTION": d.employerNormalContribution,
          "EMPLOYEE VOLUNTARY CONTRIBUTION": d.employeeVoluntaryContribution,
          "EMPLOYER VOLUNTARY CONTRIBUTION": d.employerVoluntaryContribution,
          MONTH: this.$months[d.month],
          YEAR: d.year,
          PFA: d.pfa.pfaName,
        };
        return vd;
      });
    },

    async getBatches() {
      if (!this.getReady) {
        this.$swal({
          icon: "error",
          text: "Fill all fields",
        });
        return;
      }

      try {
        this.getting = true;
        this.fetched = false;

        const api = "schedule/list-batch";
        const res = await secureAxios.post(api, this.form);

        this.getting = false;
        this.fetched = true;
        if (!res) {
          return;
        }

        const { data } = res;
        // console.log({ res });
        this.items = data.data;
      } catch (err) {
        console.log(err);
        this.getting = false;
      }
    },

    async fetchItems({ currentPage }) {
      try {
        const api = `schedule/list-schedule?page=${currentPage}`;

        const res = await secureAxios.post(api, {
          uploadBatchId: this.uploadBatchId,
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

    async getItems(uploadBatchId) {
      this.uploadBatchId = uploadBatchId;

      // show the modal and get the items
      this.$bvModal.show("show-items");
    },

    // delete schedule by batchId
    async deleteSchedule(uploadBatchId) {
      // warn
      const result = await this.$swal({
        icon: "question",
        title: `Are you sure you want to remove all schedules in this batch?`,
        showDenyButton: true,
        confirmButtonText: "Yes",
        denyButtonText: "No",
      });

      if (!result.isConfirmed) {
        return;
      }

      try {
        this.deleting = true;

        const api = "schedule/delete-batch";

        const res = await secureAxios.post(api, { uploadBatchId });

        this.deleting = false;
        if (!res) {
          return;
        }

        const { data } = res;

        this.getBatches();

        this.$swal({
          icon: "success",
          text: data.message,
        });
      } catch (err) {
        console.log(err);
        this.deleting = false;
      }
    },

    async removeSchedule(arr) {
      // warn
      const result = await this.$swal({
        icon: "question",
        title: `Are you sure you want to remove this schedule?`,
        showDenyButton: true,
        confirmButtonText: "Yes",
        denyButtonText: "No",
      });

      if (!result.isConfirmed) {
        return;
      }

      try {
        this.deleting = true;

        const api = "schedule/remove";

        const res = await secureAxios.post(api, { deleteArr: arr });

        this.deleting = false;
        if (!res) {
          return;
        }

        const { data } = res;

        /* this.fetchedItems = this.fetchedItems.filter(
          (item) => item.id != arr[0]
        ); */
        this.$refs.table.refresh();

        this.$swal({
          icon: "success",
          text: data.message,
        });
      } catch (err) {
        console.log(err);
        this.deleting = false;
      }
    },
  },
};
</script>
<style scoped>
@import "../../assets/css/dashboard.css";
</style>
