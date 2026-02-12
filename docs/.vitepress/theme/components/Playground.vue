<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { EmbedOptions } from '@stackblitz/sdk'
import { embedPlayground, type PlaygroundProject } from '../stackblitz'

const props = defineProps<PlaygroundProject & { embedOptions: EmbedOptions }>()

const el = ref<HTMLElement | null>(null)

onMounted(() => {
	embedPlayground(props, el.value, props.embedOptions)
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
