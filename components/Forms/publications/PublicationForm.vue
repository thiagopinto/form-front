<template>
  <div>
    <b-button
      block
      v-b-modal="`modal-xl-${id}`"
      :variant="`${variant}`"
      :size="`${size}`"
    >
      <font-awesome-icon :icon="textButton" size="1x" />
    </b-button>
    <ValidationObserver v-slot="{ invalid }">
      <b-modal
        :id="`modal-xl-${id}`"
        size="xl"
        scrollable
        :title="publication.title"
        @ok="handleOk"
      >
        <b-overlay :show="show" rounded="sm">
          <form ref="form" @submit.stop.prevent="handleSubmit">
            <div class="row">
              <div class="col-9">
                <div class="row">
                  <div class="col-9">
                    <validation-provider
                      name="Grupo"
                      :rules="{ required: true }"
                      v-slot="validationContext"
                    >
                      <b-form-group
                        label="Grupo"
                        label-for="group-select"
                        id="group-select-group"
                      >
                        <b-form-select
                          id="group-select"
                          name="group-select"
                          v-model="publication.group"
                          :options="groupOptions"
                          :state="getValidationState(validationContext)"
                          aria-describedby="group-live-feedback"
                        ></b-form-select>
                        <b-form-invalid-feedback id="group-live-feedback">{{
                          validationContext.errors[0]
                        }}</b-form-invalid-feedback>
                      </b-form-group>
                    </validation-provider>
                  </div>
                  <div class="col-3">
                    <b-form-checkbox
                      @change="publicHandler"
                      v-model="publication.is_public"
                      name="check-button"
                      switch
                      class="custom-checkbox-green"
                    >
                      Deseja publicar?
                    </b-form-checkbox>
                    <b-form-checkbox
                      @change="showDocumentsHandler"
                      v-model="publication.show_in_documents"
                      name="check-button"
                      switch
                      class="custom-checkbox-green"
                    >
                      Mostar na listagem de documentos?
                    </b-form-checkbox>
                  </div>
                </div>
                <div class="row align-items-center">
                  <div class="col-7 p-1 ml-2">
                    <validation-provider
                      name="Categoria"
                      :rules="{ required: true }"
                      v-slot="validationContext"
                    >
                      <b-form-group
                        label="Categoria"
                        label-for="publication-category-select"
                        id="publication-category-select"
                      >
                        <b-form-select
                          id="publication-category-select"
                          name="publication-category-select"
                          v-model="publication.category"
                          :options="categoryOptions"
                          :state="getValidationState(validationContext)"
                          @change="changeCategory"
                          aria-describedby="category-live-feedback"
                        ></b-form-select>
                        <b-form-invalid-feedback id="category-live-feedback">{{
                          validationContext.errors[0]
                        }}</b-form-invalid-feedback>
                      </b-form-group>
                    </validation-provider>
                  </div>
                  <div class="col-1 mt-3 p-1">
                    <CategoryCreateForm
                      @createCategory="getCategories()"
                      class="align-bottom"
                    >
                    </CategoryCreateForm>
                  </div>
                  <div class="col-1 p-1" v-show="showVolumeNumber">
                    <b-form-group label="Volume" label-for="publication-volume">
                      <b-form-input
                        id="publication-volume"
                        name="publication-volume"
                        v-model="publication.volume"
                      ></b-form-input>
                    </b-form-group>
                  </div>
                  <div class="col-1 p-1" v-show="showVolumeNumber">
                    <b-form-group label="Número" label-for="publication-number">
                      <b-form-input
                        id="publication-number"
                        name="publication-number"
                        v-model="publication.number"
                      ></b-form-input>
                    </b-form-group>
                  </div>
                  <div class="col-1 p-1" v-show="showVolumeNumber">
                    <b-form-group label="Ano" label-for="publication-year">
                      <b-form-input
                        id="publication-year"
                        name="publication-year"
                        v-model="publication.year"
                      ></b-form-input>
                    </b-form-group>
                  </div>
                </div>
                <div class="row">
                  <div class="col-12">
                    <validation-provider
                      name="Título"
                      :rules="{ required: true, min: 3 }"
                      v-slot="validationContext"
                    >
                      <b-form-group
                        label="Título"
                        label-for="title-input"
                        id="title-input-text"
                      >
                        <b-form-input
                          id="title-input"
                          name="title-input"
                          type="text"
                          label="Título"
                          :state="getValidationState(validationContext)"
                          placeholder="Título"
                          v-model="publication.title"
                          aria-describedby="title-live-feedback"
                        >
                        </b-form-input>
                        <b-form-invalid-feedback id="title-live-feedback">{{
                          validationContext.errors[0]
                        }}</b-form-invalid-feedback>
                      </b-form-group>
                    </validation-provider>
                  </div>
                </div>
                <div class="row">
                  <div class="col-12">
                      <b-form-group
                        label="Aquivo PDF"
                        label-for="file_path-input"
                        id="file_path-input-text"
                      >
                        <b-form-file
                          v-if="!publication.id"
                          accept=".pdf"
                          id="file_path-input"
                          name="file_path-input"
                          type="text"
                          label="Arquivo PDF"
                          placeholder="Arquivo PDF"
                          v-model="publication.file_path"
                          aria-describedby="file_path-live-feedback"
                        >
                        </b-form-file>
                        <b-form-file
                          v-if="publication.id"
                          accept=".pdf"
                          id="publication-file_path"
                          name="publication-file_path"
                          type="text"
                          label="Arquivo PDF"
                          placeholder="Arquivo PDF"
                          v-model="publication.file_path"
                        >
                        </b-form-file>
                      </b-form-group>
                  </div>
                </div>
              </div>
              <div class="col-3">
                <div class="row justify-content-center align-items-center">
                  <div class="col-12 align-self-center">
                    <div class="row justify-content-center align-items-center">
                      <croppa
                        v-model="image"
                        :width="256"
                        :height="362"
                        :placeholder-font-size="18"
                        placeholder="Escolher sua imagem"
                      >
                        <img
                          v-if="publication.image_path"
                          crossOrigin="anonymous"
                          :src="publication.image_path"
                          slot="initial"
                        />
                      </croppa>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-12">
                <b-form-group
                  label="Descrição"
                  label-for="publication-description"
                >
                  <client-only placeholder="Loading...">
                    <vue-editor
                      v-model="publication.description"
                      :editorToolbar="customToolbar"
                    ></vue-editor>
                  </client-only>
                </b-form-group>
              </div>
            </div>
            <div class="clearfix"></div>
          </form>
        </b-overlay>
        <template v-slot:modal-footer="{ ok, cancel }">
          <button
            class="btn btn-success btn-sm"
            @click="ok()"
            :disabled="invalid"
          >
            Salvar
          </button>
          <b-button size="sm" variant="danger" @click="cancel()">
            Cancelar
          </b-button>
        </template>
      </b-modal>
    </ValidationObserver>
  </div>
</template>
<script>
import NotificationTemplate from '~/components/Notifications/NotificationTemplate';
import CategoryCreateForm from './CategoryCreateForm';
export default {
  components: {
    CategoryCreateForm
  },
  props: ['textButton', 'oldPublication', 'id', 'size', 'variant'],
  computed: {
    loggedIn() {
      return this.$store.state.auth.loggedIn;
    },
    authUser() {
      if (this.loggedIn) {
        return this.$store.state.auth.user;
      } else {
        return {};
      }
    }
  },
  data() {
    return {
      showVolumeNumber: false,
      titleState: null,
      customToolbar: [
        [{ header: [false, 1, 2, 3, 4, 5, 6] }],
        ['bold', 'italic', 'underline', 'strike'], // toggled buttons
        [{ align: '' }, { align: 'center' }, { align: 'right' }],
        ['blockquote', 'code-block'],
        [{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],
        [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
        ['clean', 'link'] // remove formatting button
      ],
      pathImages: this.$store.state.paths.pathImages,
      logoVertical: require('@/assets/img/logo-vertical.png'),
      show: false,
      groupOptions: [],
      categoryOptions: [],
      image: null,
      publication: {
        id: null,
        title: null,
        image_path: require('@/assets/img/logo-vertical.png'),
        file_path: null,
        description: null,
        category: null,
        volume: null,
        number: null,
        year: null,
        show_in_documents: true,
        is_public: false,
        group: null
      },
      url: 'website/documents/',
      urlCategories: 'website/documents/categories/'
    };
  },
  created() {
    if (this.loggedIn) {
      this.group = this.authUser.groups[0].id;
    }
    if (this.oldPublication !== 'null') {
      this.publication = Object.assign({}, this.oldPublication);
      this.publication.file_path = null;
      if (this.publication.image_path === null) {
        this.publication.image_path = require('@/assets/img/logo-vertical.png');
      }
    }
  },
  async mounted() {
    this.authUser.groups.forEach((group) => {
      this.groupOptions.push({ value: group.id, text: group.name });
    });
    await this.getCategories();
    this.changeCategory(this.publication.category);
  },
  methods: {
    getValidationState({ dirty, validated, valid = null }) {
      return dirty || validated ? valid : null;
    },
    changeCategory(value) {
      this.showVolumeNumber = false;
      this.categoryOptions.forEach((category) => {
        if (category.value === value) {
          if (category.text === 'Boletins Epidemiológicos') {
            this.showVolumeNumber = true;
          }
        }
      });
    },
    async getCategories() {
      try {
        const response = await this.$axios.get(
          `${this.urlCategories}?limit=100`
        );
        response.data.results.forEach((category) => {
          this.categoryOptions.push({
            value: category.id,
            text: category.name
          });
        });
      } catch (error) {
        error.toString();
        this.notifyVue(
          'top',
          'center',
          error.response.data.non_field_errors[0],
          'danger'
        );
      }
    },
    notifyVue(verticalAlign, horizontalAlign, message, type) {
      this.$notify({
        component: NotificationTemplate,
        icon: 'fas fa-exclamation-circle',
        horizontalAlign: horizontalAlign,
        verticalAlign: verticalAlign,
        message: message,
        type: type
      });
    },
    async createPublication() {
      this.image.generateBlob(async(blob) => {
        try {
          const data = new FormData();
          data.append('title', this.publication.title);
          data.append('image_path', blob, 'filename.jpg');
          data.append('file_path', this.publication.file_path);
          data.append('description', this.publication.description);
          data.append('category', this.publication.category);
          if (this.publication.volume !== null) {
            data.append('volume', this.publication.volume);
            data.append('number', this.publication.number);
            data.append('year', this.publication.year);
          }
          data.append('show_in_documents', this.publication.show_in_documents);
          data.append('group', this.publication.group);
          data.append('user', this.authUser.id);
          const response = await this.$axios.post(`${this.url}`, data, {
            headers: {
              'Content-Type': `multipart/form-data; boundary=${data._boundary}`
            },
            timeout: 30000
          });
          response.data.file_path = null;
          this.publication = response.data;
          this.notifyVue('top', 'center', 'Cadastro efetuado', 'success');
          this.$emit('createPublication', await response.data);
          this.show = false;
          this.$nextTick(() => {
            this.$bvModal.hide(`modal-xl-${this.id}`);
          });
          return await response.data;
        } catch (error) {
          this.notifyVue('top', 'center', error.response.data.detail, 'danger');
          this.show = false;
          return await error.response.data.detail;
        }
      }, 'image/jpeg');
    },
    async updatePublication() {
      this.image.generateBlob(async(blob) => {
        try {
          const data = new FormData();
          data.append('title', this.publication.title);
          data.append('image_path', blob, 'filename.jpg');
          if (this.publication.file_path !== null) {
            data.append('file_path', this.publication.file_path);
          }
          if (this.publication.volume !== null) {
            data.append('volume', this.publication.volume);
            data.append('number', this.publication.number);
            data.append('year', this.publication.year);
          }
          data.append('description', this.publication.description);
          data.append('category', this.publication.category);
          data.append('group', this.publication.group);
          data.append('user', this.authUser.id);
          const response = await this.$axios.patch(
            `${this.url}${this.publication.id}/`,
            data,
            {
              headers: {
                'Content-Type': `multipart/form-data; boundary=${data._boundary}`
              },
              timeout: 30000
            }
          );
          response.data.file_path = null;
          this.publication = response.data;
          this.notifyVue('top', 'center', 'Cadastro atualizado', 'success');
          this.$emit('updatePublication', await response.data);
          this.show = false;
          this.$nextTick(() => {
            this.$bvModal.hide(`modal-xl-${this.id}`);
          });
          return await response.data;
        } catch (error) {
          this.notifyVue('top', 'center', error.response.data.detail, 'danger');
          this.show = false;
          return await error.response.data.detail;
        }
      }, 'image/jpeg');
    },
    handleOk(bvModalEvt) {
      this.show = true;
      bvModalEvt.preventDefault();
      this.handleSubmit();
    },
    async handleSubmit() {
      if (this.publication.id) {
        this.updatePublication();
      } else {
        this.createPublication();
      }
    },
    async setPublic() {
      this.show = true;
      try {
        const response = await this.$axios.patch(
          `${this.url}${this.id}/`,
          {
            is_public: this.is_public,
            show_in_documents: this.show_in_documents
          }
        );
        this.notifyVue('top', 'center', 'Cadastro atualizado', 'success');

        this.$emit('updatePublication', await response.data);

        console.log(response);
      } catch (error) {
        console.log(error);
      }
      this.show = false;
    },
    publicHandler() {
      this.is_public = !this.is_public;
      this.setPublic();
    },
    showDocumentsHandler() {
      this.show_in_documents = !this.show_in_documents;
      this.setPublic();
    }
  }
};
</script>
