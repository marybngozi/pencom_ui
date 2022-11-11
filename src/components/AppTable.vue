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
  },
  data() {
    return {
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
  },
};
</script>

<style scoped></style>
