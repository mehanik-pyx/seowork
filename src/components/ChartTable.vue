<template>
  <div v-if="chartOptions.series">
    <chart :options="chartOptions" constructor-type="stockChart"/>
  </div>
</template>

<script>
  import {Chart} from 'highcharts-vue'
  import Highcharts from 'highcharts'
  import stockInit from 'highcharts/modules/stock'
  import response from '../assets/response.json'
  import exportData from 'highcharts/modules/export-data'
  import exportingInit from 'highcharts/modules/exporting'

  exportingInit(Highcharts)
  exportData(Highcharts)
  stockInit(Highcharts)

  export default {
    name: "ChartTable",
    components: {Chart},
    data() {
      return {
        chartOptions: {
          title: {text: 'Some cool chart'},
          series: [],
          exporting: {
            showTable: true,
            tableCaption: 'Not so cool table'
          },
          accessibility: {enabled: false},
          credits: {enabled: false}
        },
      }
    },
    mounted() {
      console.log(response.items);
      this.chartOptions.series = this.dataMapper(response.items)
      //TODO: this.request()
    },
    methods: {
      request() {
        try {
          fetch('https://test-task-for-frontend.herokuapp.com/data')
            .then(res => res.json())
            .then(data => {
              this.chartOptions.series = this.dataMapper(data.items)
              console.log(data.items);
            })
        } catch (e) {
          console.log(e)
        }
      },
      capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
      },
      parseDate(timestamp) {
        return Highcharts.dateFormat('%A, %b %e, %Y', timestamp)
      },
      dataMapper(items) {
        items.forEach((item) => {
          console.log(item)
          item.name = this.capitalizeFirstLetter(item.name)
          console.log(item)
          item.data.map((i) => {
            i.x = i.date
            i.y = i.value
            return i
          });
        })
        return items
      }
    }
  }
</script>

<style scoped>

</style>
