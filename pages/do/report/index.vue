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
              primary-key="cnes_code"
              :tbody-transition-props="transProps"
            >
              <template v-slot:cell(id)="data">
                {{ data.item.cnes_code }}
              </template>
              <template v-slot:cell(name)="data">
                {{ data.item.name }}
              </template>
              <template v-slot:cell(email)="data">
                {{ data.item.count }}
              </template>
              <template v-slot:cell(latitude)="data">
                {{ data.item.latitude }}
              </template>
              <template v-slot:cell(longitude)="data">
                {{ data.item.longitude }}
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
                      :id="`marker-${healthUnit.cnes_code}`"
                      :ref="`marker-${healthUnit.cnes_code}`"
                      :key="healthUnit.cnes_code"
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
                        :offset="[-38.5, -66]"
                      >
                        <circle-progress
                          :transitionDuration="5000"
                          :radius="30"
                          :strokeWidth="10"
                          :value="healthUnit.percent"
                          :strokeColor="healthUnit.color"
                        >
                          <div
                            class="content"
                            style="background-color: transparent; padding-top: 0px; margin-top: -5px;"
                          >
                            {{ healthUnit.count }}
                          </div>
                        </circle-progress>
                        <p class="is-light box content-map">
                          <strong>{{ healthUnit.name }}</strong>
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
  components: {

  },
  data() {
    return {
      marker: require('@/assets/img/marker.png'),
      isBusy: false,
      isLoad: false,
      features: [],
      fields: [
        { key: 'cnes_code', label: 'CNES', sortable: true },
        { key: 'name', label: 'Nome', sortable: true },
        { key: 'count', label: 'Estoque', sortable: true },
        { key: 'latitude', label: 'Latitude', sortable: true },
        { key: 'longitude', label: 'Longitude', sortable: true }
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
      zoom: 12.5,
      center: [-42.76189556281046, -5.075455784017862],
      rotation: 0,
      geolocPosition: undefined,
      healthUnitFeatures: []
    };
  },
  async fetch() {
    this.isBusy = !this.isBusy;
    const response = await this.$axios.get(
      `death_certificate_form/report/${this.genPage()}${this.genSearch()}`
    );
    await response.data.data.forEach(healthUnit => {
      healthUnit.percent =
        (healthUnit.stock_form_alive / 100) * healthUnit.count;

      if (healthUnit.percent >= 75) {
        healthUnit.color = '#87CB16';
      } else if (healthUnit.percent < 75 && healthUnit.percent > 25) {
        healthUnit.color = '#FFA534';
      } else {
        healthUnit.color = '#FB404B';
      }

      this.listHealthUnit.push(healthUnit);
    });
    // this.listHealthUnit = await response.data.data;
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
    async getHealthUnit() {
      this.isBusy = !this.isBusy;
      const response = await this.$axios.get(
        `death_certificate_form/report/${this.genPage()}${this.genSearch()}`
      );
      this.listHealthUnit = [];
      await response.data.data.forEach(healthUnit => {
        healthUnit.percent =
          (healthUnit.stock_form_alive / 100) * healthUnit.count;

        if (healthUnit.percent > 75) {
          healthUnit.color = '#87CB16';
        } else if (healthUnit.percent < 75 && healthUnit.percent > 50) {
          healthUnit.color = '#FFA534';
        } else if (healthUnit.percent < 50 && healthUnit.percent > 25) {
          healthUnit.color = '#f96332';
        } else {
          healthUnit.color = '#FB404B';
        }

        this.listHealthUnit.push(healthUnit);
      });
      // this.listHealthUnit = await response.data.data;
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
.content-map {
  background-color: rgba(244, 243, 239, 0.7);
  min-height: 100%;
  padding: 1px;
}
</style>
