<script setup>
import {useFavorite} from "../stores/favorite";

definePageMeta({
  middleware: ['validate-session']
})

const {$api} = useNuxtApp()
const user = useUser()
const favorite = useFavorite()

const posts = ref([])
const pendingNewPosts = ref([])

const favorites = ref({})

let pollTimer = null
const polling = ref(false)

const showLoadNew = computed(() => pendingNewPosts.value.length > 0)

async function load() {
  const {data: postsData} = await $api.get('posts')
  posts.value = postsData
  if (!user.isGuest) {
    const {data: favsData} = await favorite.get()
    favorites.value = favsData
  }
}

async function pollPosts() {
  if (polling.value) return
  polling.value = true

  try {
    const {data: latest} = await $api.get('posts')

    const currentIds = new Set(posts.value.map(p => p.id))
    pendingNewPosts.value = latest.filter(p => !currentIds.has(p.id))
  } catch (e) {

  } finally {
    polling.value = false
  }
}

function loadNewPosts() {
  // Los pones ARRIBA (más lógico si el botón está arriba)
  load()
  pendingNewPosts.value = []
}

onMounted(async () => {
  load()

  pollTimer = setInterval(pollPosts, 30_000)
})

onBeforeUnmount(() => {
  if (pollTimer) clearInterval(pollTimer)
})
</script>

<template>
  <PostForm
      @submit="load"
      v-if="!user.isGuest"/>
  <button
      v-if="showLoadNew"
      class="mb-4 w-full rounded-lg bg-green-200 p-3 font-bold"
      @click="loadNewPosts"
  >
    Load New Posts ({{ pendingNewPosts.length }})
  </button>

  <div class="grid gap-16">
    <PostItem
        v-for="post in posts"
        :key="post.id"
        :favorites="favorites"
        @follow="load"
        v-bind="{ post }"/>
  </div>
</template>
