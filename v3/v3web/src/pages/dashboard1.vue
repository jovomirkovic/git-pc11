<template>
  <q-page class="flex flex-center">
    <div class="column justify-center items-center q-pa-md">
      <q-img
        style="width: 150px; margin-bottom: 70px"
        :src="tenantLogo"
      ></q-img>

      <q-card style="width: 80%; box-shadow: 0 14px 18px rgba(0, 0, 0, 0.5)">
        <q-card-section class="bg-blue-8 text-white">
          <div class="row">
            <div class="col-10">
              <div class="text-h5">Hello {{ this.korisnik }}</div>
              <div class="text-h5">Tenant: {{ this.tenant }}</div>
              <div class="text-h5">Roles: {{ this.roles }}</div>
              <div class="text-h5">Login time: {{ this.vreme }}</div>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import Vue from "vue";
import IEcharts from "vue-echarts-v3/src/full.js";
import { exportFile } from "quasar";

Vue.component("IEcharts", IEcharts);

function wrapCsvValue(val, formatFn) {
  let formatted = formatFn !== void 0 ? formatFn(val) : val;

  formatted =
    formatted === void 0 || formatted === null ? "" : String(formatted);

  formatted = formatted.split('"').join('""');

  return `"${formatted}"`;
}

export default {
  props: ["tenantLogo"],
  data() {
    return {
      tenant: window.$tenant,
      korisnik: window.$userName,
      roles: window.$roles,
      vreme: new Date().toLocaleString(),
      selektovaniTim: null,
      selektovaniIgrac: null,
      listaTimova: [],
      listaIgraca: [],
      listaIgraca1: [
        { label: "Dule Savić", value: 1 },
        { label: "Vladimir Petrović", value: 2 },
        { label: "Dejan Savićevič", value: 3 },
      ],
      barChartOption: {
        grid: {
          bottom: "20%",
          left: "15%",
          top: "3%",
        },
        legend: {
          bottom: 0,
        },
        tooltip: {},
        dataset: {
          dimensions: ["time_period", "svi", "ekipa"],
          source: [
            { time_period: "1", svi: 10, ekipa: 10 },
            { time_period: "2", svi: 15, ekipa: 16 },
            { time_period: "3", svi: 45, ekipa: 48 },
            { time_period: "4", svi: 17, ekipa: 19 },
            { time_period: "5", svi: 3, ekipa: 9 },
          ],
        },
        xAxis: {
          type: "category",
          // axisLabel: {
          //     rotate: 45
          // }
        },
        yAxis: {
          // name: 'Goal',
          // nameLocation: 'center',
          // nameGap: 30,
          // nameTextStyle:{
          //     fontWeight: 'bold'
          // }
        },
        series: [
          { type: "bar", name: "svi" },
          { type: "bar", name: "Tim" },
        ],
      },
      lineChartOption: {
        grid: {
          bottom: "20%",
          left: "15%",
          top: "3%",
        },
        legend: {
          bottom: 0,
        },
        tooltip: {
          // formatter:
          //     function (param) {
          //     console.log(param)
          //     // return param.seriesName + '<br />' + param.name + ': ';
          // }
        },
        dataset: {
          dimensions: ["product_name", "share", "growth"],
          source: [
            { product_name: "Product A", share: 20, growth: 25 },
            { product_name: "Product B", share: 22, growth: 18 },
            { product_name: "Product C", share: 40, growth: 45 },
          ],
        },
        xAxis: {
          type: "category",
          // axisLabel: {
          //     rotate: 45
          // }
        },
        yAxis: {
          axisLabel: {
            formatter: function (value, index) {
              return value + " %";
            },
          },
        },
        series: [
          { type: "line", name: "Share" },
          { type: "line", name: "Growth" },
        ],
      },
      pieOptions: {
        tooltip: {
          show: true,
        },
        legend: {
          orient: "horizontal",
          bottom: 0,
          width: 300,
        },
        series: [
          {
            name: "Competitor",
            type: "pie",
            radius: ["40%", "70%"],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: true,
                position: "inner",
                formatter: function (param, index) {
                  return param.value + " %";
                },
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: "20",
                  fontWeight: "bold",
                },
              },
            },
            labelLine: {
              normal: {
                show: false,
              },
            },
            selectedMode: "single",
            data: [
              { value: 40, name: "Product 1", selected: true },
              { value: 20, name: "Competitor 1", selected: false },
              { value: 15, name: "Competitor 2", selected: false },
              { value: 25, name: "Competitor 3", selected: false },
            ],
          },
        ],
      },

      borgOptions: {
        tooltip: {
          //formatter: "{a} <br/>{c} {b}"
        },
        toolbox: {
          show: false,
          feature: {
            restore: { show: true },
            saveAsImage: { show: true },
          },
        },
        series: [
          {
            name: "Borg",
            type: "gauge",
            z: 3,
            min: 1,
            max: 12,
            splitNumber: 11,
            radius: "100%",
            axisLine: {
              // 坐标轴线
              lineStyle: {
                // 属性lineStyle控制线条样式
                width: 10,
              },
            },
            axisTick: {
              // 坐标轴小标记
              length: 1, // 属性length控制线长
              lineStyle: {
                // 属性lineStyle控制线条样式
                color: "auto",
              },
            },
            splitLine: {
              // 分隔线
              length: 20, // 属性length控制线长
              lineStyle: {
                // 属性lineStyle（详见lineStyle）控制线条样式
                color: "auto",
              },
            },
            axisLabel: {
              backgroundColor: "auto",
              borderRadius: 3,
              color: "#eee",
              padding: 3,
              textShadowBlur: 2,
              textShadowOffsetX: 1,
              textShadowOffsetY: 1,
              textShadowColor: "#222",
            },
            title: {
              // 其余属性默认使用全局文本样式，详见TEXTSTYLE
              fontWeight: "bolder",
              fontSize: 20,
              fontStyle: "italic",
            },
            detail: {
              // 其余属性默认使用全局文本样式，详见TEXTSTYLE
              formatter: function (value) {
                value = (value + "").split(".");
                value.length < 2 && value.push("00");
                return (
                  ("00" + value[0]).slice(-2) +
                  "." +
                  (value[1] + "00").slice(0, 2)
                );
              },
              fontWeight: "bolder",
              borderRadius: 3,
              backgroundColor: "#444",
              borderColor: "#aaa",
              shadowBlur: 5,
              shadowColor: "#333",
              shadowOffsetX: 0,
              shadowOffsetY: 3,
              borderWidth: 2,
              textBorderColor: "#000",
              textBorderWidth: 2,
              textShadowBlur: 2,
              textShadowColor: "#fff",
              textShadowOffsetX: 0,
              textShadowOffsetY: 0,
              fontFamily: "Arial",
              width: 60,
              color: "#eee",
              rich: {},
            },
            data: [{ value: 7, name: "Borg" }],
          },
        ],
      },
      borgOpis: "",

      gaugeOptions: {
        tooltip: {
          formatter: "{a} <br/>{b} : {c}%",
        },
        series: [
          {
            type: "gauge",
            detail: { formatter: "{value}%" },
            data: [{ value: 7 }],
            min: 0,
            radius: "100",
            axisLine: {
              show: true,
              lineStyle: {
                color: [
                  [0.35, "#293c55"],
                  [0.65, "#61a0a8"],
                  [1, "#c23731"],
                ],
                width: 20,
              },
            },
          },
        ],
      },

      stackedBarOptions: {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
          backgroundColor: "rgba(50,50,50,0.9)",
        },
        legend: {
          bottom: 0,
        },
        color: ["#3395dd", "#ed892d", "#34393b"],
        // legend: {
        //     y: "bottom",
        //     data: [{name: 'Territory Sales', icon: 'circle'}, {
        //         name: 'Remaining Nation Sales',
        //         icon: 'circle'
        //     }]
        // },
        grid: {
          bottom: "10%",
          left: "15%",
          top: "9%",
        },
        calculable: true,
        xAxis: {
          type: "value",
          position: "top",
          axisLine: {
            show: false,
          },
          axisLabel: {
            formatter: function (value, index) {
              return "$" + value;
            },
          },
        },
        yAxis: [
          {
            type: "category",
            data: [
              "Alex Morrow",
              "Joanna Carter",
              "Jimmy Joanna",
              "Mack Hales",
            ],
            axisLabel: {
              fontSize: 12,
            },
          },
        ],
        series: [
          {
            name: "Qualification",
            type: "bar",
            stack: "A",
            data: [300, 350, 400, 500],
          },
          {
            name: "Discovery",
            type: "bar",
            stack: "A",
            data: [100, 180, 250, 300],
          },
          {
            name: "Quote",
            type: "bar",
            stack: "A",
            data: [100, 120, 200, 220],
          },
        ],
      },
      filter: "",
      mode: "list",
    };
  },
  mounted() {
    debugger;

    this.getDataSelekcije(); //idemo da uzmenmo podatke iz baze
    this.getDataIgraci();
    //this.menjajBorg();

    //this.selektovaniIgrac.value = window.$igracID
  },
  methods: {
    menjajBorg: function () {
      var self = this;
      setInterval(function () {
        if (self.borgOptions.series[0].data[0].value == 2.97) {
          self.borgOptions.series[0].data[0].value = 7.25;
          self.borgOpis = "Prosečna vrednost";
        } else if (self.borgOptions.series[0].data[0].value == 7.25) {
          self.borgOptions.series[0].data[0].value = 10.03;
          self.borgOpis = "Najopterećeniji igrač: Mile Delija";
        } else {
          self.borgOptions.series[0].data[0].value = 2.97;
          self.borgOpis = "Najmanje opterećeni igrač: Rade Tot";
        }
      }, 5000);
    },
    getDataSelekcije() {
      let linkStr = this.$apiPutanja + "/selekcije";
      //debugger;
      this.$axios
        .get(linkStr, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + window.$token,
          },
        })
        .then((response) => {
          debugger;
          this.listaTimova = response.data.map(this.dajTimove);
          //this.selektovaniTim.value = window.$timID

          debugger;
        })
        .catch((e) => {
          //this.errors.push(e);
          console.log("Greska: " + e);
        });
    },
    //''''''''''''''''''''''''''''''''''''''''
    // citanje podataka o igracima
    //........................................
    getDataIgraci() {
      let linkStr = this.$apiPutanja + "/igraci";
      debugger;
      this.$axios
        .get(linkStr, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + window.$token,
          },
        })
        .then((response) => {
          debugger;
          this.listaIgraca = response.data.map(this.dajIgrace);
          debugger;
        })
        .catch((e) => {
          //this.errors.push(e);
          console.log("Greska: " + e);
        });
    },
    dajTimove(item) {
      debugger;
      return { label: item.imeTima, value: item.id };
    },
    dajIgrace(item) {
      debugger;
      return {
        label: item.ime + " " + item.prezime,
        img: item.fotografija,
        value: item.id,
      };
    },
    promenaTima() {
      debugger;
      //this.ekipa[0].children[0].children[0].label=this.selektovaniTim.label
      window.$timID = this.selektovaniTim.value;
      console.log(window.$timID);
    },
    promenaIgraca() {
      debugger;
      window.$igracID = this.selektovaniIgrac.value;
      window.$igracName = this.selektovaniIgrac.label;
      ////alert(window.$igracID)
      ////alert(window.$igracName)
      //console.log(this.ekipa)
    },
    SaveImage(type) {
      const linkSource = this.$refs[type].getDataURL();
      const downloadLink = document.createElement("a");
      document.body.appendChild(downloadLink);
      downloadLink.href = linkSource;
      downloadLink.target = "_self";
      downloadLink.download = type + ".png";
      downloadLink.click();
    },
    exportTable() {
      // naive encoding to csv format
      const content = [this.columns.map((col) => wrapCsvValue(col.label))]
        .concat(
          this.data.map((row) =>
            this.columns
              .map((col) =>
                wrapCsvValue(
                  typeof col.field === "function"
                    ? col.field(row)
                    : row[col.field === void 0 ? col.name : col.field],
                  col.format
                )
              )
              .join(",")
          )
        )
        .join("\r\n");

      const status = exportFile("activity.csv", content, "text/csv");

      if (status !== true) {
        this.$q.notify({
          message: "Browser denied file download...",
          color: "negative",
          icon: "warning",
        });
      }
    },
  },
};
</script>

<style scoped></style>
