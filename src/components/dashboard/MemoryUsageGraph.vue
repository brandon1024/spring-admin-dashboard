<script>
  import {Line} from 'vue-chartjs';

  export default {
    extends: Line,
    props: ['chartData'],
    data() {
      return {
        options: {
          title: {
            display: true,
            text: 'JVM Memory Usage Graph',
            fontSize: 24,
            fontColor: '#fff',
            fontStyle: 'normal'
          },
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero: true
              }
            }]
          },
          fill: false
        }
      }
    },
    mounted() {
      this.renderChart(this.chartData, this.options);
    }
  }
</script>