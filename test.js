const iso = require("./lib/index");
console.log(iso.default.getAllCountries());
console.log(iso.default.getCountry("124", "iso"));
console.log(iso.default.getStatesByCountryCode("124", "iso"));
console.log(iso.default.getStateByAbbreviation("qc", "124", "iso"));
console.log(iso.default.searchCountry("ind"));
console.log(iso.default.getStateByIsoCode("in-gj"));
console.log(iso.default.searchStateWithinCountry("guj", "in"));