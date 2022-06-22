<template>
  <div>
    <Loader v-if="loading" />
    <div v-else-if="record">
      <div class="breadcrumb-wrap">
        <router-link to="/history" class="breadcrumb">История</router-link>
        <a @click.prevent class="breadcrumb">{{
          record.type === "income" ? "Доход" : "Расход"
        }}</a>
      </div>
      <!-- <CardDetail :record="record" :key="count" /> -->
      <div class="row">
        <div class="col s12 m6">
          <div
            class="card"
            :class="{
              red: record.type === 'outcome',
              green: record.type === 'income',
            }"
          >
            <div class="card-content white-text">
              <p>Описание: {{ record.description }}</p>
              <p>Сумма: {{ record.amount }}</p>
              <p>Категория: {{ record.categoryName }}</p>

              <small>{{ record.date | date("datetime") }}</small>
            </div>
          </div>
        </div>
      </div>
      <h4>Редактировать запись</h4>
      <form @submit.prevent="submitHandler">
        <div class="input-field">
          <input
            id="name"
            type="text"
            v-model="description"
            :class="{
              invalid: !$v.description.required,
            }"
          />
          <label for="name">Описание</label>
          <span class="helper-text invalid" v-if="!$v.description.required">
            Введите описание
          </span>
        </div>

        <div class="input-field">
          <input
            id="limit"
            type="number"
            v-model.number="amount"
            :class="{
              invalid: !$v.amount.required,
            }"
          />
          <label for="limit">Сумма</label>
          <span class="helper-text invalid" v-if="!$v.amount.required">
            Введите сумму
          </span>
        </div>

        <button class="btn waves-effect waves-light" type="submit">
          Обновить
          <i class="material-icons right">send</i>
        </button>
      </form>
    </div>
    <p class="center" v-else>Запись с id={{ $route.params.id }} не найдена</p>
  </div>
</template>

<script>
//import CardDetail from "@/components/CardDetail";
import { mapGetters } from "vuex";
import { required } from "vuelidate/lib/validators";
export default {
  name: "detail",
  //components: { CardDetail },

  data: () => ({
    record: null,
    loading: true,
    description: "",
    amount: null,
  }),

  validations: {
    description: { required },
    amount: { required },
  },

  computed: {
    ...mapGetters(["info"]),
  },

  methods: {
    async submitHandler() {
      let bill;
      let diffAmount = this.record.amount - this.amount;

      if (this.record.type === "outcome" && diffAmount >= 0) {
        bill = this.info.bill + diffAmount;
      }

      if (this.record.type === "outcome" && diffAmount < 0) {
        bill = this.info.bill - Math.abs(diffAmount);
      }

      if (this.record.type === "income" && diffAmount >= 0) {
        bill = this.info.bill - diffAmount;
      }

      if (this.record.type === "income" && diffAmount < 0) {
        bill = this.info.bill + Math.abs(diffAmount);
      }

      if (this.$v.$invalid) {
        this.$v.$touch();
        return;
      }

      try {
        const recordData = {
          id: this.$route.params.id,
          description: this.description,
          amount: this.amount,
        };

        await this.$store.dispatch("updateRecord", recordData);
        this.record = await this.$store.dispatch(
          "fetchRecordById",
          this.$route.params.id
        );

        await this.$store.dispatch("updateInfo", { bill });

        this.description = "";
        this.amount = null;
        //this.$v.$reset();
        //console.log(recordData);
      } catch (e) {
        console.log(e);
        throw e;
      }
    },
  },

  async mounted() {
    const id = this.$route.params.id;
    const record = await this.$store.dispatch("fetchRecordById", id);
    const category = await this.$store.dispatch(
      "fetchCategoryById",
      record.categoryId
    );

    this.record = {
      ...record,
      categoryName: category.title,
    };

    setTimeout(() => {
      window.M.updateTextFields();
    }, 0);

    this.loading = false;
  },
};
</script>
