export default {
  srcDir: "src",
  srcFiles: [
    // No incluir archivos fuente para evitar problemas de módulos
  ],
  specDir: "spec",
  specFiles: [
    "browserTestsSpec.js"  // Solo incluir pruebas compatibles con navegador
  ],
  helpers: [
    // No incluir helpers con imports
  ],
  browser: {
    name: "chrome",
    headless: false 
  },
  random: false,
  stopSpecOnExpectationFailure: false,
  exitOnCompletion: false
};