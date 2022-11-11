<template>
  <section class="dash rounded px-3 pb-5 pt-2">
    <div class="coln">
      <div class="form">
        <h4 class="mb-4">Upload Schedule</h4>

        <div class="mt-4">
          <label class="d-flex justify-content-between" for="itemCode">
            <span>
              <span class="text-danger">*</span>
              Item
            </span>
            <span class="fs-8 text-primary">
              Select an Item to see the template
            </span>
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
          <small
            v-if="form.itemCode"
            class="d-flex justify-content-between text-info"
          >
            <button
              @click="downloadFile(item.excelSamplePath)"
              class="btn btn-sm btn-info mt-2 d-btn"
            >
              Download Schedule template
            </button>
            <button
              @click="downloadFile(item.excelPfaCodes)"
              class="btn btn-sm btn-info mt-2 d-btn"
            >
              Download PFA codes
            </button>
          </small>
        </div>

        <div class="mt-4">
          <label class="d-flex justify-content-between" for="year">
            <span>
              <span class="text-danger">*</span>
              Year
            </span>
            <span class="fs-8 text-primary">Year of contribution</span>
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
            <span class="fs-8 text-primary">Month of contribution</span>
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

        <div class="mt-5 custom-file">
          <input
            type="file"
            class="custom-file-input"
            id="customFile"
            ref="customFile"
            aria-describedby="inputGroupFileAddon01"
            accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            v-on:change="onChangeFileUpload"
          />
          <span v-if="form.fileUpload" class="text-sm ml-1 text-info">
            {{ form.fileUpload.name }}
          </span>
          <label class="custom-file-label" for="customFile">
            Choose Excel file to Upload
          </label>
        </div>

        <button
          :disabled="!sendReady || sending"
          @click="sendSchdeule"
          class="btn mt-5 w-100 button"
        >
          <span>Send Schedule for Validation</span>
          <span
            v-if="sending"
            class="spinner-border spinner-border-sm text-light ml-3"
            role="status"
          ></span>
        </button>
      </div>
    </div>
  </section>
</template>
<script>
import { mapGetters } from "vuex";
import { secureAxios } from "../../services/AxiosInstance";
import { downloader } from "../../services/sourceData";

export default {
  name: "ListSchdeule",
  components: {},
  data() {
    return {
      sending: false,
      form: {
        itemCode: null,
        year: null,
        month: null,
        fileUpload: null,
      },
    };
  },
  computed: {
    ...mapGetters(["allItems"]),

    sendReady() {
      return (
        this.form.itemCode &&
        this.form.year &&
        this.form.month &&
        this.form.fileUpload
      );
    },
    years() {
      const yearArr = [];
      for (let i = new Date().getFullYear(); i >= 1990; i--) {
        yearArr.push(i);
      }
      return yearArr;
    },

    item() {
      if (!this.form.itemCode) {
        return null;
      }
      return this.allItems.find((item) => item.itemCode == this.form.itemCode);
    },
  },

  methods: {
    async sendSchdeule() {
      if (!this.sendReady) {
        this.$swal({
          icon: "error",
          text: "Fill all fields",
        });
        return;
      }

      try {
        this.sending = true;

        const api = "schedule/upload-excel";

        // build the multipart form data
        const formData = new FormData();
        Object.keys(this.form).forEach((key) => {
          formData.append(key, this.form[key]);
        });

        const res = await secureAxios.post(api, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        this.sending = false;
        if (!res) {
          return;
        }

        const { data } = res;

        // clear the form
        Object.keys(this.form).forEach((key) => {
          this.form[key] = null;
        });
        this.$refs.customFile.value = null;

        this.$swal({
          icon: "success",
          text: data.message,
        });

        // go to the status page
        this.$router.push({ path: "/upload-status" });
      } catch (err) {
        console.log(err);
        this.sending = false;
      }
    },

    onChangeFileUpload(e) {
      this.form.fileUpload = e.target.files[0];
    },

    async downloadFile(filePath) {
      await downloader(filePath);
    },
  },
};
</script>
<style scoped>
@import "../../assets/css/dashboard.css";
.d-btn {
  width: 48%;
}
</style>
