<template>
  <div class="boxx">
    <div
      class="d-flex justify-content-between align-items-center border-bottom py-2 px-4"
    >
      <h6>Total contributions - YTD</h6>

      <CustomSelect
        :options="years"
        class="select"
        borderColor="#252A2F"
        width="100px"
        height="32px"
        lineHeight="30px"
        v-model="yearOption"
      />
    </div>

    <div id="chart" class="">
      <apexchart
        type="bar"
        :options="chartOptions"
        height="280"
        width="1000px"
        :series="series"
      ></apexchart>
    </div>
  </div>
</template>

<script>
import CustomSelect from "./CustomSelect.vue";
export default {
  name: "GraphBox",

  components: {
    CustomSelect,
  },

  data() {
    return {
      yearOption: null,

      series: [
        {
          name: "Employer Contribution",
          data: [44, 55, 57, 56, 61, 58, 63, 60, 66, 57, 56, 61],
        },
        {
          name: "Employee Contribution",
          data: [76, 85, 101, 98, 87, 105, 91, 114, 94, 85, 101, 91],
        },
        {
          name: "Total Contribution",
          data: [35, 41, 36, 26, 45, 48, 52, 53, 41, 36, 26, 45],
        },
      ],
      chartOptions: {
        chart: {
          type: "bar",
          height: 350,
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: "90%",
            endingShape: "rounded",
          },
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          show: true,
          width: 0,
          colors: ["transparent"],
        },
        xaxis: {
          categories: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ],
        },
        colors: ["#80B7FF", "#17517E", "#109CF1"],
        fill: {
          opacity: 1,
        },
        yaxis: {
          labels: {
            formatter: (val) => this.nFormatter(val),
          },
        },
        tooltip: {
          y: {
            formatter: function (val) {
              return "₦" + val;
            },
          },
        },
        legend: {
          show: true,
          markers: {
            width: 100,
            height: 15,
            radius: 4,
          },
          itemMargin: {
            horizontal: 15,
            vertical: 0,
          },
        },
      },
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

  methods: {
    nFormatter(num) {
      const lookup = [
        { value: 1, symbol: "" },
        { value: 1e3, symbol: "k" },
        { value: 1e6, symbol: "M" },
        { value: 1e9, symbol: "G" },
        { value: 1e12, symbol: "T" },
        { value: 1e15, symbol: "P" },
        { value: 1e18, symbol: "E" },
      ];
      const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
      var item = lookup
        .slice()
        .reverse()
        .find(function (item) {
          return num >= item.value;
        });
      return item
        ? (num / item.value).toFixed(2).replace(rx, "$1") + item.symbol
        : "0";
    },
  },
};
</script>

<style scoped>
.boxx {
  width: 100%;
  /* min-width: 808px; */
  height: 370px;
  background: #ffffff;
  border: 1.29px solid #e0e0e0;
  border-radius: 20px;
  padding: 3px 0 0px;
}
h6 {
  margin-bottom: 0px;
}
#chart {
  overflow-x: scroll;
}
#chart::-webkit-scrollbar {
  display: none;
}
#chart {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}
</style>
