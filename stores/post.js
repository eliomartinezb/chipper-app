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

    async function post({title, body, user_id}) {
        const payload = await $api.post('/posts', {
            title,
            body,
            user_id,
        })

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
