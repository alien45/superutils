export type BinaryEnv = Record<string, EnvEntry | string>

/** Single environment variable configuration */
export type EnvEntry = {
	/**
	 * If true, the value will only be passed to the binary.
	 * Value will NOT be exposed to RN and will be excluded from `getValues()` result.
	 *
	 * Default: `false`
	 */
	binaryOnly?: boolean
} & (
	| {
			/** Whether to base64 encode the generated string */
			encode?: boolean
			/** Prefix to be attached to random value */
			prefix?: string
			/** Generate a random string value  */
			random: true
			/** Number of characters to generate (before encoding). Default: `32` */
			length?: number
	  }
	| {
			/**
			 * Fixed value.
			 *
			 * To provide the JNI Libs directory as part of an environment variable use the keyword: {@link JNI_LIBS_DIR}.
			 *
			 * Eg: `[[JNI_LIBS_DIR]]/mylib.so` will be transformed to `/data/app/~~.......==/com.your.app-......==/lib/<ARCH>/mylib.so`
			 */
			value: string
			random?: never
	  }
)
