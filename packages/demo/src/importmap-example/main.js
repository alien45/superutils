import { deferred, getValues, search, sort } from "@superutils/core";
import PromisE, { ResolveError, ResolveIgnored } from "@superutils/promise";
import fetch, { createPostClient, FetchAs } from "@superutils/fetch";

let products = []
let products_local = [
    {
        id: 10001,
        title: 'Local  product 1',
        description: 'Local  product 1 description',
        price: 100,
    }
]

const fetchProductsDeferred = fetch.get.deferred(
    {
        delayMs: 300,
        resolveError: ResolveError.WITH_UNDEFINED,
        // resolveIgnored: ResolveIgnored.NEVER,
        onError: console.log,
        throttle: false,
    },
    "https://dummyjson.com/products?limit=1000",
)
const getProducts = async () => {
    try {
        setLoading('Loading products...')
        const result = await fetchProductsDeferred()
        if (!result) return
        products = new Map(
            sort([...result.products, ...products_local], (a, b) => a.id > b.id ? 1 : -1)
                .map(x => [x.id, x])
        )
        const thead = document.querySelector(`table thead`)
        thead.innerHTML = `
            <tr class="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">

            ${[
                'ID',
                'Title',
                'Description',
                'Price',
            ].map(content => `
                <th class="py-3 px-6 text-left">
                    ${content}
                </th>
            `).join('\n')}
            </tr>
        `
        const tbody = document.querySelector(`table tbody`)
        tbody.innerHTML = getValues(products).map(({ description, id, price, title }) => `
        <tr class="border-b border-gray-300 hover:bg-gray-100">
            ${[
                id,
                title,
                description,
                price,
            ].map(content => `
            <td class="py-3 px-6">${content}</td>
        `).join('\n')}
        </tr>
    `).join('')
        setVisibility(true, ['table'])
        setVisibility(false, ['.messages'])
    } catch (err) {
        setVisibility(true, ['.messages .error', '.messages'])
        const elErrMsg = document.querySelector('.error .message')
        if (elErrMsg) elErrMsg.textContent = err.message

        setVisibility(false, ['.loading', 'table'])

    }
}

const setLoading = (message = '') => {
    setVisibility(false, ['table', '.messages .error'])
    setVisibility(true, ['.messages', '.messages .loading'])
    const elLoadingMsg = document.querySelector('.loading .message')
    if (!message || !elLoadingMsg) return
    elLoadingMsg.textContent = message
}

const setVisibility = (show = true, selectors = [], ids = []) => {
    const els = [
        ...selectors.map(selector => [...document.querySelectorAll(selector)]).flat(),
        ...ids.map(id => document.getElementById(id))
    ]
    els.forEach(el => el?.classList[show ? 'remove' : 'add']('hidden'))
}

document.body.addEventListener('click', (e) => {
    const { target } = e
    if (!target) return
    switch (target.nodeName) {
        case 'BUTTON':
            target.classList.contains('btn-reload') && getProducts()
            break;
    }
})

setTimeout(getProducts)

// console.log({ deferred, search, PromisE, fetch });
// // sample colletion
// const data = new Map([
//     [1, { age: 30, name: "Alice" }],
//     [2, { age: 25, name: "Bob" }],
//     [3, { age: 35, name: "Charlie" }],
//     [4, { age: 28, name: "Dave" }],
//     [5, { age: 22, name: "Eve" }],
// ]);

// const searchDeferred = deferred(
//     (event) => {
//         const result = search(data, {
//             query: {
//                 name: new RegExp(event?.target?.value, "i"),
//             },
//         });
//         // print result to console
//         console.log(result);
//     },
//     300, // debounce duration in milliseconds
//     { leading: false }, // optional defer options
// );

// // ignored
// searchDeferred({ target: { value: "l" } });
// // ignored
// setTimeout(() => searchDeferred({ target: { value: "li" } }), 50);
// // executed: prints `Map(1) {3 => {age: 35, name: 'Charlie' } }`
// setTimeout(() => searchDeferred({ target: { value: "lie" } }), 200);
// // executed: prints `Map(1) {1 => {age: 30, name: 'Alice' } }`
// setTimeout(() => searchDeferred({ target: { value: "lic" } }), 510);

// // Create a POST client with 10-second as the default timeout
// const postClient = createPostClient(
//     {
//         method: "post",
//         headers: { "content-type": "application/json" },
//     },
//     { timeout: 10000 },
// );

// // Invoking `postClient()` automatically applies the pre-configured options
// postClient(
//     "https://dummyjson.com/products/add",
//     { title: "New Product" }, // data/body
//     {}, // other options
// ).then(console.log);

// // create a deferred client using "postClient"
// const updateProduct = postClient.deferred(
//     {
//         delayMs: 300, // debounce duration
//         onResult: console.log, // prints only successful results
//     },
//     "https://dummyjson.com/products/add",
//     {
//         method: "patch",
//         timeout: 3000,
//     },
// );
// updateProduct({ title: "New title 1" }); // ignored by debounce
// updateProduct({ title: "New title 2" }); // executed