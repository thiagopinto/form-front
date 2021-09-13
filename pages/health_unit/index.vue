<template>
  <div>
    <div class="container-fluid">
      <div class="row">
        <div class="col-sm-12 col-md-6">
          <b-pagination
            v-model="currentPage"
            :total-rows="totalRows"
            :per-page="perPage"
            @input="getHealthUnit"
            class="pagination-danger"
          ></b-pagination>
        </div>
        <div class="col-sm-12 col-md-2">
          <b-form-select
            v-model="perPage"
            :options="perPageOptions"
            @change="getHealthUnit"
          ></b-form-select>
        </div>
        <div class="col-sm-12 col-md-4">
          <div class="input-group">
            <input
              type="text"
              v-model="search"
              @input="searchHandler"
              class="form-control"
            />
            <div class="input-group-append">
              <span class="input-group-text">
                <i class="fas fa-search"></i>
              </span>
            </div>
          </div>
        </div>
      </div>
      <div class="row justify-content-lg-end">
        <div class="col-3">
          <b-button block variant="info" @click="selectAll">
            Selecionar todos
          </b-button>
        </div>
        <div class="col-1">
          <b-button variant="info" @click="getGeoCode">
            <font-awesome-icon
              v-show="!isLoad"
              :icon="['fas', 'globe-americas']"
              size="1x"
            />
            <b-spinner v-show="isLoad" small type="grow"></b-spinner>
          </b-button>
        </div>
      </div>
      <div class="row justify-content-between">
        <div class="col-12">
          <b-card class="text-center">
            <b-table
              id="table-healt-unit"
              striped
              hover
              :fields="fields"
              :items="listHealthUnit"
              :busy="isBusy"
              primary-key="id"
              :tbody-transition-props="transProps"
            >
              <template v-slot:cell(id)="data">
                {{ data.item.id }}
              </template>
              <template v-slot:cell(cnes)="data">
                {{ data.item.cnes }}
              </template>
              <template v-slot:cell(alias_company_name)="data">
                {{ data.item.alias_company_name }}
              </template>
              <template v-slot:cell(stock_form_death)="data">
                <b-form-input
                  @change="setStock(data.item)"
                  v-model="data.item.stock_form_death"
                ></b-form-input>
              </template>
              <template v-slot:cell(stock_form_alive)="data">
                <b-form-input
                  @change="setStock(data.item)"
                  v-model="data.item.stock_form_alive"
                ></b-form-input>
              </template>

              <template v-slot:cell(latitude)="data">
                {{ data.item.latitude }}
              </template>
              <template v-slot:cell(longitude)="data">
                {{ data.item.longitude }}
              </template>
              <template v-slot:cell(geocode)="data">
                <b-form-checkbox
                  :id="`health-unit-${data.item.id}`"
                  v-model="selectedHealthUnit"
                  :name="`health-unit-${data.item.id}`"
                  :value="data.item.id"
                >
                </b-form-checkbox>
              </template>
            </b-table>
          </b-card>
        </div>
      </div>
      <div class="row">
        <div class="col-12">
          <client-only placeholder="Loading...">
            <vl-map
              :load-tiles-while-animating="true"
              :load-tiles-while-interacting="true"
              data-projection="EPSG:4326"
              style="height: 500px"
            >
              <vl-view
                :zoom.sync="zoom"
                :center.sync="center"
                :rotation.sync="rotation"
              ></vl-view>
              <vl-layer-vector :z-index="1" id="layer-marker">
                <vl-source-vector
                  :features="healthUnitFeatures"
                  ident="vectorMarker"
                  id="vector-marker"
                >
                  <template v-for="healthUnit in listHealthUnit">
                    <vl-feature
                      :id="`marker-${healthUnit.id}`"
                      :ref="`marker-${healthUnit.id}`"
                      :key="healthUnit.id"
                      v-if="healthUnit.latitude && healthUnit.longitude"
                    >
                      <vl-geom-point
                        :coordinates="[
                          parseFloat(healthUnit.longitude),
                          parseFloat(healthUnit.latitude)
                        ]"
                      ></vl-geom-point>
                      <vl-style-box>
                        <vl-style-icon
                          :src="marker"
                          :scale="0.4"
                          :anchor="[0.5, 1]"
                        ></vl-style-icon>
                      </vl-style-box>
                      <vl-overlay
                        :position="[
                          parseFloat(healthUnit.longitude),
                          parseFloat(healthUnit.latitude)
                        ]"
                        :offset="[20, -50]"
                      >
                        <p class="is-light box content">
                          <strong>{{ healthUnit.alias_company_name }}</strong>
                        </p>
                      </vl-overlay>
                    </vl-feature>
                  </template>
                </vl-source-vector>
              </vl-layer-vector>
              <!--
              <vl-interaction-modify source="vectorMarker">
                <vl-style-box>
                  <vl-style-circle :radius="5">
                    <vl-style-stroke color="green"></vl-style-stroke>
                    <vl-style-fill color="green"></vl-style-fill>
                  </vl-style-circle>
                </vl-style-box>
              </vl-interaction-modify>
              -->
              <vl-layer-tile id="osm">
                <vl-source-osm></vl-source-osm>
              </vl-layer-tile>
            </vl-map>
            <div style="padding: 20px">
              Zoom: {{ zoom }}<br />
              Center: {{ center }}<br />
              Rotation: {{ rotation }}<br />
              healthUnitFeature: {{ healthUnitFeatures }}
            </div>
          </client-only>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import NotificationTemplate from '~/components/Notifications/NotificationTemplate';

export default {
  components: {},
  data() {
    return {
      marker: require('@/assets/img/marker_health_unit.png'),
      isBusy: false,
      isLoad: false,
      features: [],
      fields: [
        { key: 'id', label: 'Id', sortable: true },
        { key: 'cnes_code', label: 'CNES', sortable: true },
        { key: 'alias_company_name', label: 'Nome', sortable: true },
        { key: 'stock_form_death', label: 'Estoque DO' },
        { key: 'stock_form_alive', label: 'Estoque DN' },
        { key: 'latitude', label: 'Latitude', sortable: true },
        { key: 'longitude', label: 'Longitude', sortable: true },
        { key: 'geocode', label: 'GeoCode' }
      ],
      transProps: {
        // Transition name
        name: 'flip-list'
      },
      selectedHealthUnit: [],
      listHealthUnit: [],
      perPage: 10,
      currentPage: 1,
      totalRows: 0,
      search: '',
      pathImages: this.$store.state.paths.pathImages,
      perPageOptions: [5, 10, 50, 100],
      zoom: 11,
      center: [-42.76052227179484, -5.095632087716865],
      rotation: 0,
      geolocPosition: undefined,
      healthUnitFeatures: []
    };
  },
  async fetch() {
    this.isBusy = !this.isBusy;
    const response = await this.$axios.get(
      `health_unit/${this.genPage()}${this.genSearch()}`
    );
    this.listHealthUnit = await response.data.data;
    this.totalRows = await response.data.total;
    this.isBusy = !this.isBusy;
  },
  computed: {
    loggedIn() {
      return this.$store.state.auth.loggedIn;
    },
    isSuperuser() {
      if (this.$store.state.auth.user.is_superuser) {
        return true;
      } else {
        return false;
      }
    }
  },
  created: function() {
    this.welcomeMessage();
  },
  mounted() {
    if (!this.loggedIn) {
      this.$router.push('/auth/login');
    }
    // this.getHealthUnit();
  },
  methods: {
    welcomeMessage() {
      this.$store.commit('layout/CHANGE_NAV_TITLE', 'Usuários');
    },
    notifyVue(verticalAlign, horizontalAlign, message, type) {
      this.$notify({
        component: NotificationTemplate,
        icon: 'fas fa-exclamation-circle',
        horizontalAlign: horizontalAlign,
        verticalAlign: verticalAlign,
        message: message,
        timeout: 10000,
        type: type
      });
    },
    selectAll() {
      this.listHealthUnit.forEach(healthUnit => {
        this.selectedHealthUnit.push(healthUnit.id);
      });
    },
    async getGeoCode() {
      try {
        this.isLoad = true;
        await this.$axios.patch(`health_unit/?action=geo_reference`, {
          ids: this.selectedHealthUnit
        });
        await this.notifyVue('top', 'center', 'Atualizado', 'success');
        this.isLoad = false;
        this.getHealthUnit();
      } catch (error) {
        this.isLoad = false;
        console.log(error);
        return await error.response;
      }
    },
    async setStock(item) {
      try {
        await this.$axios.patch(`health_unit/?action=set_stock`, item);
        await this.notifyVue('top', 'center', 'Atualizado', 'success');
      } catch (error) {
        this.isLoad = false;
        console.log(error);
        return await error.response;
      }
    },
    async getHealthUnit() {
      this.isBusy = !this.isBusy;
      const response = await this.$axios.get(
        `health_unit/${this.genPage()}${this.genSearch()}`
      );
      this.listHealthUnit = await response.data.data;
      this.totalRows = await response.data.total;
      this.isBusy = !this.isBusy;
    },
    genPage() {
      return `?per_page=${this.perPage}&page=${this.currentPage}`;
    },
    genSearch() {
      if (this.search.length > 3) {
        return `&search=${this.search}`;
      } else {
        return '';
      }
    },
    searchHandler() {
      this.getHealthUnit();
    }
  }
};
</script>
<style>
table#table-users .flip-list-move {
  transition: transform 1s;
}
#layer-marker {
  z-index: 1;
}
</style>
