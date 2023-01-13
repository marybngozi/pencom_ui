<template>
  <div>
    <b-table
      class="my-table"
      id="pfas-table"
      :fields="fieldsPfas"
      small
      :bordered="false"
      :borderless="false"
      :busy="gettingPfas"
      :items="fetchItems"
      :per-page="perPagePfas"
      :current-page="currentPagePfa"
      show-empty
    >
      <template #cell(transmitted)="data">
        <span v-if="data.value" class="text-success">Yes</span>
        <span v-else class="text-danger">No</span>
      </template>

      <template #cell(amount)="data">
        {{ data.value | toCurrency }}
      </template>

      <template #cell(action)="data">
        <button
          class="btn-xsm bg-blue-dark m-1"
          @click="showItems(data.item._id)"
        >
          Show Items
        </button>

        <button
          class="btn-xsm bg-outline-blue m-1"
          @click="getDownloads(data.item._id)"
        >
          Download
        </button>
      </template>
    </b-table>

    <b-pagination
      v-model="currentPagePfa"
      :total-rows="rowsPfa"
      :per-page="perPagePfas"
      aria-controls="pfas-table"
      size="sm"
      limit="10"
      pills
      align="center"
    >
    </b-pagination>
  </div>
</template>

<script>
import { secureAxios } from "../../services/AxiosInstance";
export default {
  name: "ListPfaTable",

  props: {
    batchId: {
      type: String,
      required: true,
    },
    companyCode: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      gettingPfas: false,
      perPagePfas: 5,
      currentPagePfa: 1,
      rowsPfa: 0,
      fieldsPfas: [
        {
          key: "pfaName",
          label: "PFA",
        },
        {
          key: "itemCount",
          label: "Contributions count",
        },
        {
          key: "transmitted",
          label: "Remit Status",
        },
        {
          key: "amount",
          label: "Total Amount",
        },
        {
          key: "action",
          label: "Actions",
        },
      ],
    };
  },

  methods: {
    showItems(pfaCode) {
      this.$emit("showItems", {
        pfaCode,
        batchId: this.batchId,
        companyCode: this.companyCode,
      });
    },

    getDownloads(pfaCode) {
      this.$emit("getDownloads", {
        pfaCode,
        batchId: this.batchId,
        companyCode: this.companyCode,
      });
    },

    async fetchItems({ currentPage, perPage }) {
      try {
        const api = `payment/get-item-contribution?page=${currentPage}&size=${perPage}`;

        const res = await secureAxios.post(api, {
          batchId: this.batchId,
          companyCode: this.companyCode,
        });

        if (!res) {
          return [];
        }

        const { data } = res;

        this.rowsPfa = data.meta.total;
        return data.data;
      } catch (err) {
        console.log(err);
        return [];
      }
    },
  },
};
</script>

<style scoped></style>
