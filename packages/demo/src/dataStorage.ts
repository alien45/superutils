import fetch from '@superutils/fetch'
import { DataStorage } from '@superutils/rx'
import { LocalStorage } from 'node-localstorage'

type Product = {
	id: number
	title: string
	description: string
	category: string
	price: number
	discountPercentage: number
	rating: number
	stock: number
	tags: string[]
	brand: string
	sku: string
	weight: number
	dimensions: { width: number; height: number; depth: number }
	warrantyInformation: string
	shippingInformation: string
	availabilityStatus: string
	reviews: Record<string, unknown>[]
	returnPolicy: string
	minimumOrderQuantity: number
	meta: {
		createdAt: string
		updatedAt: string
		barcode: string
		qrCode: string
	}
	images: string[]
	thumbnail: string
}
globalThis.localStorage = new LocalStorage(
	'./storage',
	500 * 1024 * 1024 * 1024,
)

const storage = new DataStorage<string, Product>('products.json', {
	cacheDisabled: false,
	initialValue: new Map([
		['0', { title: 'No product availalbe' } as Product],
	]),
})

console.log('onload', storage.subject.value.size)
storage.onChange = () => {}
fetch
	.get<{ products: Product[] }>('https://dummyjson.com/products')
	.then(({ products }) => {
		storage.setAll(new Map(products.map(p => [p.id.toString(), p])), true)
		console.log(storage.getAll().size, storage.getAll(true).size)
		console.log(storage.get('10')) // print product with id `1`

		// const searchOptions: Parameters<typeof storage.search>[0] = {
		// 	query: {
		// 		availabilityStatus: 'low',
		// 		description: 'spicy',
		// 		// title: 'princes',
		// 	},
		// 	matchAll: true,
		// 	matchExact: false,
		// 	// transform:
		// }
		// console.log('search', storage.search(searchOptions))

		// storage.sort('price', { asString: true, reverse: true })
		// console.log('sort', storage.toJSON(null, 4))
	})
