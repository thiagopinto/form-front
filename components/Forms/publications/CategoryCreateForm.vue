<template>
  <div>
    <b-button
      class="p-2 m-0"
      block
      v-b-modal.modal-category
      variant="success"
      size="lg"
    >
      <font-awesome-icon :icon="['far', 'plus-square']" size="1x" />
    </b-button>

    <b-overlay :show="show" rounded="sm">
      <ValidationObserver v-slot="{ invalid }">
        <b-modal
          id="modal-category"
          size="sm"
          scrollable
          :title="category.title"
          @ok="handleOk"
        >
          <form ref="form" @submit.stop.prevent="handleSubmit">
            <div class="row">
              <div class="col-12">
                <validation-provider
                  name="Nome"
                  :rules="{ required: true, min: 3 }"
                  v-slot="validationContext"
                >
                  <b-form-group label="Nome" label-for="category-name">
                    <b-form-input
                      id="category-name"
                      name="category-name"
                      type="text"
                      label="Nome"
                      :state="getValidationState(validationContext)"
                      placeholder="Nome"
                      v-model="category.name"
                      aria-describedby="name-live-feedback"
                    >
                    </b-form-input>
                    <b-form-invalid-feedback id="name-live-feedback">{{
                      validationContext.errors[0]
                    }}</b-form-invalid-feedback>
                  </b-form-group>
                </validation-provider>
              </div>
            </div>
            <div class="clearfix"></div>
          </form>
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
    </b-overlay>
  </div>
</template>
<script>
export default {
  components: {},
  data() {
    return {
      category: {
        id: null,
        name: null
      },
      show: false,
      url: 'website/documents/categories/'
    };
  },
  created() {},
  mounted() {},
  methods: {
    getValidationState({ dirty, validated, valid = null }) {
      return dirty || validated ? valid : null;
    },
    async createcategory() {
      try {
        const response = await this.$axios.post(
          `${this.url}`,
          this.category
        );
        this.category = response.data;
        this.$emit('createCategory', await response.data);
      } catch (error) {
        const message =
          (error.response && error.response.data) ||
          error.message ||
          error.toString();
        console.log(message);
      }
    },
    handleOk(bvModalEvt) {
      bvModalEvt.preventDefault();
      this.handleSubmit();
    },
    handleSubmit() {
      this.createcategory();
      this.show = false;
      this.$nextTick(() => {
        this.$bvModal.hide('modal-category');
      });
    }
  }
};
</script>
<style></style>
