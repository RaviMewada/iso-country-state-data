export interface ICountryJson {
  name: string;
  alpha2_code: string;
  alpha3_code: string;
  numeric_code: string;
}

export interface ICountry {
  name: string;
  isoCode: string;
  alpha2Code: string;
  alpha3Code: string;
}

export enum CountryCodeType {
  Iso = 'iso',
  Alpha2 = 'alpha2',
  Alpha3 = 'alpha3',
}

export interface IState {
  name: string;
  isoCode: string;
  subdivisionCategory: string;
  abbreviation: string;
}

export interface IStateJson {
  subdivision_category: string;
  iso_3166_2_code: string;
  subdivision_name: string;
  abbreviation: string;
}
