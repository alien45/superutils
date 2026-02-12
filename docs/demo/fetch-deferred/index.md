---
layout: false
sidebar: false
---

<div class="playground-full-height">
    <Playground
        :files="{ 'index.html': { src: './index.html.txt' }, 'index.js': { src: './index.js.txt' } }"
        :embedOptions="{ 'height' : '1000', 'view': 'default' }" 
        :indexFile="'index.js'"
        :language="'html'"
        :zenMode="true"
    />
</div>
