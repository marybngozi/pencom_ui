<template>
  <div class="boxx">
    <div class="d-flex justify-content-between align-items-center py-2 px-4">
      <h6>Transactions history</h6>

      <HorizontalSelect
        :items="years"
        :default="0"
        borderColor="#252A2F"
        width="100px"
        height="32px"
        @input="(d) => (yearOption = d)"
      />
    </div>

    <table>
      <thead>
        <tr>
          <th>Month</th>
          <th>Amount</th>
          <th>Staff Count</th>
          <th>Transaction date</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="month in $months" :key="month">
          <td>{{ month }}</td>
          <td>N 220,005.95</td>
          <td>22</td>
          <td>Sept 10. 2022</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import HorizontalSelect from "./HorizontalSelect.vue";
export default {
  name: "TableBox",

  components: {
    HorizontalSelect,
  },

  data() {
    return {
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
table {
  width: 100%;
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
  /* display: flex;
  justify-content: space-between; */
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
