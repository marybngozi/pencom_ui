<template>
  <div class="boxx">
    <div class="d-flex justify-content-between align-items-center py-2 px-4">
      <h6>Transactions history <small class="paid ml-3">paid</small></h6>

      <div class="d-flex justify-content-between gap-9">
        <CustomSelect
          :options="years"
          class="select"
          borderColor="#DDDDDD"
          color="#252A2F"
          width="100px"
          height="32px"
          lineHeight="30px"
          v-model="yearOption"
        />

        <HorizontalSelect
          v-spfca
          :items="Object.values($months)"
          :default="new Date().getMonth() - 1"
          width="126px"
          height="32px"
          borderColor="#DDDDDD"
          color="#252A2F"
          v-model="monthOption"
        />
      </div>
    </div>

    <div id="table">
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
              {{ row[header.key] }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import CustomSelect from "./CustomSelect.vue";
import HorizontalSelect from "./HorizontalSelect.vue";
export default {
  name: "TableBox",

  components: {
    CustomSelect,
    HorizontalSelect,
  },

  props: {
    tableHeaders: {
      type: Array,
      required: true,
      default: () => [],
    },
    rows: {
      type: Array,
      required: true,
      default: () => [],
    },
  },

  data() {
    return {
      monthOption: null,
      yearOption: null,
    };
  },

  computed: {
    years() {
      const years = [];
      for (let i = new Date().getFullYear(); i >= 2020; i--) {
        years.push(i);
      }
      return years;
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
  font-size: 12px;
  line-height: 16px;
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
  padding: 16px 20px;
}
thead tr th:first-child,
tbody tr td:first-child {
  width: 30%;
  padding: 16px 20px 16px 30px;
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
