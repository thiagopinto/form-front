<template>
  <b-card class="card-user" :img-src="background">
    <template v-slot:header>
      <!--
      <b-img
        v-if="user.profile !== null && user.imagePath !== undefined"
        thumbnail
        :src="user.imagePath || face"
        :alt="user.first_name"
        @error="imgUrlAlt"
        rounded="circle"
        width="150"
      >
      </b-img>
      <b-img
        v-else
        thumbnail
        :src="face"
        :alt="user.first_name"
        @error="imgUrlAlt"
        rounded="circle"
        width="150"
      >
      </b-img>
      -->
    </template>
    <div class="text-center">
      <h4 class="title mt-0">
        {{ user.name }}
        <br />
        <a href="#">
          <small style="font-size: small">{{ user.email }}</small>
        </a>
      </h4>
    </div>
  </b-card>
</template>
<script>
export default {
  components: {},
  data() {
    return {
      face: require('@/assets/img/face-0.jpg'),
      background: require('@/assets/img/background.png'),
      isActiveFlip: false
    };
  },
  props: ['user'],
  methods: {
    getClasses(index) {
      const remainder = index % 3;
      if (remainder === 0) {
        return 'col-lg-3 offset-lg-1';
      } else if (remainder === 2) {
        return 'col-lg-4';
      } else {
        return 'col-lg-3';
      }
    },
    imgUrlAlt(event) {
      event.target.src = this.face;
    }
  }
};
</script>
<style>
.card-user {
  margin-top: 0;
  min-height: 500px;
}

.mt-6 {
  margin-top: 6rem !important;
}

@media screen and (max-width: 577px) {
  margin-top: -288px;
}
</style>
