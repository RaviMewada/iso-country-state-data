import { ICountry, CountryCodeType, IState, IStateJson, ICountryJson } from './types';
const countries: ICountryJson[] = require('../JSON_DATA/countries.json');
class IsoData {
  private static instance: IsoData;
  private countries: Map<string, ICountry>;
  private countryIsoCodeMap: Map<string, string>;
  private countryAlpha3CodeMap: Map<string, string>;
  private countryStates: Map<string, Map<string, IState>>;
  private constructor() {
    this.countries = new Map<string, ICountry>();
    this.countryIsoCodeMap = new Map<string, string>();
    this.countryAlpha3CodeMap = new Map<string, string>();
    this.countryStates = new Map<string, Map<string, IState>>();
    this.setData();
  }

  private setData(): void {
    countries.forEach((country) => {
      this.countries.set(country.alpha2_code, {
        name: country.name,
        isoCode: country.numeric_code,
        alpha2Code: country.alpha2_code,
        alpha3Code: country.alpha3_code,
      });
      this.countryIsoCodeMap.set(country.numeric_code, country.alpha2_code);
      this.countryAlpha3CodeMap.set(country.alpha3_code, country.alpha2_code);
    });
  }

  static getInstance(): IsoData {
    if (!IsoData.instance) {
      IsoData.instance = new IsoData();
    }

    return IsoData.instance;
  }

  public getAllCountries(): ICountry[] {
    return Array.from(this.countries.values());
  }

  private getCountryCodeByType(value: string, type: CountryCodeType): string | undefined {
    let alpha2;
    switch (type) {
      case CountryCodeType.Alpha2:
        alpha2 = value.toUpperCase();
        break;
      case CountryCodeType.Iso:
        alpha2 = this.countryIsoCodeMap.get(value.toUpperCase())?.toUpperCase();
        break;
      case CountryCodeType.Alpha3:
        alpha2 = this.countryAlpha3CodeMap.get(value.toUpperCase())?.toUpperCase();
        break;
      default:
        break;
    }
    return alpha2;
  }

  public getCountry(code: string, type: CountryCodeType = CountryCodeType.Alpha2): ICountry | undefined {
    let alpha2 = this.getCountryCodeByType(code, type);
    return alpha2 ? this.countries.get(alpha2) : undefined;
  }

  public searchCountry(query: string): ICountry[] {
    const queryRegex = new RegExp(query, 'ig');
    return Array.from(this.countries.values()).filter((country) => country.name.match(queryRegex));
  }

  private loadState(countryCode: string): void {
    if (!this.countryStates.has(countryCode)) {
      const states: IStateJson[] = require(`../JSON_DATA/${countryCode}.json`);
      const statesMap = new Map<string, IState>();
      states.forEach((state) => {
        statesMap.set(state.abbreviation, {
          name: state.subdivision_name,
          isoCode: state.iso_3166_2_code,
          subdivisionCategory: state.subdivision_category,
          abbreviation: state.abbreviation,
        });
      });
      this.countryStates.set(countryCode, statesMap);
    }
  }

  public getStatesByCountryCode(countryCode: string, type: CountryCodeType = CountryCodeType.Alpha2): IState[] {
    const code = this.getCountryCodeByType(countryCode, type) ?? '';
    if (!code) return [];
    this.loadState(code);
    return Array.from(this.countryStates.get(this.getCountryCodeByType(countryCode, type) ?? '')?.values() ?? []);
  }

  public getStateByAbbreviation(
    abbreviation: string,
    countryCode: string,
    type: CountryCodeType = CountryCodeType.Alpha2,
  ): IState | undefined {
    const code = this.getCountryCodeByType(countryCode, type) ?? '';
    if (!code) return undefined;
    this.loadState(code);
    return this.countryStates.get(this.getCountryCodeByType(countryCode, type) ?? '')?.get(abbreviation.toUpperCase());
  }

  public getStateByIsoCode(isoCode: string): IState | undefined {
    const splitCode = isoCode.split('-');
    const countryCode = this.getCountryCodeByType(splitCode[0], CountryCodeType.Alpha2) ?? '';
    if (!countryCode) return undefined;
    this.loadState(countryCode);
    return this.countryStates
      .get(this.getCountryCodeByType(countryCode, CountryCodeType.Alpha2) ?? '')
      ?.get(splitCode[1].toUpperCase());
  }

  public searchStateWithinCountry(
    query: string,
    countryCode: string,
    type: CountryCodeType = CountryCodeType.Alpha2,
  ): IState[] {
    const code = this.getCountryCodeByType(countryCode, type) ?? '';
    if (!code) return [];
    this.loadState(code);
    const queryRegex = new RegExp(query, 'ig');
    return Array.from(
      this.countryStates.get(this.getCountryCodeByType(countryCode, type) ?? '')?.values() ?? [],
    ).filter((state) => state.name.match(queryRegex));
  }
}
export default IsoData.getInstance();
