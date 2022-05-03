<template>
  <code>{{data}}</code>
</template>

<script>
  export default {
    name: "ChartTable",

    data() {
      return {
        data: null
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
            this.data = data.items
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
