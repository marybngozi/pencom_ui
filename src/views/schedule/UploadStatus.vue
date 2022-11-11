<template>
  <section class="dash rounded px-3 pb-5 pt-2">
    <div class="coln">
      <h4 class="mb-4">Upload Schedule Status</h4>

      <div class="">
        <div v-if="items.length" class="alert alert-primary" role="alert">
          <h5 class="">
            Your schedule has been received for validation and has
            <b class="text-danger">not</b> been uploaded
          </h5>
          <ul>
            <li class="m-1">
              While the status is <b class="text-secondary">processing</b>, you
              can either send another schedule or take a break 🙂
            </li>
            <li class="m-1">
              On the <b class="text-danger">failure</b> of the validation, you
              can <b>download</b> the schedule with details of validation and
              delete the schedule
            </li>
            <li class="m-1">
              On the <b class="text-success">success</b> of the validation, you
              can <b>upload</b> the schedule or delete if you have reason to
            </li>
          </ul>
        </div>
      </div>

      <div class="my-4">
        <b-table
          id="my-table"
          :fields="fields"
          outlined
          small
          striped
          hover
          :items="items"
          :per-page="perPage"
          :current-page="currentPage"
          show-empty
        >
          <template #cell(itemCode)="data">
            {{ getItem(data.value) }}
          </template>

          <template #cell(createdAt)="data">
            {{ data.value | moment("DD-MM-YYYY") }}
          </template>

          <template #cell(filePath)="data">
            {{ data.value.split("-").pop() }}
          </template>

          <template #cell(status)="data">
            <span v-if="data.value == 'success'" class="text-success">
              {{ data.value }}
            </span>
            <span v-else-if="data.value == 'failure'" class="text-danger">
              {{ data.value }}
            </span>
            <span v-else class="text-secondary">
              {{ data.value }}
            </span>
          </template>

          <template #cell(action)="data">
            <button
              v-if="data.item.status == 'success'"
              class="btn btn-sm btn-primary"
              @click="uploadSchedule(data.item.id)"
            >
              Upload
            </button>
            <button
              v-else-if="data.item.status == 'failure'"
              class="btn btn-sm btn-secondary"
              @click="downloadFile(data.item.filePath)"
            >
              Download
            </button>
            <button
              v-b-tooltip.hover
              title="This schedule has not been uploaded"
              v-if="
                data.item.status == 'success' || data.item.status == 'failure'
              "
              class="btn btn-sm ml-3 btn-danger"
              @click="deleteTask(data.item.id)"
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
    </div>
  </section>
</template>
<script>
import { mapGetters } from "vuex";
import { secureAxios } from "../../services/AxiosInstance";
import { downloader } from "../../services/sourceData";

export default {
  name: "UploadStatus",
  data() {
    return {
      getting: false,
      perPage: 10,
      currentPage: 1,
      fields: [
        {
          key: "itemCode",
          label: "Item",
        },
        {
          key: "filePath",
          label: "File",
        },
        {
          key: "status",
          label: "Validation Status",
        },
        {
          key: "createdAt",
          label: "Sent on",
        },
        {
          key: "action",
          label: "Action",
        },
      ],
      items: [],
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
        title: "Are you sure you want to upload this schedule?",
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
</style>
