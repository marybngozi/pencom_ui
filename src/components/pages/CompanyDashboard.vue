<template>
  <div class="d-flex justify-content-between">
    <div class="left border-right pt-5 px-5">
      <!-- top section -->
      <section id="sec1" class="d-flex">
        <BlueBox />
        <PinkBox />
      </section>

      <!-- gray section -->
      <section id="sec2" class="d-flex">
        <GrayBox />
        <GrayBox />
      </section>

      <!-- graph section -->
      <section id="sec3">
        <GraphBox />
      </section>

      <!-- table section -->
      <section id="sec4" class="pb-5">
        <TableBox />
      </section>
    </div>

    <div class="right">
      <QuickActions />

      <UserGuide :instructions="instructions" />

      <ProfileBox />

      <!-- Notification gray box -->
      <div class="out-boxx">
        <div
          class="notification-boxx d-flex justify-content-between align-items-center"
        >
          <div>
            <i class="fa fa-thumbs-up icon"></i>
          </div>

          <div>
            <h6>Employer code verification</h6>
            <small>You have completed your verification process</small>
          </div>

          <p>Done</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { secureAxios } from "../../services/AxiosInstance";
import BlueBox from "@/components/dashboard/BlueBox";
import PinkBox from "@/components/dashboard/PinkBox";
import GrayBox from "@/components/dashboard/GrayBox";
import GraphBox from "@/components/dashboard/GraphBox";
import TableBox from "@/components/dashboard/TableBox";
import QuickActions from "@/components/dashboard/QuickActions";
import UserGuide from "@/components/dashboard/UserGuide";
import ProfileBox from "@/components/dashboard/ProfileBox";
export default {
  name: "CompanyDashboard",

  components: {
    BlueBox,
    PinkBox,
    GrayBox,
    GraphBox,
    TableBox,
    QuickActions,
    UserGuide,
    ProfileBox,
  },
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
    return {
      instructions: {
        1: "Perform multiple functions from upload pension schedules to making monthly payments for your staff set.",
        2: "You can create a “Sub-Admin” staff to perform different functions like uploading a pension schedule file, processing a pension schedule  for the organization.",
        3: "Each menu has a “Use guide” to work you through on what you need to do to complete your remittances.",
        4: "You can use the support link located at the right-hand corner of this page if you need further assistance on the platform.",
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
/* @import "../../assets/css/dashboard.css"; */
section#sec1 {
  gap: 28px;
}
section#sec2 {
  margin-top: 28px;
  gap: 28px;
}
section#sec3,
section#sec4 {
  margin-top: 28px;
}
.left {
  width: 70%;
  overflow-y: scroll;
  height: calc(100vh - 70px);
}
.right {
  width: 30%;
  overflow-y: scroll;
  height: calc(100vh - 70px);
}
.left::-webkit-scrollbar,
.right::-webkit-scrollbar {
  display: none;
}
.left,
.right {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}
.right .out-boxx {
  padding: 28px;
  border-bottom: 1px solid #f2f2f2;
}
.right .notification-boxx {
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
  line-height: 19px;
  color: #263238;
  margin-bottom: 2px;
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
</style>
