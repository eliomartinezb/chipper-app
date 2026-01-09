<script setup>
definePageMeta({
  middleware: ['validate-session']
})

const {$api} = useNuxtApp()
const user = useUser()

const posts = ref([])

async function load() {
  const {data} = await $api.get('posts')
  posts.value = data
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
        v-bind="{ post }"/>
  </div>
</template>
