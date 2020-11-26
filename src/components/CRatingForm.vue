<template>
  <div class="ui tiny rating modal">
    <i class="icon inside close" @click="closeRatingModal()"></i>
    <div class="ratings-container">
      <h3 class="header">Ce que l'on pense de <span class="eatout-style">{{ restaurantName }}</span></h3>
      <div class="ratings-container-list">
        <div class="ratings-container-list-card" v-for="(rating, i) in restaurantRatings" :key="i">
          <div class="ratings-container-list-card-comment">'{{ rating.comment }}'</div>
          <p class="ratings-container-list-card-rating">{{ rating.stars }}/5</p>
        </div>
      </div>
    </div>
    <div class="header">
      <div class="header-title">
        <h3>Ajouter un commentaire</h3>
      </div>
      <div class="header-meta">
        <p>Vous aussi, dites-nous ce que vous pensez de ce restaurant.</p>
      </div>
    </div>
    <div class="content">
      <form @submit.prevent="postRestaurantRating()" class="rating-form">
        <div class="content-form-stars">
          <p>Indiquer une note<span class="red">*</span></p>
          <div>
            <div class="ui radio checkbox">
              <input v-model="stars" type="radio" name="ratingNote" id="note0" value="0" checked required>
              <label for="note0">0</label>
            </div>
            <div class="ui radio checkbox">
              <input v-model="stars" type="radio" name="ratingNote" id="note1" value="1">
              <label for="note1">1</label>
            </div>
            <div class="ui radio checkbox">
              <input v-model="stars" type="radio" name="ratingNote" id="note2" value="2">
              <label for="note2">2</label>
            </div>
            <div class="ui radio checkbox">
              <input v-model="stars" type="radio" name="ratingNote" id="note3" value="3">
              <label for="note3">3</label>
            </div>
            <div class="ui radio checkbox">
              <input v-model="stars" type="radio" name="ratingNote" id="note4" value="4">
              <label for="note4">4</label>
            </div>
            <div class="ui radio checkbox">
              <input v-model="stars" type="radio" name="ratingNote" id="note5" value="5">
              <label for="note5">5</label>
            </div>
          </div>
        </div>
        <div class="content-form-comment">
          <p>Laisser un commentaire<span class="red">*</span></p>
          <textarea v-model="comment" name="comment" id="" cols="40" rows="5" required></textarea>
        </div>
        <div class="content-form-action">
          <button class="ui button small orange" type="submit">Valider</button>
          <p><span class="red">*</span> Champs obligatoires</p>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import EventBus from '../main';

export default {
  props: ["restaurantId", "restaurantName", "restaurantRatings"],
  data() {
    return {
      stars: null,
      comment: null
    }
  },
  methods: {
    postRestaurantRating() {
      this.$store.dispatch( 
      'setRating', 
      { restaurantId: this.restaurantId, 
        rating: {
          stars: +this.stars,
          comment: this.comment
        }
      }).then(() => {
        alert('Nouvelle note ajoutée !');
        this.closeRatingModal();
      });
    },
    openRatingModal() {
      $('.ui.rating.modal').modal({
        inverted: true,
        closable: false
      });
      $('.ui.rating.modal').modal('show');
      $('.ui.radio.checkbox').checkbox();
    },
    closeRatingModal() {
      this.stars = null;
      this.comment = null;
      $('.ui.rating.modal').modal('hide');
    }
  },
  mounted() {
    EventBus.$on('open-rating-modal', () => {
      this.openRatingModal();
    });
  }
}
</script>

<style>
</style>