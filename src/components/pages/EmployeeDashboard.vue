<template>
  <div id="dash" class="d-flex justify-content-between flex-wrap">
    <!-- left side -->
    <div class="left-dash col-lg-8 border-right pt-5 pl-3 pr-3">
      <!-- top section -->
      <section id="sec1" class="d-flex justify-content-between flex-wrap">
        <BlueBox :options="typeOptions" class="col-md-7 col-12" />
        <PinkBox class="col-md-5 col-12" />
      </section>

      <!-- gray section -->
      <section id="sec2" class="d-flex justify-content-between flex-wrap">
        <GrayBox
          boldTitle="Employer"
          :options="companies"
          contributionType="employerNormalContribution"
          class="col-12 col-md-6"
        />
        <GrayBox
          boldTitle="Employee"
          :options="companies"
          contributionType="employeeNormalContribution"
          class="col-12 col-md-6"
        />
      </section>

      <!-- graph section -->
      <section id="sec3">
        <GraphBox :options="companies" />
      </section>

      <!-- table section -->
      <section id="sec4" class="pb-5">
        <TableBox :tableHeaders="tableHeaders" />
      </section>
    </div>

    <!-- right side -->
    <div class="right-dash col-lg-4 p-0">
      <div class="border-bottom">
        <ProfileBox />
      </div>
    </div>

    <!-- Employers modal -->
    <b-modal
      id="show-items"
      size="lg"
      scrollable
      :cancel-disabled="true"
      :hide-footer="true"
      :hide-header="true"
    >
      <!-- title="Schedule Items" -->
      <SearchInput v-model="searchVal" width="100%" />

      <b-table
        class="my-table mt-3"
        id="item-table"
        :fields="modalFields"
        small
        responsive
        striped
        :busy="fetching"
        hover
        :items="fetchItems"
        :per-page="perPage"
        :current-page="currentPage"
        show-empty
      >
        <template #cell(amount)="data">
          {{ data.value | toCurrency }}
        </template>

        <template #cell(company)="data">
          {{ data.value[0].companyName }}
        </template>

        <template #cell(index)="data">
          {{ data.index + 1 }}
        </template>
      </b-table>

      <b-pagination
        v-model="currentPage"
        :total-rows="rowsItem"
        :per-page="perPage"
        aria-controls="item-table"
        size="sm"
        limit="10"
        pills
        align="center"
      >
      </b-pagination>
    </b-modal>
  </div>
</template>

<script>
import { secureAxios } from "../../services/AxiosInstance";
import BlueBox from "@/components/dashboard/BlueBox";
import PinkBox from "@/components/dashboard/PinkBox";
import GrayBox from "@/components/dashboard/GrayBox";
import GraphBox from "@/components/dashboard/GraphBox";
import TableBox from "@/components/dashboard/TableBox";
import ProfileBox from "@/components/dashboard/ProfileBox";
import SearchInput from "@/components/form/SearchInput";
export default {
  name: "EmployeeDashboard",

  components: {
    BlueBox,
    PinkBox,
    GrayBox,
    GraphBox,
    TableBox,
    ProfileBox,
    SearchInput,
  },

  data() {
    return {
      fetching: false,
      searchVal: null,
      perPage: 10,
      currentPage: 1,
      rowsItem: 0,
      companies: [],
      typeOptions: [
        { label: "All Contributions", value: "amount" },
        {
          label: "Employer contributions",
          value: "employerNormalContribution",
        },
        {
          label: "Employee contributions",
          value: "employeeNormalContribution",
        },
      ],
      tableHeaders: [
        {
          label: "Month",
          key: "month",
        },
        {
          label: "Amount",
          key: "amount",
        },
        {
          label: "Employer",
          key: "company",
        },
        {
          label: "Transaction date",
          key: "createdAt",
        },
      ],
      modalFields: [
        {
          key: "index",
          label: "S/N",
        },
        {
          key: "companyName",
          label: "Employer",
        },
        {
          key: "amount",
          label: "Total Amount contributed",
        },
        {
          key: "lastMonthContributed",
          label: "Last contributing month",
        },
      ],
    };
  },

  async created() {
    this.fetchCompanies();
  },

  methods: {
    async fetchItems({ currentPage, perPage }) {
      try {
        const api = `stat/pink-see-all?page=${currentPage}&size=${perPage}`;

        const res = await secureAxios.post(api, {});

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

    async fetchCompanies() {
      try {
        const api = "stat/user-companies";

        const res = await secureAxios.get(api);

        if (!res) {
          return [];
        }

        const { data } = res;

        this.companies = [{ label: "All Companies", value: "all" }];
        this.companies.push(...data.data);
      } catch (err) {
        console.log(err);
        return [];
      }
    },

    showModal() {
      this.$bvModal.show("show-items");
    },
  },

  provide: function () {
    return {
      showModal: this.showModal,
    };
  },
};
</script>

<style scoped>
#dash {
  overflow-y: hidden;
  height: calc(100vh - 68px);
}
section#sec1 {
  width: 100%;
  gap: 18px;
  /* margin: auto; */
}
section#sec2 {
  width: 100%;
  margin-top: 28px;
  gap: 18px;
}
section#sec3,
section#sec4 {
  width: 100%;
  overflow-x: hidden;
  margin-top: 28px;
}
section#sec4 {
  min-height: 50%;
}
.left-dash {
  /* width: 70%; */
  overflow-y: scroll;
  height: calc(100vh - 70px);
}
.right-dash {
  /* width: 30%; */
  overflow-y: scroll;
  height: calc(100vh - 70px);
}
.left-dash::-webkit-scrollbar,
.right-dash::-webkit-scrollbar {
  display: none;
}
.left-dash,
.right-dash {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}
.right-dash .out-boxx {
  padding: 28px;
}
.right-dash .notification-boxx {
  height: 57px;
  background: #f9f9f9;
  border-radius: 16px;
  padding: 10px;
}
.notification-boxx .icon {
  font-size: 16px;
  color: #0090ff;
  margin-left: 7px;
}
.notification-boxx h6 {
  font-weight: 700;
  font-size: 14px;
  line-height: 15px;
  color: #263238;
  margin-bottom: 0px;
}
.notification-boxx small {
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  color: #808080;
}
.notification-boxx p {
  font-size: 10px;
  line-height: 13px;
  color: #187a33;
  margin: 0;
}
.paid {
  background: #be9e1b;
  padding: 1px 7px;
  border-radius: 17px;
  font-size: 0.715em;
}
/* Medium devices (tablets, 768px and up) */
@media (max-width: 768px) {
  .right-dash,
  .left {
    /* width: 70%; */
    overflow-y: visible;
    height: auto;
  }
  #dash {
    overflow-y: scroll;
  }
  #dash::-webkit-scrollbar {
    display: none;
  }
  #dash {
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
  }
}
/* Medium devices (tablets, 768px and up) */
@media (min-width: 768px) {
  .col-md-7 {
    flex: 0 0 56.333333%;
    max-width: 56.333333%;
  }
  .col-md-6 {
    flex: 0 0 48%;
    max-width: 48%;
  }
  .col-md-5 {
    flex: 0 0 39.666667%;
    max-width: 39.666667%;
  }
}
</style>
