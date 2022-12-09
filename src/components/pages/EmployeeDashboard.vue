<template>
  <section class="dash d-flex justify-content-center rounded px-3 pb-5 pt-3">
    <div class="coln w-100">
      <!-- Top boxes -->
      <section class="d-flex justify-content-around mb-3">
        <div class="card bg-primary">
          <div class="card-body py-3 px-4 text-white">
            <p class="m-0 text-uppercase">Employer Contribution</p>
            <div class="d-flex justify-content-between">
              <h6 class="">
                {{ chartData.month.employerNormalContribution | toCurrency }}
              </h6>
              <small class="fs-8">MTD</small>
            </div>
            <div class="d-flex justify-content-between">
              <h6 class="">
                {{ chartData.year.employerNormalContribution | toCurrency }}
              </h6>
              <small class="fs-8">YTD</small>
            </div>
          </div>
        </div>
        <div class="card bg-purple">
          <div class="card-body py-3 px-4 text-white">
            <p class="m-0 text-uppercase">Employee Contribution</p>
            <div class="d-flex justify-content-between">
              <h6 class="">
                {{ chartData.month.employeeNormalContribution | toCurrency }}
              </h6>
              <small class="fs-8">MTD</small>
            </div>
            <div class="d-flex justify-content-between">
              <h6 class="">
                {{ chartData.year.employeeNormalContribution | toCurrency }}
              </h6>
              <small class="fs-8">YTD</small>
            </div>
          </div>
        </div>
        <div class="card bg-success">
          <div class="card-body py-3 px-4 text-white">
            <p class="m-0 text-uppercase">Employer Voluntary</p>
            <div class="d-flex justify-content-between">
              <h6 class="">
                {{ chartData.month.employerVoluntaryContribution | toCurrency }}
              </h6>
              <small class="fs-8">MTD</small>
            </div>
            <div class="d-flex justify-content-between">
              <h6 class="">
                {{ chartData.year.employerVoluntaryContribution | toCurrency }}
              </h6>
              <small class="fs-8">YTD</small>
            </div>
          </div>
        </div>
        <div class="card bg-info">
          <div class="card-body py-3 px-4 text-white">
            <p class="m-0 text-uppercase">Employee Voluntary</p>
            <div class="d-flex justify-content-between">
              <h6 class="">
                {{ chartData.month.employeeVoluntaryContribution | toCurrency }}
              </h6>
              <small class="fs-8">MTD</small>
            </div>
            <div class="d-flex justify-content-between">
              <h6 class="">
                {{ chartData.year.employeeVoluntaryContribution | toCurrency }}
              </h6>
              <small class="fs-8">YTD</small>
            </div>
          </div>
        </div>
      </section>

      <!-- Middle pie and bar -->
      <section class="d-flex justify-content-between rounded border">
        <div id="pieChart" class="border-right p-4">
          <span class="header-title mb-3">
            Pie Chart - Pecentage of collections by categories MTD
          </span>
          <apexchart
            v-if="plotPie"
            type="pie"
            width="380"
            :options="pieOptions"
            :series="pieSeries"
          ></apexchart>
          <div v-else class="d-flex flex-column align-items-center mt-3">
            <i class="fa fa-pie-chart text-secondary chart-icon"></i>
            <span>No Data</span>
          </div>
        </div>

        <div id="barChart" class="w-75 p-4">
          <span class="header-title mb-3">
            Bar Chart - Total Contributions YTD
          </span>
          <apexchart
            v-if="plotBar"
            type="bar"
            height="200"
            :options="barOptions"
            :series="barSeries"
          ></apexchart>
          <div v-else class="d-flex flex-column align-items-center mt-3">
            <i class="fa fa-bar-chart text-secondary chart-icon"></i>
            <span>No Data</span>
          </div>
        </div>
      </section>

      <!-- Bottom line -->
      <section class="rounded border mt-3 pt-4 px-4 pb-1">
        <div id="lineChart">
          <span class="header-title mb-3">
            Line chart - Total Contributions - YTD
          </span>
          <apexchart
            v-if="plotLine"
            type="line"
            height="300"
            :options="lineOptions"
            :series="lineSeries"
          ></apexchart>
          <div
            v-else
            class="d-flex flex-column align-items-center justify-content-end mt-3"
          >
            <i class="fa fa-line-chart text-secondary chart-icon_plus"></i>
            <span>No Data</span>
          </div>
        </div>
      </section>
    </div>
  </section>
</template>

<script>
import { secureAxios } from "../../services/AxiosInstance";
export default {
  name: "EmployeeDashboard",
  async beforeCreate() {
    // this.$store.dispatch("getItems");
    // this.$store.dispatch("getMenus");

    try {
      this.getting = true;

      const api1 = "stat/items-month";
      const res1 = await secureAxios.get(api1);

      const api2 = "stat/items-year";
      const res2 = await secureAxios.get(api2);

      const api3 = "stat/year-months";
      const res3 = await secureAxios.get(api3);

      this.getting = false;
      if (res1) {
        this.chartData.month = res1.data.data;
      }
      if (res2) {
        this.chartData.year = res2.data.data;
      }
      if (res3) {
        this.chartData.yearMonth = res3.data.data;
      }
    } catch (err) {
      console.log(err);
      this.getting = false;
    }
  },

  computed: {
    plotPie() {
      return this.chartData.month.employerNormalContribution != 0;
    },
    plotBar() {
      return this.chartData.year.employerNormalContribution != 0;
    },
    plotLine() {
      return this.chartData.yearMonth.length != 0;
    },
    pieSeries() {
      return [
        this.chartData.month.employerNormalContribution,
        this.chartData.month.employeeNormalContribution,
        this.chartData.month.employerVoluntaryContribution,
        this.chartData.month.employeeVoluntaryContribution,
      ];
    },
    barSeries() {
      return [
        {
          name: "Contributions",
          data: [
            this.chartData.year.employerNormalContribution,
            this.chartData.year.employeeNormalContribution,
            this.chartData.year.employerVoluntaryContribution,
            this.chartData.year.employeeVoluntaryContribution,
          ],
        },
      ];
    },
    lineSeries() {
      let month = new Date().getMonth();
      const monthsData = new Array(month + 1).fill(0);
      this.chartData.yearMonth.forEach((data) => {
        monthsData[data._id - 1] = data.amount.toFixed(2);
      });
      return [
        {
          name: "Contributions",
          data: monthsData,
        },
      ];
    },
  },

  data() {
    const emptyData = {
      count: 0,
      amount: 0,
      employeeNormalContribution: 0,
      employerNormalContribution: 0,
      employeeVoluntaryContribution: 0,
      employerVoluntaryContribution: 0,
    };

    const preMonths = this.lineMonths();
    return {
      chartData: {
        month: emptyData,
        year: emptyData,
        yearMonth: [],
      },
      // pieSeries: [44, 55, 13, 43],
      pieOptions: {
        chart: {
          width: 380,
          type: "pie",
        },
        labels: [
          "Employer Normal",
          "Employee Normal",
          "Employer Voluntary",
          "Employee Voluntary",
        ],
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 200,
              },
              legend: {
                position: "bottom",
              },
            },
          },
        ],
      },
      /*  barSeries: [], */
      barOptions: {
        chart: {
          type: "bar",
        },
        plotOptions: {
          bar: {
            borderRadius: 4,
            horizontal: true,
          },
        },
        dataLabels: {
          enabled: false,
        },
        tooltip: {
          enabled: true,
          y: {
            formatter: (val) => {
              return this.formatMoney(val);
            },
          },
        },
        xaxis: {
          categories: [
            "Employer Normal",
            "Employee Normal",
            "Employer Voluntary",
            "Employee Voluntary",
          ],
          labels: {
            formatter: (val) => {
              return this.formatMoney(val);
            },
          },
        },
      },
      // lineSeries: [],
      lineOptions: {
        chart: {
          type: "line",
          zoom: {
            enabled: false,
          },
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          curve: "smooth",
        },
        tooltip: {
          enabled: true,
          y: {
            formatter: (val) => {
              return this.formatMoney(val);
            },
          },
        },
        grid: {
          row: {
            colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
            opacity: 0.5,
          },
        },
        xaxis: {
          categories: preMonths,
        },
      },
    };
  },

  methods: {
    formatMoney(value) {
      return "₦" + Number(value).toLocaleString();
    },

    lineMonths() {
      let month = new Date().getMonth();
      const preMonths = [];
      for (let i = 1; i <= month + 1; i++) {
        preMonths.push(this.$months[i].slice(0, 3));
      }
      return preMonths;
    },
  },
};
</script>

<style scoped>
@import "../../assets/css/dashboard.css";
.bg-purple {
  background: purple;
}
.chart-icon {
  font-size: 130px;
}
.chart-icon_plus {
  font-size: 240px;
}
.card-body p {
  color: #ffffff;
}
</style>
