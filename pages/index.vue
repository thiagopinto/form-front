<template>
  <div class="row justify-content-around">
    <div class="col-sm-12 col-md-4 col-lg-2">
      <NuxtLink to="dn" class="btn btn-success">
        Formulário declaração de nascimento
      </NuxtLink>
    </div>
    <div class="col-sm-12 col-md-4 col-lg-2">
      <NuxtLink to="do" class="btn btn-success">
        Formulário declaração de óbito
      </NuxtLink>
    </div>
  </div>
</template>

<script>
export default {
  name: 'IndexPage',
  auth: false,
  mounted() {
    // this.$auth.refreshTokens();
  },
};
</script>
