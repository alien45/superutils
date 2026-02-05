export type ObjReadOnlyAllowAddFn<T> = (
	obj: T,
	key: string | symbol,
	value: unknown,
) => boolean

export type ObjReadOnlyConfig<T, Revocable extends true | false = false> = {
	/** Whether to allow adding new properties. Default: `false` */
	add?: boolean | ObjReadOnlyAllowAddFn<T>
	/** Default: `false` */
	revocable?: Revocable
	/** Whether to throw error when a write operation is rejected. Default: `true` */
	silent?: boolean
}
