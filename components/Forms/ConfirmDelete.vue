<template>
  <div>
    <b-button variant="danger" v-b-modal="`delete-modal-${item.id}`"
      >Excluir</b-button
    >

    <b-modal :id="`delete-modal-${item.id}`" title="Excluir item" hide-footer>
      <p class="my-4">Deseja realmente deletar?</p>
      <b-button
        variant="success"
        class="mt-3"
        block
        @click="$bvModal.hide(`delete-modal-${item.id}`)"
        >Cancelar</b-button
      >
      <b-button variant="danger" class="mt-3" block @click="deleteItem"
        >Deletar</b-button
      >
    </b-modal>
  </div>
</template>

<script>

export default {
  props: {
    item: null,
    url: null
  },
  methods: {
    async deleteItem() {
      try {
        await this.$axios.delete(`${this.url}${this.item.id}/`);
        this.$bvModal.hide(`delete-modal-${this.item.id}`);
        this.$emit("deletItem", { delete: true });
      } catch (error) {
        console.error(error);
      }
    }
  }
};
</script>

<style></style>
