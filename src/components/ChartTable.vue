<template>
  <div v-if="chartOptions.series">
    <chart :options="chartOptions" constructor-type="stockChart"/>

    <!-- Насколько я понял, Highcharts не даёт возможности менять отображение даты в таблице,
         поэтому добавил сюда таблицу из примера, по хорошему её надо вынести в отдельный компонент-->

    <table v-if="tableData" id="datatable">
      <caption>Cool table</caption>
      <thead>
      <tr>
        <th>Date</th>
        <th
          :class="sortedBy === th && 'sort'"
          v-for="th in tableData.columnNames"
          :key="th"
          @click="sortBy(th)"
        >{{ capitalizeFirstLetter(th) }}
        </th>
      </tr>
      </thead>
      <tbody>
      <tr
        v-for="row in tableData.rowData"
        :key="row.date"
      >
        <th>{{ parseDate(row.date) }}</th>
        <td
          v-for="dateItem in row.data"
          :key="dateItem.name"
        >
          {{ dateItem.value }}
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
  import {Chart} from 'highcharts-vue'
  import Highcharts from 'highcharts'
  import stockInit from 'highcharts/modules/stock'
  // import response from '../assets/response.json'
  /*В идеале сделать это в main.js прям ,но тоже не критично*/
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
        tableData: null,
        sortedBy: null
      }
    },
    mounted() {
      this.request()
      // console.log(response.items);
      // this.chartOptions.series = this.chartMapper(response.items)
      // this.tableData = this.tableMapper(response.items)
    },
    methods: {
      request() {
        try {
          /*В целом ок, но по заданию надл было подключить Vuex и сделать запрос там. Там же в мутациях подготовить данные для
          * графика и таблицы. Для нас в целом это было бы не критично, но кто-то может даже и не стать смотреть тестовое. Крч чуть повнимательнее читай.
          *
          * */
          fetch('https://test-task-for-frontend.herokuapp.com/data')
            .then(res => res.json())
            .then(data => {
              this.chartOptions.series = this.chartMapper(data.items)
              this.tableData = this.tableMapper(data.items)
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
      chartMapper(items) {
        console.log(items)
        items.forEach((item) => {
          item.name = this.capitalizeFirstLetter(item.name)
          item.data.map((i) => {
            i.x = i.date
            i.y = i.value
            return i
          });
        })
        /*Некоторые проверяющие в тестовых могут ревностно относиться к оставленным консоль логами. когда ты обратаываешь ошибки консолем именно в тестовых заданиях еще ок, а так могут придраться. Крч я бы убирал за собой перед деплоем.*/
        console.log(items)
        return items
      },

      tableMapper(items) {
        let newDataObj = {}
        newDataObj.columnNames = items.map(item => item.name)
        newDataObj.rowData = []
        items[0].data.forEach((row, idx) => {
          let rowObj = {}
          rowObj.date = row.date
          rowObj.data = items.map(item => {
            return {
              value: item.data[idx].value,
              name: item.name
            }
          })
          newDataObj.rowData.push(rowObj)
        })
        return newDataObj
      },
      sortBy(field) {
        let indexA
        let indexB
        this.tableData.rowData.sort((a, b) => {
          indexA = a.data.findIndex(it => it.name === field);
          indexB = b.data.findIndex(it => it.name === field);
          return a.data[indexA].value - b.data[indexB].value
        })
        this.sortedBy = field
      }
    }
  }
</script>

<style scoped>
#datatable {
  font-family: Verdana, sans-serif;
  border-collapse: collapse;
  border: 1px solid #ebebeb;
  margin: 10px auto;
  text-align: center;
  width: 100%;
}

#datatable caption {
  padding: 1em 0;
  font-size: 1.2em;
  color: #555;
}

#datatable th {
  font-weight: 600;
  padding: 0.5em;
}

#datatable td,
#datatable th,
#datatable caption {
  padding: 0.5em;
}

#datatable thead tr,
#datatable tr:nth-child(even) {
  background: #f8f8f8;
}

#datatable tr:hover {
  background: #f1f7ff;
}

.sort {
  text-decoration: underline;
}
</style>
