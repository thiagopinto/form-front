<template>
  <div
    class="tableauPlaceholder"
    :id="`tableau${id}`"
    style="position: relative"
  >
    <noscript>
      <a href="#"
        ><img
          :alt="`${resource}`"
          :src="
            `https://public.tableau.com/static/images/23/${resource}/1_rss.png`
          "
          style="border: none"
      /></a>
    </noscript>
    <object class="tableauViz" style="display:none;"
      ><param name="host_url" value="https://public.tableau.com/"/>
      <param name="embed_code_version" value="3"/>
      <param name="site_root" value=""/><param
        name="name"
        :value="`${resource}`"/><param name="tabs" value="no"/><param
        name="toolbar"
        value="yes"/><param
        name="static_image"
        :value="
          `https://public.tableau.com/static/images/${prefix}/${resource}/1.png`
        "/>
      <param name="animate_transition" value="yes"/><param
        name="display_static_image"
        value="yes"/><param name="display_spinner" value="yes"/><param
        name="display_overlay"
        value="yes"/><param name="display_count" value="yes"/><param
        name="language"
        value="pt-BR"
    /></object>
  </div>
</template>

<script>
export default {
  props: {
    resource: null,
    prefix: null
  },
  data() {
    return {
      id: Math.floor(Math.random() * 1000),
      divElement: null,
      vizElement: null,
      scriptElement: null
    };
  },
  created: function() {},
  mounted: function() {
    this.divElement = document.getElementById(`tableau${this.id}`);
    this.vizElement = this.divElement.getElementsByTagName("object")[0];
    this.scriptElement = document.createElement("script");
    this.generateTableau();
  },
  watch: {
    resource: function() {
      this.generateTableau();
    }
  },
  methods: {
    generateTableau() {
      if (this.resource != null && this.prefix != null) {
        if (this.divElement.offsetWidth > 800) {
          this.vizElement.style.width = "1000px";
          this.vizElement.style.height = "827px";
        } else if (this.divElement.offsetWidth > 500) {
          this.vizElement.style.width = "680px";
          this.vizElement.style.height = "562px";
        } else {
          this.vizElement.style.width = "100%";
          this.vizElement.style.height = "1177px";
        }

        this.scriptElement.src =
          "https://public.tableau.com/javascripts/api/viz_v1.js";
        this.vizElement.parentNode.insertBefore(
          this.scriptElement,
          this.vizElement
        );
      }
    }
  }
};
</script>
