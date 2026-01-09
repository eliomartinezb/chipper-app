<script setup>
import {useFavorite} from "../stores/favorite";

definePageMeta({
  middleware: ['validate-session']
})

const {$api} = useNuxtApp()
const user = useUser()
const favorite = useFavorite()

const posts = ref([])
const favorites = ref({})

async function load() {
  const {data: postsData} = await $api.get('posts')
  posts.value = postsData
  const {data: favsData} = await favorite.get()
  favorites.value = favsData
}

onMounted(async () => {
  load()
})
</script>

<template>
  <PostForm
      @submit="load"
      v-if="!user.isGuest"/>
  <div class="grid gap-16">
    <PostItem
        v-for="post in posts"
        :key="post.id"
        :favorites="favorites"
        @follow="load"
        v-bind="{ post }"/>
  </div>
</template>
