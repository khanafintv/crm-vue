<template>
  <div>
    <div class="page-title">
      <h3>История записей</h3>
    </div>

    <div class="history-chart">
      <canvas ref="canvas"></canvas>
    </div>

    <Loader v-if="loading" />

    <p class="center" v-else-if="!records.length">
      Записей нет. <router-link to="/record">Добавить запись</router-link>
    </p>

    <section v-else>
      <HistoryTable :records="items" @deleted="deleted" />
      <Paginate
        v-model="page"
        :page-count="pageCount"
        :click-handler="pageChangeHandler"
        :prev-text="'Назад'"
        :next-text="'Вперед'"
        :container-class="'pagination'"
        :page-class="'waves-effect'"
      />
    </section>
  </div>
</template>

<script>
//:key="records.length"

import HistoryTable from "@/components/HistoryTable";
import paginationMixin from "@/mixins/pagination.mixin";
import { Pie } from "vue-chartjs";
import { mapGetters } from "vuex";
export default {
  name: "history",
  extends: Pie,
  mixins: [paginationMixin],
  data: () => ({
    loading: true,
    records: [],
  }),

  async mounted() {
    //const chart = ;

    this.records = await this.$store.dispatch("fetchRecords");
    const categories = await this.$store.dispatch("fetchCategories");

    this.setup(categories);

    this.loading = false;
  },

  computed: {
    ...mapGetters(["info"]),
  },

  methods: {
    async deleted(id) {
      let findItem = this.items.find((item) => item.id === id);

      const bill =
        findItem.type === "outcome"
          ? this.info.bill + findItem.amount
          : this.info.bill - findItem.amount;

      await this.$store.dispatch("updateInfo", { bill });

      let findIdx = this.items.findIndex((item) => item.id === id);
      this.items.splice(findIdx, 1);

      this.records = await this.$store.dispatch("fetchRecords");
      const categories = await this.$store.dispatch("fetchCategories");

      this.setup(categories);
    },

    setup(categories) {
      this.setupPagination(
        this.records.map((record) => {
          return {
            ...record,
            categoryName: categories.find((c) => c.id === record.categoryId)
              .title,
            typeClass: record.type === "income" ? "green" : "red",
            typeText: record.type === "income" ? "Доход" : "Расход",
          };
        })
      );

      this.renderChart({
        labels: categories.map((c) => c.title),
        datasets: [
          {
            label: "Расходы по категориям",
            data: categories.map((c) => {
              return this.records.reduce((total, r) => {
                if (r.categoryId === c.id) {
                  total += +r.amount;
                }

                return total;
              }, 0);
            }),
            backgroundColor: [
              "rgba(255, 99, 132, 0.2)",
              "rgba(54, 162, 235, 0.2)",
              "rgba(255, 206, 86, 0.2)",
              "rgba(75, 192, 192, 0.2)",
              "rgba(153, 102, 255, 0.2)",
              "rgba(255, 159, 64, 0.2)",
            ],
            borderColor: [
              "rgba(255, 99, 132, 1)",
              "rgba(54, 162, 235, 1)",
              "rgba(255, 206, 86, 1)",
              "rgba(75, 192, 192, 1)",
              "rgba(153, 102, 255, 1)",
              "rgba(255, 159, 64, 1)",
            ],
            borderWidth: 1,
          },
        ],
      });
    },
  },

  components: {
    HistoryTable,
  },
};
</script>
