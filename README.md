# Wet Bulb Globe Temperature

![Bun](https://img.shields.io/badge/Bun-%23000000.svg?style=for-the-badge&logo=bun&logoColor=white) ![HTMX](https://img.shields.io/badge/HTMX-000000.svg?style=for-the-badge&logo=htmx&logoColor=white&color=%233366CC)

This project calculates the [web bulb globe temperature](https://en.wikipedia.org/wiki/Wet-bulb_globe_temperature) for the user's location.

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run src/index.ts
```

Test the utility functions via:

```bash
bun test --coverage
```

## References

* Hajizadeh, R., Farhang Dehghan, S., Golbabaei, F., Jafari, S.M. and Karajizadeh, M. (2017), Offering a model for estimating black globe temperature according to meteorological measurements. Met. Apps, 24: 303-307. https://doi.org/10.1002/met.1631
* [Vaisala, Wet Bulb Temperature Calculation](https://docs.vaisala.com/r/M212417EN-G/en-US/GUID-4A85CA9F-5E9F-4B22-BD03-454653BE904D)
* Dimiceli, Vincent; Piltz, Steven. [Estimation of Black Globe Temperature for Calculation of the WBGT Index](https://www.weather.gov/media/tsa/pdf/WBGTpaper2.pdf), *National Weather Service WFO Tulsa, OK.*