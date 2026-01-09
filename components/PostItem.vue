<script setup>
import {HeartIcon} from '@heroicons/vue/24/outline'
import {useFavorite} from "../stores/favorite";
import {storeToRefs} from 'pinia'

const {showErrorModal} = useHelpers()

const emit = defineEmits(['follow'])

const favorite = useFavorite()

const {data: favorites} = storeToRefs(favorite)

const {post} = defineProps({
  post: {
    type: Object,
    required: true
  }
})

const favoritePressed = (type) => {
  try {
    if (isFollowing.value) {
      favorite.deleted(type, post.user.id)
    } else {
      favorite.post(type, post.user.id)
    }
    emit('follow')
  } catch (e) {
    console.log("favoritePressed")
    console.log("catch")
    console.log(e)
    showErrorModal(e)
  }
}

const isFollowing = computed(() => {
  const users = favorites.value?.users ?? []
  return users.some(u => u.id === post.user.id)
})
</script>

<template>
  <div class="grid gap-3">
    <h4 class="font-bold text-lg">
      {{ post.title }}
    </h4>
    <div class="flex justify-between bg-gray-100 p-4 rounded-lg">
      <div>
        by <strong>{{ post.user.name }}</strong>
      </div>
      <button class="font-medium bg-blue-200 text-sm px-2 rounded-full" @click="favoritePressed('users')">
        {{ isFollowing ? 'Unfollow' : 'Follow' }}
      </button>
    </div>
    <p>
      {{ post.body }}
    </p>
    <button class="bg-red-200 text-red-500 flex items-center justify-center gap-2 p-4 rounded-lg">
      <HeartIcon
          class="h-6 stroke-current"/>
      <span class="font-bold">
        Add to my favorites
      </span>
    </button>
  </div>
</template>
