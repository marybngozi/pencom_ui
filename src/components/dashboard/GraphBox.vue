<template>
  <div class="boxx">
    <div
      class="d-flex justify-content-between align-items-center border-bottom py-2 px-4"
    >
      <h6>Total contributions - YTD <small class="paid ml-3">paid</small></h6>

      <div class="d-flex justify-content-between gap-9">
        <CustomSelect
          v-spfca
          :options="options"
          class="select"
          borderColor="#DDDDDD"
          color="#252A2F"
          width="200px"
          height="2rem"
          lineHeight="1.875rem"
          v-model="viewOption"
        />

        <CustomSelect
          :options="years"
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

    <div v-if="fetching" class="pt-5">
      <BarChartLoader />
    </div>
    <div v-else-if="noData" class="text-center pt-5 mt-4">
      <i class="fa fa-bar-chart text-secondary chart-icon"></i>
      <p>No record found</p>
    </div>
    <div id="chart" class="" v-else>
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
import { mapGetters } from "vuex";
import { secureAxios } from "../../services/AxiosInstance";
import CustomSelect from "./CustomSelect.vue";
import BarChartLoader from "@/components/BarChartLoader.vue";
export default {
  name: "GraphBox",

  components: {
    CustomSelect,
    BarChartLoader,
  },

  props: {
    options: {
      type: Array,
      required: false,
      default: () => [],
    },
  },

  data() {
    return {
      fetching: false,
      yearOption: new Date().getFullYear(),
      viewOption: null,
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
              return "₦" + Number(val).toLocaleString();
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

  async created() {
    this.chartOptions.plotOptions.bar.columnWidth =
      this.userType >= 400 ? "40%" : "90%";

    this.series.length = this.userType >= 400 ? 1 : this.series.length;

    await this.fetchData();
  },

  watch: {
    async yearOption() {
      await this.fetchData();
    },

    async viewOption() {
      await this.fetchData();
    },
  },

  computed: {
    ...mapGetters(["userType"]),

    noData() {
      return this.series[this.series.length - 1].data.every(
        (item) => item == 0
      );
    },

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

    async fetchData() {
      if (this.fetching) return;

      try {
        this.fetching = true;

        const api = "stat/graph-box";
        const res = await secureAxios.post(api, {
          year: this.yearOption,
          viewOption: this.viewOption,
        });

        this.fetching = false;
        if (!res) {
          return;
        }

        const { data } = res;

        this.series = data.series;
      } catch (err) {
        console.log(err);
        this.fetching = false;
      }
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
  border: 1.1.8125rem solid #e0e0e0;
  border-radius: 1.25rem;
  padding: 0.1875rem 0 0px;
}
.gap-9 {
  gap: 9px;
}
h6 {
  margin-bottom: 0px;
}
.paid {
  background: #252a2f;
  padding: 1px 7px;
  border-radius: 17px;
  font-size: 0.715em;
  color: #ffffff;
}
#chart {
  overflow-x: scroll;
}
#chart::-webkit-scrollbar {
  height: 7px;
}
/* Track */
#chart::-webkit-scrollbar-track {
  box-shadow: inset 0 0 0.3125rem #109cf1;
  border-radius: 10px;
  margin: 0 7px;
}
/* Handle */
#chart::-webkit-scrollbar-thumb {
  background: #17517e;
  border-radius: 2px;
}
/* Handle on hover */
#chart::-webkit-scrollbar-thumb:hover {
  background: #104771;
}
.chart-icon {
  font-size: 130px;
}
</style>
