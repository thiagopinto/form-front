<template>
  <div class="row align-items-center justify-content-center">
    <div class="col-4 align-self-center">
      <div class="card card-user">
        <div class="card-body">
          <div class="register">
            <img
              src="@/assets/img/avatar_2x.png"
              alt="logo"
              class="avatar border-white"
            />
            <hr />
            <div v-if="!successful">Usuário cadastrado</div>
            <form name="form" @submit.prevent="handleRegister">
              <div v-if="!successful">
                <div class="form-group">
                  <label for="name">Name</label>
                  <input
                    v-model="user.name"
                    v-validate="'required|min:3|max:20'"
                    type="text"
                    class="form-control"
                    name="name"
                  />
                  <div
                    v-if="submitted && errors.has('name')"
                    class="alert-danger"
                  >
                    {{ errors.first('name') }}
                  </div>
                </div>
                <div class="form-group">
                  <label for="email">Email</label>
                  <input
                    v-model="user.email"
                    v-validate="'required|email|max:50'"
                    type="email"
                    class="form-control"
                    name="email"
                  />
                  <div
                    v-if="submitted && errors.has('email')"
                    class="alert-danger"
                  >
                    {{ errors.first('email') }}
                  </div>
                </div>
                <div class="form-group">
                  <label for="password">Password</label>
                  <input
                    v-model="user.password"
                    v-validate="'required|min:6|max:40'"
                    type="password"
                    class="form-control"
                    name="password"
                  />
                  <div
                    v-if="submitted && errors.has('password')"
                    class="alert-danger"
                  >
                    {{ errors.first('password') }}
                  </div>
                </div>
                <div class="form-group">
                  <label for="password-confirm">Confirm Password</label>
                  <input
                    v-model="user.password_confirmation"
                    v-validate="'required|min:8|max:40'"
                    type="password"
                    class="form-control"
                    name="password-confirm"
                  />
                  <div
                    v-if="submitted && errors.has('password-confirm')"
                    class="alert-danger"
                  >
                    {{ errors.first('password-confirm') }}
                  </div>
                </div>
                <div class="form-group">
                  <button class="btn btn-warning btn-block">Sign Up</button>
                </div>
              </div>
            </form>

            <div
              v-if="message"
              class="alert"
              :class="successful ? 'alert-success' : 'alert-danger'"
            >
              {{ message }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'register',
  data() {
    return {
      user: {},
      submitted: false,
      successful: false,
      message: ''
    };
  },
  computed: {
    loggedIn() {
      return this.$store.state.auth.status.loggedIn;
    }
  },
  mounted() {
    if (this.loggedIn) {
      this.$router.push('/auth/profile');
    }
  },
  methods: {
    handleRegister() {
      this.message = '';
      this.submitted = true;
      this.$validator.validate().then((isValid) => {
        if (isValid) {
          this.$store.dispatch('auth/register', this.user).then(
            (response) => {
              this.$router.push('/auth/register');
              // this.message = data.message;
              this.successful = true;
              console.log(response);
            },
            (error) => {
              this.message = error.response.data.message;
              this.successful = false;
            }
          );
        }
      });
    }
  }
};
</script>

<style scoped>
body {
  background-color: #f7f5ec;
}

.form-control {
  background-color: #f7f5ec;
}

.content {
  padding: 30px 15px;
}

.card-user .register {
  text-align: center;
  text-transform: none;
  margin-top: -65px;
}

.register {
  font-weight: 700;
  text-transform: uppercase;
}
</style>
