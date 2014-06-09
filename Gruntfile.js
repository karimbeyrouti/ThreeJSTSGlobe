module.exports = function(grunt) {

	// Plugins used by Grunt Script

	grunt.loadNpmTasks("grunt-ts");
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-convert');

	// Grunt Config
	grunt.initConfig( {

		// Read the package.json

		pkg: grunt.file.readJSON('package.json'),

		// Export and compile TypeScript

		ts: {
			ThreeJSGlobe: {
				src: ['src/EarthMain.ts'],
				out: 'bin/js/EarthMain.js',
				options: {
					target: 'es5',
					sourcemap: true,
					declaration: true,
					comments: true
				}
			}
		},


		// Watch typscript compiler

		watch: {
			ThreeJSGlobe: {
				files: ['src/**/*.ts'],
				tasks: ['ts:ThreeJSGlobe' ],
				options: {
					spawn: false
				}
			}
		}
	} );

	// Register Grunt tasks

	//grunt.option.init();

	grunt.registerTask('default',   		['ts:ThreeJSGlobe' ]); // Default Tasks


};

