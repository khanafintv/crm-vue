<template>
  <div class="row">
    <div class="col s12 m6">
      <p>{{ record }}</p>
      <!-- <div
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
      </div> -->
    </div>
  </div>
</template>

<script>
export default {
  name: "CardDetail",

  props: {
    record: {
      type: Object,
      required: true,
    },
  },
};
</script>
