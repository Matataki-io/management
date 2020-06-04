<template>
  <div class="card">
    <div v-if="p" class="card-data">
      <div class="cover">
        <el-image
          :src="cover"
          lazy
          alt="cover"
        />
      </div>
      <div class="card-right">
        <h3>
          {{ p.title }}
        </h3>
        <p>
          {{ p.short_content }}
        </p>
      </div>
    </div>
    <div v-else class="noData">
      <h4>
        请填写正确的文章ID
      </h4>
    </div>
  </div>
</template>

<script>

export default {
  name: 'LogDataRenderer',
  props: {
    p: {
      type: Object,
      default: null
    }
  },
  computed: {
    cover() {
      return `${this.apis.imgHost}${this.p.cover}`
    }
  },
  methods: {}
}
</script>

<style scoped>
.card {
  background-color: rgb(241, 241, 241);
  border-radius: 10px;
  padding: 10px;
  /* box-shadow: 0 1px 2px 0 rgba(0, 0, 0, .05); */
  height: 80px;
}
.card-data {
  display: flex;
}
.cover {
  width: 120px;
  min-width: 120px;
  height: 60px;
  margin-right: 10px;
  overflow: hidden;
}
.cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius:8px;
}
.card-right h3 {
  font-size: 16px;
  color: black;
  line-height: 21px;
  margin: 0;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
}
.card-right p {
  font-size: 14px;
  color: black;
  line-height: 21px;
  height: 42px;
  margin: 0;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
.noData {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
.noData h4 {
  margin: 0;
}
</style>
