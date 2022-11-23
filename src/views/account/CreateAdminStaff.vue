<template>
  <section class="dash rounded px-3 pb-5 pt-2">
    <div class="coln">
      <h4 class="mb-4">Create Admin Staff</h4>

      <!-- Top section -->
      <div class="d-flex justify-content-around">
        <div class="form w-50">
          <div class="mt-3">
            <label class="d-flex justify-content-between" for="rsaPin">
              <span>
                <span class="text-danger">*</span>
                Staff RSA PIN
              </span>
              <span class="fs-8 text-info">
                The staff must have registered on this platform
              </span>
            </label>

            <input
              id="rsaPin"
              v-model="form.rsaPin"
              class="form-control input"
              type="text"
              placeholder="enter staff RSA PIN"
            />
          </div>

          <button
            :disabled="!rsaReady || checking"
            @click="checkrsaPin"
            class="btn mt-4 w-100 button"
          >
            <span>Make an Admin Staff</span>
            <span
              v-if="checking"
              class="spinner-border spinner-border-sm text-light ml-3"
              role="status"
            ></span>
          </button>
        </div>

        <div class="w-50 mt-4">
          <div class="alert alert-info" role="alert">
            <h5 class="">Create staff to operate on behalf of the company</h5>
            <ul>
              <li class="my-2 mx-1">
                You can only add a staff that has signed up and verified their
                account on this platform
              </li>
              <li class="m-1">
                You can go to <b>List Admin Staff</b> to assign menu to the
                staff
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import { secureAxios } from "../../services/AxiosInstance";

export default {
  name: "CreateAdminStaff",
  data() {
    return {
      checking: false,
      verifying: false,
      form: {
        rsaPin: null,
      },
      staff: null,
    };
  },
  computed: {
    rsaReady() {
      return !!this.form.rsaPin;
    },
  },

  methods: {
    async checkrsaPin() {
      if (!this.rsaReady) {
        this.$swal({
          icon: "error",
          text: "Fill all fields",
        });
        return;
      }

      try {
        this.checking = true;

        const api = `auth/staffs/${this.form.rsaPin}`;
        const res = await secureAxios.get(api);

        this.checking = false;
        if (!res) {
          return;
        }

        const { data } = res;

        this.staff = data.data;

        // warn
        const result = await this.$swal({
          icon: "question",
          title: `Are you sure you want to make ${this.staff.firstName} ${this.staff.lastName} an Admin staff?`,
          text: "This staff will be able to perform authorized actions for this company",
          showDenyButton: true,
          confirmButtonText: "Yes",
          denyButtonText: "No",
        });

        if (!result.isConfirmed) {
          return;
        }

        await this.makeStaff();
      } catch (err) {
        console.log(err);
        this.checking = false;
      }
    },

    async makeStaff() {
      if (!this.staff) {
        this.$swal({
          icon: "error",
          text: "Fill all fields",
        });
        return;
      }

      try {
        this.checking = true;

        const api = "auth/admin-staff";
        const res = await secureAxios.post(api, this.form);

        this.checking = false;
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
      } catch (err) {
        console.log(err);
        this.checking = false;
      }
    },
  },
};
</script>
<style scoped>
@import "../../assets/css/dashboard.css";
</style>
