<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { type Project } from '@stackblitz/sdk'
import { embedPlayground } from '../stackblitz'

type Props = Partial<Project> & {
	/** The code to be used in the index.ts/js file (if not provided in the `project.files`) */
	code?: string
	/** Additional package.json script to be added to the project */
	scripts?: Record<string, string>
}
const props = defineProps<Props>()

const el = ref<HTMLElement | null>(null)

onMounted(() => {
	embedPlayground(props, el.value)
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
