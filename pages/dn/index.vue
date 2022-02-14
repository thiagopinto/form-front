<template>
  <div>
    <div class="container-fluid">
      <div class="row">
        <div class="col-sm-12 col-md-2">
          <b-form-group description="Data início da pesquisa">
            <b-form-input
              placeholder="Inicio"
              name="search-date-start"
              v-model="searchDate.start"
              type="date"
            ></b-form-input>
          </b-form-group>
        </div>
        <div class="col-sm-12 col-md-2">
          <b-form-group
            description="Data fim da pesquisa"
            :state="stateDate"
          >
            <b-form-input
              placeholder="Fim"
              name="search-date-end"
              v-model="searchDate.end"
              type="date"
              :state="stateDate"
            ></b-form-input>
          </b-form-group>
        </div>
        <div class="col-sm-12 col-md-2 p-0">
          <b-button class="mt-0" variant="success" @click="getForms"
            >Filtrar por data</b-button
          >
        </div>
        <div class="col-sm-12 col-md-4">
          <b-form-group description="Termo para pesquisa">
            <b-input-group>
              <b-form-input
                placeholder="Buscar..."
                v-model="search"
                @input="searchHandler"
                type="search"
              ></b-form-input>
              <b-input-group-append>
                <b-input-group-text>
                  <font-awesome-icon :icon="['fas', 'search']" />
                </b-input-group-text>
              </b-input-group-append>
            </b-input-group>
          </b-form-group>
        </div>
      </div>
      <div class="row">
        <div class="col-8">
          <b-button variant="info" class="mb-2 mt-2 pt-2 pb-2">
            <font-awesome-icon :icon="['far', 'eye']" />
          </b-button>
          <b-button variant="warning" class="mb-1 mt-1 pt-1 pb-1">
            <b-form-checkbox
              :value="1"
              v-model="status"
              class="mb-0 mt-0 pt-0 pb-0"
              >Estoque</b-form-checkbox
            >
          </b-button>
          <b-button variant="danger" class="mb-1 mt-1 pt-1 pb-1">
            <b-form-checkbox
              :value="2"
              v-model="status"
              class="mb-0 mt-0 pt-0 pb-0"
              >Distribuidos</b-form-checkbox
            >
          </b-button>
          <b-button variant="success" class="mb-1 mt-1 pt-1 pb-1">
            <b-form-checkbox
              :value="3"
              v-model="status"
              class="mb-0 mt-0 pt-0 pb-0"
              >Recebidos</b-form-checkbox
            >
          </b-button>
          <b-button variant="outline-primary" class="mb-1 mt-1 pt-1 pb-1">
            <b-form-checkbox
              :value="4"
              v-model="status"
              class="mb-0 mt-0 pt-0 pb-0"
              >Nulos</b-form-checkbox
            >
          </b-button>
          <b-button variant="info" class="mb-1 mt-1 pt-2 pb-2">
            Estoque de fichas: {{ stock }}
          </b-button>
        </div>
        <div class="col-3">
          <add-form
            :item="null"
            :url="url"
            iconButton="plus"
            type="input"
            title="Receber Fichas"
            @addForm="getForms"
            variant="warning"
          ></add-form>
          <send-form
            :item="null"
            :url="url"
            iconButton="paper-plane"
            type="send"
            title="Enviar Fichas"
            @addForm="getForms"
            variant="danger"
          ></send-form>
          <b-button variant="info" to="/dn/report">
            <font-awesome-icon :icon="['far', 'chart-bar']" />
          </b-button>
        </div>
      </div>
      <div class="row justify-content-between">
        <div class="col-12">
          <b-card class="text-center">
            <b-table
              id="table-born-alive-form"
              striped
              hover
              :fields="fields"
              :items="listForm"
              :busy="isBusy"
              primary-key="id"
              :tbody-transition-props="transProps"
            >
              <template v-slot:cell(id)="data">
                {{ data.item.id }}
              </template>
              <template v-slot:cell(number)="data">
                {{ data.item.number }}
              </template>
              <template v-slot:cell(cnes_code)="data">
                {{ data.item.cnes_code }}
              </template>
              <template v-slot:cell(email)="data">
                {{ data.item.alias_company_name }}
              </template>
              <template v-slot:cell(name)="data">
                {{ data.item.name }}
              </template>
              <template v-slot:cell(event_date)="data">
                {{ data.item.event_date }}
              </template>
              <template v-slot:cell(action)="data">
                <div v-if="data.item.status == 2">
                  <b-button
                    class="m-0"
                    size="sm"
                    variant="light"
                    @click="cancel(data.item)"
                    v-b-tooltip.hover
                    title="Anular"
                  >
                    <font-awesome-icon :icon="['far', 'times-circle']" />
                  </b-button>
                  <receivement-form
                    :item="data.item"
                    :url="url"
                    eventName="nascimento"
                    type="input"
                    title="Preenchimento de ficha"
                    @addForm="getForms"
                    variant="success"
                  >
                    <font-awesome-icon
                      v-b-tooltip.hover
                      title="Receber"
                      :icon="['fas', 'edit']"
                    />
                  </receivement-form>

                  <b-button
                    class="m-0"
                    size="sm"
                    variant="danger"
                    @click="receipt(data.item)"
                    v-b-tooltip.hover
                    title="Imprimir Recibo"
                  >
                    <font-awesome-icon :icon="['fas', 'print']" />
                  </b-button>
                  <b-button
                    class="m-0"
                    size="sm"
                    variant="danger"
                    @click="reversal(data.item)"
                    v-b-tooltip.hover
                    title="Estorno"
                  >
                    <font-awesome-icon :icon="['fas', 'print']" />
                  </b-button>
                </div>
                <div class="row m-0 p-0" v-if="data.item.status == 4">
                  <div class="col-12 m-0 p-0">
                    <b-button
                      class="m-0"
                      size="sm"
                      variant="light"
                      @click="active(data.item)"
                    >
                      Reativar
                    </b-button>
                  </div>
                </div>
                <div class="row m-0 p-0" v-if="data.item.status == 3">
                  <div class="col-12 m-0 p-0">
                    <b-button
                      class="m-0"
                      size="sm"
                      variant="light"
                      @click="active(data.item)"
                    >
                      Limpar
                    </b-button>
                  </div>
                </div>
              </template>
            </b-table>
          </b-card>
          <div class="row">
            <div class="col-sm-12 col-md-8">
              <b-pagination
                v-model="currentPage"
                :total-rows="totalRows"
                :per-page="perPage"
                limit="8"
                @input="getForms"
                class="pagination-danger"
              ></b-pagination>
            </div>
            <div class="col-sm-12 col-md-2">
              <b-form-select
                v-model="perPage"
                :options="perPageOptions"
                @change="getForms"
              ></b-form-select>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import NotificationTemplate from '~/components/Notifications/NotificationTemplate';
// import EditForm from '~/components/Forms/EditForm.vue';
import AddForm from '~/components/Forms/AddForm.vue';
import SendForm from '~/components/Forms/SendForm.vue';
import ReceivementForm from '~/components/Forms/ReceivementForm.vue';

export default {
  components: {
    // EditForm,
    AddForm,
    SendForm,
    ReceivementForm
  },
  data() {
    return {
      marker: require('@/assets/img/marker_health_unit.png'),
      isBusy: false,
      isLoad: false,
      features: [],
      fields: [
        { key: 'id', label: 'Id', sortable: true },
        { key: 'number', label: 'Número', sortable: true },
        { key: 'cnes_code', label: 'CNES', sortable: true },
        {
          key: 'alias_company_name',
          label: 'Unidade',
          sortable: true
        },
        { key: 'name', label: 'Nome', sortable: true },
        { key: 'event_date', label: 'Data', sortable: true },
        { key: 'action', label: 'Ações' }
      ],
      transProps: {
        // Transition name
        name: 'flip-list'
      },
      selectedHealthUnit: [],
      listForm: [],
      perPage: 10,
      currentPage: 1,
      totalRows: 0,
      search: '',
      pathImages: this.$store.state.paths.pathImages,
      perPageOptions: [5, 10, 50, 100],
      url: 'born_alive_form/',
      status: [1, 2, 3, 4],
      searchDate: {
        start: null,
        end: null
      },
      stock: 0
    };
  },
  async fetch() {
    this.isBusy = !this.isBusy;
    const response = await this.$axios.get(
      `born_alive_form/${this.genPage()}${this.genSearch()}${this.genStatus()}${this.genFilterDate()}`
    );
    this.stock = await this.getCount(1);
    this.listForm = await response.data.data;
    this.colorLines();
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
    },
    stateDate() {
      if (this.searchDate.end != null) {
        const start = new Date(this.searchDate.start);
        const end = new Date(this.searchDate.end);
        if (start > end) {
          return false;
        }
        return null;
      }
      return null;
    }
  },
  created: function() {
    this.welcomeMessage();
  },
  mounted() {
    if (!this.loggedIn) {
      this.$router.push('/auth/login');
    }
    // this.getForms();
  },
  methods: {
    welcomeMessage() {
      this.$store.commit(
        'layout/CHANGE_NAV_TITLE',
        'Lista de formulários de Declaração de Nascimento'
      );
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
      this.listForm.forEach(healthUnit => {
        this.selectedHealthUnit.push(healthUnit.id);
      });
    },
    async getCount(status) {
      const result = await this.$axios.get(`born_alive_form/count/${status}`);
      return result.data;
    },
    async getForms() {
      this.isBusy = !this.isBusy;
      const response = await this.$axios.get(
        `born_alive_form/${this.genPage()}${this.genSearch()}${this.genStatus()}${this.genFilterDate()}`
      );
      this.stock = await this.getCount(1);
      this.listForm = await response.data.data;
      this.colorLines();
      this.totalRows = await response.data.total;
      this.isBusy = !this.isBusy;
    },
    genPage() {
      return `?per_page=${this.perPage}&page=${this.currentPage}`;
    },
    genSearch() {
      if (this.search.length > 6) {
        return `&search=${this.search}`;
      } else {
        return '';
      }
    },
    genStatus() {
      return '&status=' + encodeURI(this.status);
    },
    genFilterDate() {
      if (this.searchDate.start != null && this.searchDate.end != null) {
        const start = new Date(this.searchDate.start);
        const end = new Date(this.searchDate.end);
        if (start > end) {
          return '';
        }
        return (
          '&start=' + this.searchDate.start + '&end=' + this.searchDate.end
        );
      } else {
        return '';
      }
    },
    searchHandler() {
      if (this.search.length > 6) {
        this.getForms();
      }
    },
    colorLines() {
      this.listForm.forEach(form => {
        if (form.status === 1) {
          form._rowVariant = 'warning';
        } else if (form.status === 2) {
          form._rowVariant = 'danger';
        } else if (form.status === 3) {
          form._rowVariant = 'success';
        } else if (form.status === 4) {
          form._rowVariant = 'light';
        }
      });
    },
    async cancel(item) {
      try {
        item.status = 4;
        item._rowVariant = 'light';
        await this.$axios.patch(`${this.url}${item.id}`, item);
        this.getForms();
      } catch (error) {
        const message =
          (error.response && error.response.data) ||
          error.message ||
          error.toString();
        console.log(message);
      }
    },
    async active(item) {
      try {
        item.status = 2;
        item._rowVariant = 'danger';
        await this.$axios.patch(`${this.url}${item.id}`, item);
        this.getForms();
      } catch (error) {
        const message =
          (error.response && error.response.data) ||
          error.message ||
          error.toString();
        console.log(message);
      }
    },
    async fill(item) {
      try {
        item.status = 3;
        item._rowVariant = 'success';
        await this.$axios.patch(`${this.url}${item.id}`, item);
        this.getForms();
      } catch (error) {
        const message =
          (error.response && error.response.data) ||
          error.message ||
          error.toString();
        console.log(message);
      }
    },
    async reversal(item) {
      try {
        item.status = 1;
        item._rowVariant = 'warning';
        await this.$axios.patch(`${this.url}reversal/${item.id}`);
        this.getForms();
      } catch (error) {
        const message =
          (error.response && error.response.data) ||
          error.message ||
          error.toString();
        console.log(message);
      }
    },
    async receipt(item) {
      try {
        const response = await this.$axios.get(
          `${this.url}receipt/${item.id}`,
          {
            responseType: 'blob'
          }
        );
        const blob = new Blob([response.data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        // const link = document.createElement('a');
        // link.href = window.URL.createObjectURL(blob);
        // link.download = 'Report.pdf';
        // link.click();
        window.open(url);
        // console.log(response);
      } catch (error) {
        const message =
          (error.response && error.response.data) ||
          error.message ||
          error.toString();
        console.log(message);
      }
    }
  },
  watch: {
    status: function() {
      this.getForms();
    }
  }
};
</script>
<style>
table#table-users .flip-list-move {
  transition: transform 1s;
}
</style>
