<template>
  <div class="boxx">
    <div class="d-flex justify-content-between align-items-center py-2 px-4">
      <h6>Transactions history <small class="paid ml-3">paid</small></h6>

      <div class="d-flex justify-content-between gap-9">
        <CustomSelect
          :options="$yearOptions"
          class="select"
          borderColor="#DDDDDD"
          color="#252A2F"
          width="100px"
          height="2rem"
          lineHeight="1.875rem"
          v-model="yearOption"
        />

        <CustomSelectMonth
          v-pfca
          :default="prevMonth"
          class="select"
          borderColor="#DDDDDD"
          color="#252A2F"
          width="126px"
          height="2rem"
          v-model="monthOption"
          lineHeight="1.875rem"
        />
      </div>
    </div>

    <div v-if="fetching" class="d-flex justify-content-center pt-4">
      <loader />
    </div>
    <div v-else-if="rows.length <= 0" class="d-flex justify-content-center">
      <p>No record found</p>
    </div>
    <div v-else id="table">
      <table>
        <thead>
          <tr>
            <th v-for="(header, i) in tableHeaders" :key="i">
              {{ header.label }}
            </th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(row, k) in rows" :key="k">
            <td v-for="(header, i) in tableHeaders" :key="i">
              <template v-if="header.key == 'amount'">
                {{ row[header.key] | toCurrency }}
              </template>
              <template v-else>
                {{ row[header.key] }}
              </template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { secureAxios } from "../../services/AxiosInstance";
import CustomSelect from "../form/CustomSelect.vue";
import CustomSelectMonth from "../form/CustomSelectMonth.vue";
export default {
  name: "TableBox",

  components: {
    CustomSelect,
    CustomSelectMonth,
  },

  props: {
    tableHeaders: {
      type: Array,
      required: true,
      default: () => [],
    },
  },

  data() {
    return {
      fetching: false,
      monthOption: null,
      rows: [],
      yearOption: new Date().getFullYear(),
    };
  },

  async created() {
    await this.fetchData();
  },

  watch: {
    async yearOption() {
      await this.fetchData();
    },

    async monthOption() {
      await this.fetchData();
    },
  },

  computed: {
    prevMonth() {
      const month = new Date().getMonth();
      return month == 0 ? 12 : month;
    },
  },

  methods: {
    async fetchData() {
      if (this.fetching) return;

      try {
        this.fetching = true;

        const api = "stat/table-box";
        const res = await secureAxios.post(api, {
          year: this.yearOption,
          month: this.monthOption,
        });

        this.fetching = false;
        if (!res) {
          return;
        }

        const { data } = res;

        this.rows = data.data;
      } catch (err) {
        console.log(err);
        this.fetching = false;
      }
    },
  },
};
</script>

<style scoped>
h6 {
  margin-bottom: 0px;
}
.gap-9 {
  gap: 9px;
}
.paid {
  background: #252a2f;
  padding: 1px 7px;
  border-radius: 17px;
  font-size: 0.715em;
  color: #ffffff;
}
#table {
  overflow-x: scroll;
}
#table::-webkit-scrollbar {
  display: none;
}
#table {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}
table {
  width: 100%;
  min-width: 600px;
  font-weight: 400;
  font-size: 0.75rem;
  line-height: 1rem;
  color: #252a2f;
}
thead {
  background: #f9fbff;
  border-radius: 8px;
}
thead tr {
  width: 100%;
  font-weight: 700;
}
thead tr th,
tbody tr td {
  width: 25%;
  padding: 16px 1.25rem;
}
thead tr th:first-child,
tbody tr td:first-child {
  width: 30%;
  padding: 16px 1.25rem 16px 1.875rem;
}
thead tr th:last-child,
tbody tr td:last-child {
  width: 25%;
  padding: 16px 10px;
}
tbody tr td:first-child {
  color: #17517e;
}
tbody tr:nth-child(even) {
  background: #f9f9f9;
}
</style>
