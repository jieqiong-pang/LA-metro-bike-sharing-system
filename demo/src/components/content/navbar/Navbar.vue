<template>
  <div>
    <b-navbar
      id="nav"
      class="navbar-horizontal"
      toggleable="md"
      type="light"
      variant="light"
    >
      <b-navbar-brand to="/about">
        <img
          src="@/assets/img/bike_log.svg"
          class="d-inline-block header-svg"
        />
        <span class="header-title">Los Angeles Metro Bike Share Visualization</span>
      </b-navbar-brand>

      <NavbarFormSelect
        ref="navbar_form_select"
        :class="{ 'header-form-select': true, dv_hide: shouldHide }"
      ></NavbarFormSelect>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav class="ml-auto header_navbar_text">
          <b-nav-item
            active-class="dv_nav_item_active"
            class="header-nav-item"
            to="/region"
            >Region</b-nav-item
          >
          <b-nav-item
            active-class="dv_nav_item_active"
            class="header-nav-item"
            to="/station"
            >Station</b-nav-item
          >
          <b-nav-item
            active-class="dv_nav_item_active"
            class="header-nav-item"
            to="/about"
            >About</b-nav-item
          >
          <!-- <b-nav-item active-class="dv_nav_item_active" class="header-nav-item" to="/test"
            >Test</b-nav-item
          > -->
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>

<script>
import NavbarFormSelect from "@/components/content/navbar/NavbarFormSelect";

export default {
  name: "Navbar",
  data() {
    return {
      shouldHide: false,
    };
  },
  components: {
    NavbarFormSelect,
  },
  watch: {
    "$route.name"(newV, oldV) {
      // console.log("$route.name", this.$route.name);
      if (newV === "Region" || newV == "About") {
        this.shouldHide = true;
      } else {
        this.shouldHide = false;
      }
    },
  },
  mounted() {
    const route_name = this.$route.name;
    console.log("route_name in mounted", route_name);

    if (
      route_name === "Region" ||
      route_name == "About"
    ) {
      this.shouldHide = true;
    } else {
      this.shouldHide = false;
    }
  },
};
</script>

<style lang="scss">
.nav-link {
  padding-left: 0;
  padding-right: 0;
}

.dv_nav_item_active {
  color: #265acc;
  border-bottom: 3px solid #265acc;
  padding-bottom: 12px;
}

#nav {
  // background-color: $primary;
  // height: 80px; // can't set height. If does, toggle will misfunction
  // box-shadow: 0px 1px 4px 1px rgb(192, 192, 192);
  border-bottom: 1px solid lightgray;

  .header-svg {
    height: $navbar-height;
    width: 50px;
    // TODO: color
  }

  // TODO: 宽度小于lg不显示
  // .header-title {

  // }

  .header-form-select {
    width: 105px;
    // opacity: 70%;
    text-align: left;
    // height: 40px;
  }

  // TODO: font color clearer
  .header-nav-item {
    width: 100px;
  }

  @media (max-width: 768px) {
    .header_navbar_text {
      text-align: left;
    }
  }

  @media (max-width: 1199.98px) {
    .header-title {
      display: none;
    }
  }
}
</style>
