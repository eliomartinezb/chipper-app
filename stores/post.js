export const usePost = defineStore('post', () => {
    const {$api} = useNuxtApp()

    const started = ref(false)

    const data = ref({})

    async function start(payload) {
        started.value = true
        data.value = payload.data
    }

    function clear() {
        data.value = {}
    }

    async function post(fd, headers = {}) {
        console.log('Posting new post')
        console.log('fd: ', [...fd.entries()])
        const payload = await $api.post('/posts', fd, headers)

        start(payload)
    }

    return {
        started,
        data,
        post
    }
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useUser, import.meta.hot))
}
