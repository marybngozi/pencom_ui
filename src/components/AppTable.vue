<template>
  <section class="py-5">
    <b-table
      id="my-table"
      :fields="fields"
      outlined
      small
      striped
      hover
      :items="items"
      :per-page="perPage"
      :current-page="currentPage"
      show-empty
      :busy.sync="isBusy"
      :selectable="selectable"
      @row-selected="onRowSelected"
    >
    </b-table>

    <b-pagination
      v-model="currentPage"
      :total-rows="rows"
      :per-page="perPage"
      aria-controls="my-table"
      size="sm"
      limit="10"
      page-class="text-blue"
      next-class="text-blue"
    >
    </b-pagination>
  </section>
</template>

<script>
import { secureAxios } from "../../services/AxiosInstance";
export default {
  name: "AppTable",
  props: {
    selectable: {
      type: Boolean,
      default: true,
    },
    fields: {
      type: Array,
      default: () => [],
    },
    items: {
      type: Array,
      default: () => [],
    },
    form: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      isBusy: false,
      selectedItems: [],
      perPage: 3,
      currentPage: 1,
    };
  },
  computed: {
    rows() {
      return this.items.length;
    },
  },
  methods: {
    onRowSelected(data) {
      this.selectedItems = data;
      console.log(this.selectedItems);
    },

    async myProvider(ctx) {
      try {
        this.isBusy = true;
        const api = `/some/url?page=${ctx.currentPage}&size=${ctx.perPage}`;
        const response = await secureAxios.post(api, this.form);

        if (!response) {
          return [];
        }

        const { data } = response;

        return data.data;
      } catch (error) {
        this.isBusy = false;
        return [];
      }
    },
  },
};
</script>

<style scoped></style>
