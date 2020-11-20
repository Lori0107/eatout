<template>
  <div class="ui tiny restaurant modal">
    <i class="icon inside close" @click="closeRestaurantModal()"></i>
    <div class="header">
      <h3>Ajouter un restaurant</h3>
      <div class="header-meta">
        <p>Partagez les informations de votre restaurant.</p>
      </div>
    </div>
    <div class="content">
      <form @submit.prevent="postNewRestaurant()" class="ui form">
        <div class="content-form-restaurant">
          <label for="name">Nom</label>
          <input v-model="newRestaurant.restaurantName" type="text" name="name" placeholder="Nom du restaurant" required>
          <label for="address">Adresse complète</label>
          <input v-model="newRestaurant.address" type="text" name="address" placeholder="Rue, Code Postal, Ville" required>
          <div class="content-form-action">
            <button class="ui orange button" type="submit">Valider</button>
            <p><span class="red">*</span> Champs obligatoires</p>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import EventBus from '../main';

export default {
  data() {
    return {
      newRestaurant: {
        id: null,
        restaurantName: null,
        address: null,
        lat: null,
        long: null,
        ratings: []
      }
    }
  },
  methods: {
    postNewRestaurant() {
      this.$store.dispatch('postRestaurant', this.newRestaurant)
      .then(() => {
        this.newRestaurant = {
          id: null,
          restaurantName: null,
          address: null,
          lat: null,
          long: null,
          ratings: []
        }
        alert('Nouveau restaurant ajouté !');
        this.closeRestaurantModal();
      });
    },
    openRestaurantModal() {
      $('.ui.restaurant.modal').modal({
        inverted: true,
        closable: false
      });
      $('.ui.restaurant.modal').modal('show');
    },
    closeRestaurantModal() {
      EventBus.$emit('close-restaurant-form');
      $('.ui.restaurant.modal').modal('hide');
    }
  },
  mounted() {
    EventBus.$on('add-new-restaurant', () => this.openRestaurantModal());
  }
}
</script>

<style>
</style>