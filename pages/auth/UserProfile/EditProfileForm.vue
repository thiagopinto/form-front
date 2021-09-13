<template>
  <div>
    <b-button block v-b-modal.modal-xl>Atualizar dados</b-button>

    <b-modal id="modal-xl" size="xl" scrollable title="Perfil" @ok="handleOk">
      <form ref="form" @submit.stop.prevent="handleSubmit">
        <div class="row">
          <div class="col-md-3">
            <fg-input
              type="text"
              label="Username"
              placeholder="Username"
              v-model="user.username"
            >
            </fg-input>
          </div>
          <div class="col-md-4">
            <fg-input
              type="email"
              label="E-mail"
              placeholder="Email"
              v-model="user.email"
            >
            </fg-input>
          </div>
        </div>

        <div class="row">
          <div class="col-md-6">
            <fg-input
              type="text"
              label="Nome"
              placeholder="Nome"
              v-model="user.first_name"
            >
            </fg-input>
          </div>
          <div class="col-md-6">
            <fg-input
              type="text"
              label="Sobrenome"
              placeholder="Sobrenome"
              v-model="user.last_name"
            >
            </fg-input>
          </div>
        </div>

        <div class="row">
          <div class="col-md-12">
            <fg-input
              type="text"
              label="Currículo Lattes"
              placeholder="Currículo Lattes"
              v-model="user.profile.lattesPath"
            >
            </fg-input>
          </div>
        </div>

        <div class="row">
          <div class="col-md-12">
            <fg-input
              type="text"
              label="Orcid"
              placeholder="Orcid"
              v-model="user.profile.orcidPath"
            >
            </fg-input>
          </div>
        </div>

        <div class="row">
          <div class="col-md-12">
            <div class="form-group">
              <label>Descrição breve</label>
              <textarea
                rows="5"
                class="form-control border-input"
                placeholder="Here can be your description"
                v-model="user.profile.description"
              ></textarea>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-12">
            <div class="form-group">
              <label>Descrição completa</label>
              <textarea
                rows="5"
                class="form-control border-input"
                placeholder="Here can be your description"
                v-model="user.profile.description_full"
              ></textarea>
            </div>
          </div>
        </div>
        <div class="clearfix"></div>
      </form>
      <template v-slot:modal-footer="{ ok, cancel }">
        <b-button size="sm" variant="success" @click="ok()"> Salvar </b-button>
        <b-button size="sm" variant="danger" @click="cancel()">
          Cancelar
        </b-button>
      </template>
    </b-modal>
  </div>
</template>
<script>
export default {
  data() {
    return {
      currentUser: {
        profile: {
          lattesPath: null
        }
      },
      user: {
        profile: {
          lattesPath: null
        }
      }
    };
  },
  props: {
    userOld: Object
  },
  mounted: () => {
    this.user = Object.assign({}, this.userOld);
  },
  methods: {
    checkFormValidity() {
      // const valid = this.$refs.form.checkValidity();
      // this.nameState = valid;
      // return valid;
      return true;
    },
    handleOk(bvModalEvt) {
      bvModalEvt.preventDefault();
      this.handleSubmit();
    },
    updateProfile() {
      this.$store.dispatch('auth/patchProfile', this.user).then(
        user => {
          // this.user = user.data;
          this.$emit('changeUser', user);
        },
        error => {
          this.message =
            (error.response && error.response.data) ||
            error.message ||
            error.toString();
        }
      );
    },
    handleSubmit() {
      // Exit when the form isn't valid
      // if (!this.checkFormValidity()) {
      //  return;
      // }
      // Push the name to submitted names
      // this.submittedNames.push(this.name);
      // Hide the modal manually
      this.updateProfile();
      this.$nextTick(() => {
        this.$bvModal.hide('modal-xl');
      });
    }
  }
};
</script>
<style></style>
