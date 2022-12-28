<template>
  <div id="dash" class="d-flex justify-content-between flex-wrap">
    <!-- left side -->
    <div class="left-dash col-lg-8 border-right pt-5 pl-3 pr-3">
      <!-- top section -->
      <section id="sec1" class="d-flex justify-content-between flex-wrap">
        <BlueBox class="col-md-7 col-12" />
        <PinkBox class="col-md-5 col-12" />
      </section>

      <!-- gray section -->
      <section id="sec2" class="d-flex justify-content-between flex-wrap">
        <GrayBox boldTitle="Employer" class="col-12 col-md-6" />
        <GrayBox boldTitle="Employee" class="col-12 col-md-6" />
      </section>

      <!-- graph section -->
      <section id="sec3">
        <GraphBox />
      </section>

      <!-- table section -->
      <section id="sec4" class="pb-5">
        <TableBox :tableHeaders="tableHeaders" :rows="tableRows" />
      </section>
    </div>

    <!-- right side -->
    <div class="right-dash col-lg-4 p-0">
      <div class="border-bottom">
        <QuickActions />
      </div>

      <div class="border-bottom">
        <UserGuide :instructions="instructions" />
      </div>

      <div class="border-bottom">
        <ProfileBox />
      </div>

      <!-- Notification gray box -->
      <div class="border-bottom">
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
  </div>
</template>

<script>
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

  data() {
    return {
      instructions: {
        1: "Perform multiple functions from upload pension schedules to making monthly payments for your staff set.",
        2: "You can create a “Sub-Admin” staff to perform different functions like uploading a pension schedule file, processing a pension schedule  for the organization.",
        3: "Each menu has a “Use guide” to work you through on what you need to do to complete your remittances.",
        4: "You can use the support link located at the right-hand corner of this page if you need further assistance on the platform.",
      },
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
          label: "Staff Count",
          key: "staffCount",
        },
        {
          label: "Transaction date",
          key: "createdAt",
        },
      ],
      tableRows: [
        {
          month: "January",
          staffCount: 22,
          amount: "N 220,005.95",
          createdAt: "Sept 10. 2022",
        },
        {
          month: "Febuary",
          staffCount: 22,
          amount: "N 220,005.95",
          createdAt: "Sept 10. 2022",
        },
        {
          month: "March",
          staffCount: 22,
          amount: "N 220,005.95",
          createdAt: "Sept 10. 2022",
        },
        {
          month: "April",
          staffCount: 22,
          amount: "N 220,005.95",
          createdAt: "Sept 10. 2022",
        },
        {
          month: "May",
          staffCount: 22,
          amount: "N 220,005.95",
          createdAt: "Sept 10. 2022",
        },
        {
          month: "June",
          staffCount: 22,
          amount: "N 220,005.95",
          createdAt: "Sept 10. 2022",
        },
        {
          month: "July",
          staffCount: 22,
          amount: "N 220,005.95",
          createdAt: "Sept 10. 2022",
        },
      ],
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
