<script setup>
import {HeartIcon as Favorite} from '@heroicons/vue/24/outline'
import {HeartIcon as Favorited} from '@heroicons/vue/24/solid'
import {useFavorite} from "../stores/favorite";
import {storeToRefs} from 'pinia'

const {showErrorModal} = useHelpers()

const emit = defineEmits(['follow'])

const favorite = useFavorite()
const user = useUser()
const router = useRouter()

const {data: favorites} = storeToRefs(favorite)

const {post} = defineProps({
  post: {
    type: Object,
    required: true
  }
})

const favoritePressed = (type) => {
  if (!user.isGuest) {
    try {
      let validation = isFollowingUser.value
      let id = post.user.id
      if (type === 'posts') {
        validation = isFollowingPost.value
        id = post.id
      }
      if (validation) {
        favorite.deleted(type, id)
      } else {
        favorite.post(type, id)
      }
      emit('follow')
    } catch (e) {
      showErrorModal(e)
    }
  } else {
    router.push('/login')
  }
}

const isFollowingUser = computed(() => {
  const users = favorites.value?.users ?? []
  return users.some(u => u.id === post.user.id)
})

const isFollowingPost = computed(() => {
  const posts = favorites.value?.posts ?? []
  return posts.some(u => u.id === post.id)
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
        {{ isFollowingUser ? 'Unfollow' : 'Follow' }}
      </button>
    </div>
    <p>
      {{ post.body }}
    </p>
    <button class="bg-red-200 text-red-500 flex items-center justify-center gap-2 p-4 rounded-lg">
      <Favorite
          v-show="!isFollowingPost"
          class="h-6 stroke-current"/>
      <Favorited
          v-show="isFollowingPost"
          class="h-6 stroke-current"/>
      <span class="font-bold" @click="favoritePressed('posts')">
        {{ isFollowingPost ? 'Remove from favorites' : 'Add to my favorites' }}
      </span>
    </button>
  </div>
</template>
