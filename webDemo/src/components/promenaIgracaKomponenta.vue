<template>

      <!-- <div style="min-width:400px" class1="row q-col-gutter-sm q-ma-xs q-mr-sm">
        <div> -->

          <q-card
          v-if="true"
            style="
              max-width: 80vw;
              border-radius: 5px;
              box-shadow: 0px 15px 25px 0px rgba(50, 50, 50, 0.7);
              color: #323b62;
            "
          >
            <q-card-section>
              <q-btn
                icon="close"
                flat
                round
                dense
                style="float: right;"
                v-close-popup
              ></q-btn>
              <div
                v-if="putanja != 'treninzi' && putanja != 'utakmice' && putanja != 'trenazneVezbe'"
                class="text-h6 col-12"
                style="text-align: center;"
              >
                {{$t('promenaIgraca.izaberiTimIIgraca')}}
              </div>
              <div
                v-else
                class="text-h6 col-12"
                style="text-align: center;"
              >
                {{$t('promenaIgraca.izaberiTim')}}
              </div>
            </q-card-section>

            <!-- <q-separator inset></q-separator> -->

            <q-tabs
              v-model="tab"
              dense
              class="text-grey"
              active-color="primary"
              indicator-color="primary"
              align="justify"
              narrow-indicator
              v-show="putanja != 'treninzi' && putanja != 'utakmice' && putanja != 'trenazneVezbe'"
            >
              <q-tab name="timovi" :label="$t('promenaIgraca.timovi')" />
              <q-tab name="igraci" :label="$t('promenaIgraca.igraci')" />
            </q-tabs>

            <q-tab-panels v-model="tab" animated swipeable >
              <q-tab-panel name="timovi">
                <span
                  v-for="(tim, index) in listaTimova"
                  :key="index"
                  class="clickMouse"
                  style="
                    width: 158px;
                    margin: 15px;
                    background-color: #e5edf4;
                    text-align: center;
                    display: inline-block;
                    border: 1px solid #a1a1a15a;
                    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
                    border-radius: 4px;
                    overflow: hidden;
                  "
                  @click="promenaTima(tim)"
                >
                  <p class='backgroundChange' style="padding: 3px; background-color:#323b62; color: white;">{{tim.mesto}}</p>
                  <p style="font-size: 13pt; font-weight: 600; padding: 0px;">{{tim.label}}</p>
                  <p class='backgroundChange' style="margin: 0px; padding: 3px; background-color:#323b62; color: white;">{{tim.uzrast}}</p>
                </span>
              </q-tab-panel>

              <q-tab-panel class="flex flex-center" name="igraci">
                <span
                  v-for="(igrac, index) in listaIgraca"
                  :key="index"
                  class="row clickMouse"
                  style="
                    width: 110px;
                    margin: 15px;
                    background-color: #e5edf4;
                    text-align: center;
                    display: inline-block;
                    border: 1px solid #a1a1a15a;
                    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
                    border-radius: 4px;
                    overflow: hidden;
                  "
                   :style="[selektovaniIgrac == igrac ? { border: '2px solid red'} : {}]"
                @click="snimi(igrac)"
                v-close-popup
                >
                  <img :src="igrac.img"  style="width: 110px; height: 146px; object-fit: contain;" />
                  <p class='backgroundChange' style="margin: 0px; margin-top: -6px; padding: 3px; background-color:#7c92cc; color: white;">{{igrac.prezime }}<br/>{{  igrac.ime}}</p>
                  <p class='backgroundChange' style="margin: 0px; padding: 3px; background-color:#323b62; color: white;">{{igrac.primarnaPozicija}}</p>
                </span>
              </q-tab-panel>
            </q-tab-panels>
          </q-card>

          <q-card
            v-else
            style="
              width: 600px;
              max-width: 60vw;
              border-radius: 5px;
              box-shadow: 0px 15px 25px 0px rgba(50, 50, 50, 0.7);
              color: #323b62;
            "
          >
            <q-card-section>
              <q-btn
                icon="close"
                flat
                round
                dense
                style="float: right;"
                v-close-popup
              ></q-btn>
              <div class="text-h6 col-12" style="text-align: center;">
                {{$t('promenaIgraca.izaberiTimIIgraca')}}

              </div>
            </q-card-section>

            <!-- <q-separator inset></q-separator> -->

            <q-card-section>
              <q-item>
                <q-item-section>
                      <q-select
                        borderless
                          style="background: #f5f8fb; color: #323b62; height: 45px; border-radius: 5px; margin-top: 10px; padding-left: 10px;"
                          :label="$t('promenaIgraca.tim')"
                          option-value="value"
                          option-label="label"
                          :options="listaTimova"
                          map-options
                          v-model="selektovaniTim"
                          v-on:input="promenaTima"
                      />
                  </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                      <q-select
                        borderless
                          style="background: #f5f8fb; color: #323b62; height: 45px; border-radius: 5px; margin-top: 10px; padding-left: 10px;"
                          :label="$t('promenaIgraca.igraci')"
                          option-value="value"
                          option-label="label"
                          :options="listaIgraca"
                          map-options
                          v-model="selektovaniIgrac"
                      />
                  </q-item-section>
              </q-item>
            </q-card-section>
            <q-card-actions align="center" class="bg-white text-teal">
              <q-btn
                :label="$t('administration.user.cancel')"
                @click="close"
                type="submit"
                style="background-color: #f5f8fb; color: #323b62; width: 20%; margin: 10px;"
                v-close-popup
              ></q-btn>
              <q-btn
                :label="$t('administration.user.save')"
                @click="snimi"
                type="submit"
                style="background-color: #ff4b00; color: white; width: 20%; margin: 10px;"
                v-close-popup
              ></q-btn>
            </q-card-actions>
          </q-card>
        <!-- </div>
      </div> -->


</template>

<script>
    export default {
      //props: ["window.$timID", "window.$igracName", "window.$igracID"],
      props: ["selektovaniTim1", "putanja"],
        data() {
            return {
                selektovaniTim:null,
                selektovaniIgrac: null,
                listaTimova:[],
                listaIgraca:[],
                left: false,
                igrac: "",
                tab: 'timovi'
            }
        },
        mounted() {
          console.log("this.selektovaniTim1")
          console.log(this.selektovaniTim1)
          console.log("this.selektovaniTim1")
          if(this.selektovaniTim1 != '' && this.selektovaniTim1 != undefined && this.putanja != 'treninzi' && this.putanja != 'utakmice'&& this.putanja != 'trenazneVezbe' ){
            this.tab = 'igraci'
            this.selektovaniTim = this.selektovaniTim1
            this.promenaTima()
          }

          if(this.selektovaniIgrac1 != undefined){
            this.selektovaniIgrac = this.listaIgraca.filter(e => { e.value == this.selektovaniIgrac1})[0]
          }

          this.getDataSelekcije(); //idemo da uzmenmo podatke iz baze
          this.$q.loading.show()
        },
        methods: {
           getDataSelekcije() {
              let linkStr = this.$apiPutanja +  '/selekcije/active/1'
              //debugger;
                this.$axios
                  .get(linkStr,{
                        headers: {
                          "Content-Type": "application/json",
                          "Authorization": "Bearer  " + window.$token
                        }
                      })
                  .then(response => {
                    debugger
                    this.listaTimova = response.data.map(this.dajTimove);
                    this.$q.loading.hide()
                    //this.selektovaniTim.value = window.$timID


                  })
                  .catch(e => {
                    //this.errors.push(e);
                    this.$q.loading.hide()
                    console.log("Greska: " + e);
                  });
            },
            //''''''''''''''''''''''''''''''''''''''''
            // citanje podataka o igracima
            //........................................
            getDataIgraci() {
              let linkStr = this.$apiPutanja +  '/igraci'
              debugger;
                this.$axios
                  .get(linkStr,{
                        headers: {
                          "Content-Type": "application/json",
                          "Authorization": "Bearer  " + window.$token
                        }
                      })
                  .then(response => {
                    this.listaIgraca = response.data.map(this.dajIgrace);

                  })
                  .catch(e => {
                    //this.errors.push(e);
                    console.log("Greska: " + e);
                  });
            },
            dajTimove(item) {
              debugger
              return { label: item.imeTima, value: item.ident, mesto: item.mesto, uzrast: item.uzrastTima };
            },
            dajIgrace(item) {
              return { label: item.ime + ' ' + item.prezime, img:item.fotografija, value: item.id, nadimak: item.nadimak, ime: item.ime, prezime: item.prezime };
            },
            promenaTima(tim) {
              if(tim != undefined){
                this.selektovaniTim = tim;
                if(this.putanja != 'treninzi' && this.putanja != 'utakmice'&& this.putanja != 'trenazneVezbe')
                  this.tab = 'igraci'
                else{
                  window.$timID = this.selektovaniTim.value
                  this.$emit('update-snimi-tim',this.selektovaniTim);
                }
              }
              window.$timID = this.selektovaniTim.value;
              this.listaIgraca=[];
              this.selektovaniIgrac = ""
              this.$q.loading.show()
              this.getDataEkipa(this.selektovaniTim.value)
              console.log(window.$timID)
            },
            //''''''''''''''''''''''''''''''''''''''''
            // citanje podataka o ekipi
            //........................................
            getDataEkipa(brlj) {
              let self=this;
              let linkStr = this.$apiPutanja +  '/selekcije/full-info/' + brlj
              //debugger;
                this.$axios
                  .get(linkStr,{
                        headers: {
                          "Content-Type": "application/json",
                          "Authorization": "Bearer  " + window.$token
                        }
                      })
                  .then(response => {
                    self.listaIgraca = response.data.igraci.map(this.dajIgrace);
                    this.$q.loading.hide()
                    console.log(self.listaIgraca)
                    debugger
                  })
                  .catch(e => {
                    //this.errors.push(e);
                    console.log("Greska: " + e);
                    this.$q.loading.hide()
                  });
            },
            snimi(igrac) {
              if(igrac != undefined){
                this.selektovaniIgrac = igrac
              }
              debugger
              window.$igracName = this.selektovaniIgrac.label
              window.$igracID = this.selektovaniIgrac.value
              window.$timID = this.selektovaniTim.value
              this.$emit('update-snimi', this.selektovaniIgrac.label,this.selektovaniIgrac.value,this.selektovaniTim);
              // vm.$forceUpdate();
              //this.close()
            },
            close() {
              this.dialog_za_promenu_igraca = false
            }
        },
        watch: {
        $igracName: function (val) {
          this.igrac = val // window.$igracName; // = val + ' ' + this.lastName
        },

      }
    }
</script>

<style lang="sass" scoped>

  .clickMouse:hover
    cursor: pointer
    background-color: #e5edf4 !important
    .backgroundChange
      background-color: #455288 !important

  .q-field__label
    font-size: 14px
    color: #aaaaaa

  .q-field--float
    background: white !important
    border: 1px solid #3b5d99 !important

  .q-field--float .q-field__label
    transform: translateY(-100%) scale(0.75)
    left: -5px
    background: white
    width: fit-content
    padding: 0 5px
    color: black
    font-size: 16px
  .q-field--auto-height.q-field--labeled .q-field__control-container
    padding-top: 12px;

</style>

