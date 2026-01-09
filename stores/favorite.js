export const useFavorite = defineStore('favorite', () => {
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

    async function get() {
        try {
            const payload = await $api.get('/favorites')
            start(payload)
        } catch (e) {
            clear()
        }
    }

    async function post(type, id) {
        const payload = await $api.post('/' + type + '/' + id + '/favorite')
        start(payload)
    }

    async function deleted(type, id) {
        const payload = await $api.delete('/' + type + '/' + id + '/favorite')
        start(payload)
    }

    return {
        started,
        data,
        get,
        post,
        deleted
    }
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useUser, import.meta.hot))
}
