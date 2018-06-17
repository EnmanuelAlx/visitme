/*eslint-env node*/
const gulp = require("gulp");
var path = require("path");
const gulpIf = require("gulp-if");
const browserSync = require("browser-sync").create();
const sass = require("gulp-sass");
const useref = require("gulp-useref");
const uglify = require("gulp-uglify-es").default;
const imagemin = require("gulp-imagemin");
const cache = require("gulp-cache");
const htmlmin = require("gulp-html-minifier");
const cssnano = require("gulp-cssnano");
const del = require("del");
const runSequence = require("run-sequence");
const babel = require("gulp-babel");
const sourcemaps = require("gulp-sourcemaps");
const handlebars = require("gulp-handlebars");
const wrap = require("gulp-wrap");
const declare = require("gulp-declare");
const concat = require("gulp-concat");
const historyApiFallback = require("connect-history-api-fallback");
const removeLine = require("gulp-remove-line");
const fs = require("fs");
const replace = require("gulp-replace");
const rename = require("gulp-rename");

const ENVIRONMENT = process.env.NODE_ENV || "test";

gulp.task("clean-sammy", () => {

  gulp.src(["node_modules/sammy/lib/plugins/sammy.oauth2.js"])
    .pipe(removeLine({
      "sammy.oauth2.js": ["103-108"]
    }))
    .pipe(gulp.dest("node_modules/sammy/lib/plugins/"));
});

gulp.task("sass", () => {
  return gulp
    .src([
      "src/visitme/styles/scss/*.scss",
      "node_modules/bootstrap-datepicker/dist/css/bootstrap-datepicker.min.css",
      "node_modules/toastr/build/toastr.min.css",
      "node_modules/dropzone/dist/dropzone.css",
      "node_modules/pretty-checkbox/dist/pretty-checkbox.min.css",
      "node_modules/bootstrap-colorpicker/dist/css/bootstrap-colorpicker.min.css",
      "node_modules/bootstrap4c-dropzone/dist/css/component-dropzone.min.css",
      "node_modules/easy-autocomplete/dist/easy-autocomplete.min.css",
      "node_modules/datatables.net-bs4/css/dataTables.bootstrap4.css"
    ])
    .pipe(sass())
    .pipe(gulp.dest("src/visitme/styles/css"))
    .pipe(browserSync.stream());
});

gulp.task("js", () => {
  return gulp
    .src([
      "node_modules/bootstrap/dist/js/bootstrap.min.js",
      "node_modules/jquery/dist/jquery.min.js",
      "node_modules/popper.js/dist/umd/popper.min.js",
      "node_modules/sammy/lib/min/sammy-latest.min.js",
      "node_modules/sammy/lib/plugins/sammy.storage.js",
      "node_modules/sammy/lib/plugins/sammy.json.js",
      "node_modules/sammy/lib/plugins/sammy.oauth2.js",
      "node_modules/jquery-validation/dist/jquery.validate.min.js",
      "node_modules/toastr/build/toastr.min.js",
      "node_modules/jquery-validation/dist/additional-methods.js",
      "node_modules/jquery-serializejson/jquery.serializejson.min.js",
      "node_modules/bootstrap-datepicker/dist/js/bootstrap-datepicker.min.js",
      "node_modules/bluebird/js/browser/bluebird.core.min.js",
      "node_modules/babel-polyfill/dist/polyfill.min.js",
      "node_modules/handlebars/dist/handlebars.min.js",
      "node_modules/handlebars/dist/handlebars.runtime.js",
      "node_modules/dropzone/dist/dropzone.js",
      "node_modules/moment/moment.js",
      "node_modules/lodash/lodash.js",
      "node_modules/easy-autocomplete/dist/jquery.easy-autocomplete.min.js",
      "node_modules/datatables.net/js/jquery.dataTables.js",
      "node_modules/clipboard/dist/clipboard.min.js",
      "node_modules/chart.js/dist/Chart.min.js",
      "node_modules/chart.piecelabel.js/build/Chart.PieceLabel.min.js",
    ])
    .pipe(gulp.dest("src/visitme/js/lib"))
    .pipe(browserSync.stream());
});

gulp.task("babel", () => {
  const settings = JSON.parse(fs.readFileSync("config/config.json", "utf8"));
  const mainApi = settings.mainApi[ENVIRONMENT];
  return gulp
    .src(["src/visitme/js/**/*.js"])
    .pipe(sourcemaps.init())
    .pipe(
      babel({
        presets: ["env"],
        plugins: ["syntax-async-functions", "transform-regenerator"]
      })
    )
    .pipe(sourcemaps.write("."))
    .pipe(sourcemaps.write("."))
    .pipe(replace("@@mainApi", mainApi))
    .pipe(replace("@@environment", ENVIRONMENT))
    .pipe(gulp.dest("src/visitme/dist"))
    .pipe(browserSync.stream());
});

gulp.task("clean:dist", () => {
  return del.sync("dist/visitme");
});

gulp.task("screens-visitme", () => {
  gulp
    .src("./src/visitme/views/**/*.html")
    .pipe(
      htmlmin({
        collapseWhitespace: true
      })
    )
    .pipe(gulp.dest("./dist/visitme/views"));
});

gulp.task("templates", () => {
  gulp
    .src("./src/visitme/views/**/*.hbs")
    .pipe(handlebars())
    .pipe(wrap("Handlebars.template(<%= contents %>)"))
    .pipe(declare({
      namespace: "MyApp.templates",
      noRedeclare: true
    })) // Avoid duplicate declarations
    .pipe(concat("templates.js"))
    .pipe(gulp.dest("src/visitme/dist/templates"));
});

gulp.task("partials", () => {
  gulp
    .src(["./src/visitme/views/**/_*.hbs"])
    .pipe(handlebars())
    .pipe(
      wrap(
        "Handlebars.registerPartial(<%= processPartialName(file.relative) %>, Handlebars.template(<%= contents %>));", {}, {
          imports: {
            processPartialName: function (fileName) {
              // Strip the extension and the underscore
              // Escape the output with JSON.stringify
              return JSON.stringify(path.basename(fileName, ".js").substr(1));
            }
          }
        }
      )
    )
    .pipe(concat("partials.js"))
    .pipe(gulp.dest("src/visitme/dist/templates"));
});


gulp.task("useref-main", () => {
  return gulp
    .src("src/visitme/*.html")
    .pipe(useref())
    .pipe(gulpIf("*.js", uglify()))
    .pipe(gulpIf("*.css", cssnano()))
    .pipe(gulp.dest("dist/visitme"));
});


gulp.task("images", () => {
  return gulp
    .src("src/visitme/assets/**/*.+(png|jpg|gif|svg)")
    .pipe(cache(imagemin()))
    .pipe(gulp.dest("dist/visitme/assets"));
});

gulp.task("serve-visitme", () => {
  browserSync.init({
    server: {
      baseDir: ["./src/visitme", "./src"]
    },
    middleware: [historyApiFallback()],
    open: false
  });
  gulp.watch(["src/visitme/styles/scss/*.scss"], ["sass"]);
  gulp.watch(["src/visitme/js/**/*.js"], ["babel"]);
  gulp.watch(["src/visitme/views/**/*.hbs"], ["templates"]);
  gulp.watch(["src/visitme/views/**/_*.hbs"], ["partials"]);
  gulp
    .watch([
      "src/visitme/main.html",
      "src/visitme/views/**/*.html",
      "src/visitme/js/**/*.js",
      "src/visitme/views/**/*.hbs",
      "src/visitme/views/**/_*.hbs",
      "src/visitme/styles/scss/*.scss"
    ])
    .on("change", browserSync.reload);
});


gulp.task("start-visitme", [
  "serve-visitme",
  "index",
  "sass",
  "babel",
  "js",
  "templates",
  "partials",
]);

gulp.task("build-visitme", callback => {
  runSequence(
    "clean:dist-broker", [
      "sassr",
      "babel",
      "useref",
      "images",
      "screens",
      "templates",
      "partials",
    ],
    callback
  );
});

gulp.task("index", () => {
  return gulp
    .src("src/visitme/main.html")
    .pipe(rename("index.html"))
    .pipe(gulp.dest("src/visitme/"));
});
