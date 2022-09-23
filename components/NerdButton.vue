<template>
    <button class="bg-gray-300 hover:bg-gray-400 rounded-md shadow" :class="style + margin">{{ text }}</button>
</template>

<script>
export default {
    props: {
        text: {
            type: String,
            required: true
        },
        size: {
            type: String,
            default: 'sm',
            required: false
        },
        margin: {
            type: String,
            default: 'm-1',
            required: false
        },
    },
    data() {
        return {}
    },
    computed: {
        style() {
            switch (this.size) {
                case 'sm':
                    return 'py-1 px-2 text-sm '
                case 'md':
                    return 'py-1 px-4 text-lg '
                case 'lg':
                    return 'py-3 px-6 text-xl '
                case 'xl':
                    return 'py-3 px-10 text-3xl '
                default:
                    return 'py-4 px-8'
            }
        },
    }
}
</script>