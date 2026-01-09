<script setup>
const emit = defineEmits(['submit'])

import {usePost} from "../stores/post";

const {showErrorModal} = useHelpers()

const user = useUser()
const post = usePost()

const form = reactive({
  title: '',
  body: '',
  user_id: user.data.id,
  image: null
})

const errors = ref({})
const loading = ref(false)

async function submit() {
  errors.value = null
  loading.value = true

  try {
    const fd = new FormData()
    fd.append('title', form.title)
    fd.append('body', form.body)
    fd.append('user_id', form.user_id)
    if (form.image) fd.append('image', form.image)

    console.log([...fd.entries()])
    
    await post.post(fd, {
      headers: {'Content-Type': 'multipart/form-data'}
    })
    form.title = ''
    form.body = ''
    form.image = null
    emit('submit')
  } catch (e) {
    showErrorModal(e)
  }
}

function onFileChange(e) {
  form.image = e.target.files?.[0] || null
}
</script>

<template>
  <form
      class="grid gap-4 mb-16"
      @submit.prevent="submit">
    <input
        v-model="form.title"
        placeholder="Post title"
        class="block w-full rounded-lg border border-gray-400 px-5 py-4 text-sm focus:border-blue-500 focus:outline-none md:text-base">
    <textarea
        v-model="form.body"
        placeholder="What is happening?!"
        class="block w-full rounded-lg border border-gray-400 px-5 py-4 text-sm focus:border-blue-500 focus:outline-none md:text-base"></textarea>
    <input type="file" accept="image/*" @change="onFileChange"/>
    <button class="bg-blue-600 text-white px-8 py-4 rounded-lg">
      Post
    </button>
  </form>
</template>
