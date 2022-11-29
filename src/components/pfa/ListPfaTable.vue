<template>
  <div>
    <b-table
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
        <span v-if="data.value" class="text-primary">Sent</span>
        <span v-else class="text-secondary">Not sent</span>
      </template>

      <template #cell(amount)="data">
        {{ data.value | toCurrency }}
      </template>

      <template #cell(action)="data">
        <button
          class="btn btn-sm btn-info m-1"
          @click="showItems(data.item._id)"
        >
          Show Items
        </button>

        <button
          class="btn btn-sm btn-secondary m-1"
          @click="getDownloads(data.item._id)"
        >
          Download
        </button>

        <button
          v-if="!data.item.transmitted"
          v-b-tooltip.hover
          title="Transmit transaction to the PFA"
          class="btn btn-sm btn-primary m-1"
          @click="transmit(data.item._id)"
        >
          Transmit
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
          label: "Status",
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

    transmit(pfaCode) {
      this.$emit("transmit", {
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
