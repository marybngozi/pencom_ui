<template>
  <div id="dash" class="d-flex justify-content-between flex-wrap">
    <!-- left side -->
    <div class="left-tab col-lg-9 border-right pt-5 px-5">
      <h4>Uploaded Pension Schedule Status</h4>

      <!-- pagination and filter details -->
      <div class="my-4">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <div class="show-count w-70">
            Showing {{ items.length }} of {{ rows }} Uploaded schedules
          </div>

          <div class="d-flex justify-content-between gap-3">
            <CustomSelect
              :options="statues"
              class="select"
              borderColor="#DDDDDD"
              color="#252A2F"
              width="112px"
              height="2rem"
              lineHeight="1.875rem"
              v-model="statusOption"
            />

            <CustomSelectInput
              :options="years"
              :default="years[0]"
              class="select"
              borderColor="#DDDDDD"
              color="#252A2F"
              width="100px"
              height="2rem"
              lineHeight="1.875rem"
              v-model="yearOption"
            />
          </div>
        </div>

        <!-- table section -->
        <div class="table-div">
          <div class="only-table-div">
            <b-table
              class="my-table"
              id="my-table"
              :fields="fields"
              small
              striped
              hover
              :items="items"
              :per-page="perPage"
              :current-page="currentPage"
              show-empty
            >
              <template #cell(index)="data">
                {{ data.index + 1 }}
              </template>

              <template #cell(period)="data">
                {{ $months[data.item.month].toUpperCase() }},
                {{ data.item.year }}
              </template>

              <template #cell(createdAt)="data">
                {{ data.value | moment("DD-MM-YYYY") }}
              </template>

              <template #cell(filePath)="data">
                <span :title="data.value">
                  {{ data.value }}
                </span>
              </template>

              <template #cell(status)="data">
                <span v-if="data.value == 'success'" class="text-success fw-7">
                  Successful
                </span>
                <span v-else-if="data.value == 'failure'" class="text-danger">
                  Failed
                </span>
                <span v-else class="text-secondary"> Pending </span>
              </template>

              <template #cell(action)="data">
                <div class="d-flex justify-content-start gap-4">
                  <button
                    v-if="data.item.status == 'success'"
                    class="btn-xsm bg-blue-light"
                    @click="uploadSchedule(data.item.id)"
                  >
                    Process
                  </button>

                  <button
                    v-if="data.item.status == 'failure'"
                    class="btn-xsm bg-outline-blue"
                    @click="downloadFile(data.item.filePath)"
                  >
                    Download
                  </button>

                  <button
                    v-b-tooltip.hover
                    title="This schedule has not been uploaded"
                    v-if="
                      data.item.status == 'success' ||
                      data.item.status == 'failure'
                    "
                    class="btn-xsm bg-red"
                    @click="deleteTask(data.item.id)"
                  >
                    Delete
                  </button>
                </div>
              </template>
            </b-table>
          </div>

          <!-- table pagination -->
          <b-pagination
            class="mt-4"
            v-model="currentPage"
            :total-rows="rows"
            :per-page="perPage"
            aria-controls="my-table"
            size="sm"
            limit="10"
            align="center"
            pills
          >
            <!-- page-class="text-blue"
          next-class="text-blue" -->
          </b-pagination>
        </div>
      </div>
    </div>

    <!-- right side -->
    <div class="right-tab col-lg-3 p-0">
      <!-- Search Form -->
      <div class="bg-blue">
        <div class="inner-boxe">
          <h5>Search Schedule</h5>

          <!-- form -->
          <form @submit.prevent="getStatus" class="">
            <!-- year inout -->
            <div class="mt-3">
              <label class="d-flex justify-content-between" for="year">
                <span>
                  <span class="text-danger">*</span>
                  Year
                </span>
                <span class="">Year of contribution</span>
              </label>

              <!-- Years Options -->
              <CustomSelectInput
                :options="years"
                placeHolder="- select a year -"
                class="select"
                borderColor="#D2D2D2"
                v-model="form.year"
              />
            </div>

            <!-- month input -->
            <div class="mt-4">
              <label class="d-flex justify-content-between" for="month">
                <span>
                  <span class="text-danger">*</span>
                  Month
                </span>
                <span class="">Month of contribution</span>
              </label>

              <!-- Months Options -->
              <CustomSelectInput
                :options="months"
                placeHolder="- select a month -"
                class="select"
                borderColor="#D2D2D2"
                v-model="form.month"
              />
            </div>

            <!-- Submit button -->
            <button :disabled="getting" @click="getStatus" class="button mt-4">
              <span>Search for schedule</span>
              <span
                v-if="getting"
                class="spinner-border spinner-border-sm text-light ml-3"
                role="status"
              ></span>
            </button>
          </form>
        </div>
      </div>

      <!-- User guide -->
      <div class="border-bottom">
        <div class="inner-boxe">
          <h6>Notice</h6>

          <div class="blue-box">
            <ul>
              <li>
                The 'uploaded schedule status' gives the user opportunity to
                review the uploaded file.
              </li>
              <li>
                If the file conforms with the schedule upload template, it will
                return a successful verification status and gives the user the
                options to process the file.
              </li>
              <li>
                If the file returns a 'failure status', you need to download the
                failed file to review the reasons stated on the excel file under
                status, correct them and re-upload again. Remember that the
                upload template must be maintained after the file is corrected.
              </li>
              <li>
                When the 'uploaded schedule status' shows processing', kindly
                wait for the file to complete its validation before proceeding
                with the next step depending on the status returned.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { secureAxios } from "../../services/AxiosInstance";
import { downloader } from "../../services/sourceData";
import CustomSelectInput from "@/components/form/CustomSelectInput";
import CustomSelect from "@/components/form/CustomSelect";

export default {
  name: "UploadStatus",

  components: { CustomSelectInput, CustomSelect },

  data() {
    return {
      form: {
        year: null,
        month: null,
      },
      getting: false,
      perPage: 10,
      currentPage: 1,
      fields: [
        {
          key: "index",
          label: "S/N",
        },
        {
          key: "period",
          label: "Period",
        },
        {
          key: "filePath",
          label: "File name",
          tdClass: "filename-short",
          formatter: (val) => {
            return val.split("-").pop();
          },
        },
        {
          key: "createdAt",
          label: "Upload Date",
        },
        {
          key: "status",
          label: "Verification Status",
        },
        {
          key: "action",
          label: "Action",
          thStyle: {
            width: "277px",
          },
        },
      ],
      items: [],
      yearOption: null,
      statusOption: null,
      statues: [
        { label: "All Statues", value: "all" },
        { label: "Pending", value: "processing" },
        { label: "Failed", value: "failure" },
        { label: "Successful", value: "success" },
      ],
    };
  },

  async beforeCreate() {
    try {
      this.getting = true;

      const api = "schedule/upload-status";
      const res = await secureAxios.get(api);

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

    rows() {
      return this.items.length;
    },

    years() {
      const yearArr = [];
      for (let i = new Date().getFullYear(); i >= 2000; i--) {
        yearArr.push(i);
      }
      return yearArr;
    },

    months() {
      const monthsArr = [];
      for (const value in this.$months) {
        if (Object.hasOwnProperty.call(this.$months, value)) {
          const label = this.$months[value];
          monthsArr.push({ label, value });
        }
      }
      return monthsArr;
    },
  },

  methods: {
    async downloadFile(filePath) {
      await downloader(filePath);
    },

    getItem(itemCode) {
      const item = this.allItems.find((item) => item.itemCode == itemCode);
      return item ? item.itemName : null;
    },

    async getStatus() {
      try {
        this.getting = true;

        const api = "schedule/upload-status";
        const res = await secureAxios.get(api);

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

    async uploadSchedule(id) {
      // warn
      const result = await this.$swal({
        icon: "question",
        title: "Are you sure you want to process this schedule?",
        text: "You should proceed to make payment after processing",
        showDenyButton: true,
        confirmButtonText: "Yes",
        denyButtonText: "No",
      });

      if (!result.isConfirmed) {
        return;
      }

      try {
        this.uploading = true;

        const api = "schedule/upload-schedule";

        const res = await secureAxios.post(api, {
          id,
          scheduleUrl: window.location.origin + "/mandate",
        });

        this.uploading = false;
        if (!res) {
          return;
        }

        const { data } = res;

        this.$swal({
          icon: "success",
          text: data.message,
        });

        // go to view processed page
        this.$router.push({ name: "schedule-view-processed" });
      } catch (err) {
        console.log(err);
        this.uploading = false;
      }
    },

    async deleteTask(id) {
      // warn
      const result = await this.$swal({
        icon: "question",
        title: "Are you sure you want to delete this schedule?",
        text: "This schedule has not been uploaded and deleting it will remove it permanently",
        showDenyButton: true,
        confirmButtonText: "Yes",
        denyButtonText: "No",
      });

      if (!result.isConfirmed) {
        return;
      }

      try {
        this.uploading = true;

        const api = "schedule/delete-task";

        const res = await secureAxios.post(api, { id });

        this.uploading = false;
        if (!res) {
          return;
        }

        const { data } = res;

        this.$swal({
          icon: "success",
          text: data.message,
        });

        // refresh the status data
        this.getStatus();
      } catch (err) {
        console.log(err);
        this.uploading = false;
      }
    },
  },
};
</script>
<style scoped>
@import "../../assets/css/dashboard.css";
.bg-blue {
  background: #ecf7ff;
  border-bottom: 1px solid #f2f2f2;
}
.gap-4 {
  gap: 0.25rem;
}
</style>
