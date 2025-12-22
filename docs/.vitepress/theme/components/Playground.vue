<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { embed } from '../stackblitz'

const props = defineProps<{
	code: string
	dependencies?: Record<string, string>
	type?: string
	scripts?: string[]
	template?: string
}>()

const el = ref<HTMLElement | null>(null)

onMounted(() => {
	embedPlayground(el.value!, props)
})
</script>

<template>
	<div ref="el" />
</template>

<!-- 
example usage from within .md files
<Playground
    :code="`
    import { deferred } from '@superutils/core'

    const handleChange = deferred(
    event => console.log(event.target.value),
    300
    )

    handleChange({ target: { value: 1 } })
    handleChange({ target: { value: 2 } })
    handleChange({ target: { value: 3 } })
    `"
    :dependencies="{ '@superutils/core': 'latest' }"
    :template="typescript"
/>
-->
