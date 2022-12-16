<template>
  <div id="dash" class="d-flex justify-content-between flex-wrap">
    <!-- left side -->
    <div class="left col-lg-8 border-right pt-5 px-5">
      <h4 class="m-0">Upload Pension Schedule</h4>

      <form @submit.prevent="sendSchdeule" class="">
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

        <!-- file input -->
        <div class="mt-4">
          <label class="d-flex justify-content-between" for="fileUpload">
            <span>
              <span class="text-danger">*</span>
              Choose Excel file
            </span>
            <span class="">According to template</span>
          </label>

          <!-- File Options -->
          <FileSelect v-model="form.fileUpload" />
        </div>

        <!-- Submit button -->
        <button
          :disabled="!sendReady || sending"
          @click="sendSchdeule"
          class="button mt-5"
        >
          <span>Upload schedule for verification</span>
          <span
            v-if="sending"
            class="spinner-border spinner-border-sm text-light ml-3"
            role="status"
          ></span>
        </button>
      </form>
    </div>

    <!-- right side -->
    <div class="right col-lg-4 p-0">
      <!-- User guides -->
      <div class="border-bottom">
        <div class="inner-boxe">
          <h6>Use Guide</h6>

          <div class="blue-box">
            <ul>
              <li>
                Please ensure that the upload file complies with the
                <b>style provided in the schedule template</b>. Your upload also
                needs to be in the appropriate file format: <b>.xlsx</b>
                <br /><br />
                Our template can be downloaded through the link below under
                downloadable files.
              </li>

              <li>The month/year is the contribution period.</li>

              <li>
                The PFA codes which will be used in the upload file is also
                available below, under downloadable links.
              </li>

              <li>
                Kindly ensure that the RSA pins are correct as the system runs a
                validation process on all supplied RSA pins.
              </li>

              <li>
                The total contributions must be correct, do not use special
                characters like, =, %, Comma(,) etc.
              </li>

              <li>
                Do not change the Headings of the columns in the excel upload
                template.
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Template sections -->
      <div class="border-bottom">
        <div class="inner-boxe">
          <h6>Use Guide</h6>

          <button
            :disabled="gettingTemplate"
            @click="downloadFile(item.excelSamplePath, 'gettingTemplate')"
            class="button-outline"
          >
            <span>Download schedule template</span>
            <span
              v-if="gettingTemplate"
              class="spinner-border spinner-border-sm ml-3"
              role="status"
            ></span>
          </button>

          <button
            :disabled="gettingPfacodes"
            @click="downloadFile(item.excelPfaCodes, 'gettingPfacodes')"
            class="button-outline mt-3"
          >
            <span>Download PFA Codes</span>
            <span
              v-if="gettingPfacodes"
              class="spinner-border spinner-border-sm ml-3"
              role="status"
            ></span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { secureAxios } from "../../services/AxiosInstance";
import { downloader } from "../../services/sourceData";
import CustomSelectInput from "@/components/dashboard/CustomSelectInput";
import FileSelect from "@/components/schedule/FileSelect";

export default {
  name: "UploadSchedule",
  components: { CustomSelectInput, FileSelect },

  data() {
    return {
      sending: false,
      gettingTemplate: false,
      gettingPfacodes: false,
      form: {
        itemCode: "7000",
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

    item() {
      return this.allItems[0];
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

        this.$swal({
          icon: "success",
          text: data.message,
        });

        // go to the status page
        this.$router.push({ name: "schedule-upload-status" });
      } catch (err) {
        console.log(err);
        this.sending = false;
      }
    },

    onChangeFileUpload(e) {
      this.form.fileUpload = e.target.files[0];
    },

    async downloadFile(filePath, btn) {
      this[btn] = true;
      await downloader(filePath);
      this[btn] = false;
    },
  },
};
</script>
<style scoped>
@import "../../assets/css/dashboard.css";
</style>
