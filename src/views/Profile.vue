<template>
  <div>
    <div class="page-title">
      <h3>Профиль</h3>
    </div>

    <form class="form" @submit.prevent="clickHandler">
      <div class="input-field">
        <input id="description" type="text" v-model="userName" />
        <label for="description">Имя</label>
        <span class="helper-text invalid">Введите Имя</span>
      </div>

      <button class="btn waves-effect waves-light" type="submit">
        Обновить
        <i class="material-icons right">send</i>
      </button>
    </form>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  name: "profile",

  data: () => ({
    userName: "",
  }),

  computed: {
    ...mapGetters(["info"]),
  },

  methods: {
    ...mapActions(["updateInfo"]),
    clickHandler() {
      //this.$store.dispatch("updateInfo", { name: this.userName });
      this.updateInfo({ name: this.userName });
      this.userName = "";
    },
  },

  mounted() {
    this.userName = this.info.name;

    setTimeout(() => {
      window.M.updateTextFields();
    }, 0);
  },
};
</script>
