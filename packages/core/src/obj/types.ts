export type ObjReadOnlyStrictFn<T> = (
	obj: T,
	key: string | symbol,
	valule: unknown,
) => boolean

export type ObjReadOnlyConf<T, Revocable extends true | false = false> = {
	/** Whether to allow adding new properties. Default: `false` */
	add?: boolean | ObjReadOnlyStrictFn<T>
	/** Default: `false` */
	revocable?: Revocable
	/** Whether to throw error when a write operation is rejected. Default: `false` */
	silent?: boolean
}
