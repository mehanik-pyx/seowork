import { createApp } from 'vue'
import App from './App.vue'

import HighchartsVue from 'highcharts-vue'
import Highcharts from 'highcharts'
import stockInit from 'highcharts/modules/stock'
import exportData from 'highcharts/modules/export-data'
import exportingInit from 'highcharts/modules/exporting'

exportingInit(Highcharts)
exportData(Highcharts)
stockInit(Highcharts)

createApp(App).use(HighchartsVue, {tagName: 'chart'}).mount('#app')
