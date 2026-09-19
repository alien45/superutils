import { withGradleProperties } from 'expo/config-plugins'
import path from 'path'
import fs from 'fs'

const PACKAGE_NAME = '@superutils/expo-binary-module'
const PACKAGE_NAME_JAVA = 'io.github.alien45.superutils.expobinarymodule'
const DEFAULT_JNI_LIBS_DIR = 'src/main/jniLibs'
let buildGradleGenerated = false
export default function withBinaryService(config, props = {}) {
	config = withGradleProperties(config, config => {
		// Configure expo to extract the binaries under jniLibs directory from the APK to the filesystem
		config.modResults.push({
			type: 'property',
			key: 'expo.useLegacyPackaging',
			value: 'true',
		})

		return config
	})

	const { jniLibs } = props || {}
	if (!buildGradleGenerated) {
		buildGradleGenerated = true

		jniLibs ??= process.env.EXPO_BINARY_SERVICE_JNILIBS_PATH
		// Expo app root
		const appRoot = config._internal.projectRoot
		// Path to jniLibs directory to copy the binaries into the bundled app
		const jniLibsAbsPath = !jniLibs
			? [DEFAULT_JNI_LIBS_DIR]
			: jniLibs.split(',').map(x => {
					x = x.trim()

					// absolute path
					if (x.startsWith('/')) return x

					// relative path
					return path.resolve(appRoot, x)
				})
		// Root directory of this package's "build" directory
		const pkgBuildPath = path.dirname(require.resolve(PACKAGE_NAME))
		const buildGradlePath = path.resolve(
			pkgBuildPath,
			'../android/build.gradle',
		)

		fs.writeFileSync(
			buildGradlePath,
			getBuildGradleContents(jniLibsAbsPath),
		)
	}

	return config
}

const getBuildGradleContents = (jniLibsPathArr = []) => `
plugins {
  id 'com.android.library'
  id 'expo-module-gradle-plugin'
}

group = '${PACKAGE_NAME_JAVA}'
version = '0.1.0'

android {
  namespace "${PACKAGE_NAME_JAVA}"
  defaultConfig {
    versionCode 1
    versionName "0.1.0"
  }
  lintOptions {
    abortOnError false
  }

  // tell gradle to include the binaries from the jniLibs directory
  sourceSets {
    main {
      jniLibs.srcDirs = ${JSON.stringify(jniLibsPathArr)}
    }
  }
}

dependencies {
  implementation 'com.google.code.gson:gson:2.11.0'
}
`
