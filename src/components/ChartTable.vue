<template>
  <div>
    <chart constructor-type="stockChart" :options="chartOptions"/>
    <code>{{ chartOptions }}</code>
  </div>
</template>

<script>
  import {Chart} from 'highcharts-vue'
  import dataMapper from "@/utils/dataMapper";
  import Highcharts from 'highcharts'
  import stockInit from 'highcharts/modules/stock'

  stockInit(Highcharts)
  export default {
    name: "ChartTable",
    components: {Chart},
    data() {
      return {
        chartOptions: {
          title: {text: 'Some cool chart'},
          series: [{
            data: []
          }],
          tooltip: {
            shared: true
          },
          accessibility: {enabled: false},
          credits: {enabled: false}
        },
      }
    },
    created() {
      this.request()
    },
    methods: {
      request() {
        try {
          fetch('https://test-task-for-frontend.herokuapp.com/data')
            .then(res => res.json())
            .then(data => {
              this.chartOptions.series[0].data = dataMapper(data.items)
              console.log(data.items);
            })
        } catch (e) {
          console.log(e)
        }
      }
    }
  }
</script>

<style scoped>

</style>
