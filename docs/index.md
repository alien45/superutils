---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
    name: 'Superutils'
    text: 'Code, Supercharged.'
    tagline: A suite of powerful, opinionated, and modular utilities for TypeScript, React, and RxJS.
    actions:
        - theme: brand
          text: What is Superutils?
          link: /api-reference#superutils
        - theme: alt
          text: Quickstart
          link: /api-reference#getting-started
        - theme: alt
          text: Github
          link: https://github.com/alien45/superutils

features:
    - title: '@superutils/core'
      link: /packages/@superutils/core/
      details: A collection of lightweight, dependency-free utility functions and types.
    - title: '@superutils/fetch'
      link: /packages/@superutils/fetch/
      details: A lightweight `fetch` wrapper for browsers and Node.js, designed to simplify data fetching and reduce boilerplate.
    - title: '@superutils/promise'
      link: /packages/@superutils/promise/
      details: An extended Promise with status tracking, deferred execution, and cancellable fetch.
    - title: '@superutils/react'
      link: /packages/@superutils/react/
      details: A collection of React hooks and components for common UI patterns and state management.
    - title: '@superutils/rx'
      link: /packages/@superutils/rx/
      details: A suite of powerful operators and utilities for working with RxJS observables.
---
