import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import locationDataset from "../data/ca-locations.generated.json" with { type: "json" };

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const outputPath = path.join(projectRoot, "data", "live-links.csv");

const SITE_URL = "https://cleanliquidwaste.com";

const SERVICE_ORDER = [
  "grease-trap-cleaning",
  "car-wash-pit-cleaning",
  "septic-tank-pumping",
  "vacuum-truck-service",
  "hydrovac-service",
  "industrial-tank-cleaning",
  "catch-basin-cleaning",
  "storm-drain-cleaning",
];

const SERVICE_NAME_BY_SLUG = {
  "grease-trap-cleaning": "Grease Trap Cleaning",
  "car-wash-pit-cleaning": "Car Wash & Wash Bay Cleaning",
  "septic-tank-pumping": "Septic & Holding Tank Pumping",
  "vacuum-truck-service": "Vacuum Truck Service",
  "hydrovac-service": "Hydrovac Service",
  "industrial-tank-cleaning": "Industrial Tank Cleaning",
  "catch-basin-cleaning": "Catch Basin Cleaning",
  "storm-drain-cleaning": "Storm Drain Cleaning",
};

const INDUSTRIES_BY_SERVICE = {
  "grease-trap-cleaning": [
    { slug: "restaurant", name: "Restaurant" },
    { slug: "hotel", name: "Hotel" },
  ],
  "car-wash-pit-cleaning": [
    { slug: "fleet-yard", name: "Fleet Yard" },
  ],
  "septic-tank-pumping": [
    { slug: "cottage", name: "Cottage" },
    { slug: "acreage", name: "Acreage" },
  ],
  "vacuum-truck-service": [
    { slug: "industrial", name: "Industrial" },
    { slug: "municipal", name: "Municipal" },
  ],
  "hydrovac-service": [
    { slug: "excavation", name: "Excavation" },
  ],
  "industrial-tank-cleaning": [
    { slug: "manufacturing", name: "Manufacturing" },
    { slug: "lift-station", name: "Lift Station" },
  ],
  "catch-basin-cleaning": [
    { slug: "commercial", name: "Commercial" },
  ],
  "storm-drain-cleaning": [
    { slug: "municipal", name: "Municipal" },
  ],
};

const PROVINCE_LAUNCH_PRIORITY = ["AB", "BC", "ON", "SK", "MB", "QC", "NS", "NB", "NL", "PE", "NT", "NU", "YT"];
const REQUIRED_ADDITIONAL_PROVINCES = ["ON", "MB"];
const CLUSTER_PAGE_ESTIMATE = 33660;
const LAUNCH_PAGE_PERCENTAGE = 0.1;
const LAUNCH_PAGE_TARGET = Math.ceil(CLUSTER_PAGE_ESTIMATE * LAUNCH_PAGE_PERCENTAGE);
const NON_CITY_PAGE_COUNT =
  2 + SERVICE_ORDER.length + SERVICE_ORDER.length + 12 + (locationDataset.provinceCount * SERVICE_ORDER.length);
const MAX_LAUNCH_LOCATION_COUNT = Math.max(
  0,
  Math.floor((LAUNCH_PAGE_TARGET - NON_CITY_PAGE_COUNT) / SERVICE_ORDER.length),
);

function csv(value) {
  const stringValue = String(value ?? "");
  if (/[",\n]/.test(stringValue)) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }

  return stringValue;
}

function selectLaunchCities() {
  const selected = [];
  for (const provinceAbbr of PROVINCE_LAUNCH_PRIORITY) {
    const province = locationDataset.provinces.find((item) => item.abbr === provinceAbbr);
    if (!province) {
      continue;
    }

    for (const city of province.cities) {
      if (selected.length >= MAX_LAUNCH_LOCATION_COUNT) {
        break;
      }

      selected.push({
        stateName: province.name,
        stateAbbr: province.abbr,
        stateSlug: province.slug,
        cityName: city.name,
        citySlug: city.slug,
      });
    }

    if (selected.length >= MAX_LAUNCH_LOCATION_COUNT) {
      break;
    }
  }

  for (const provinceAbbr of REQUIRED_ADDITIONAL_PROVINCES) {
    const province = locationDataset.provinces.find((item) => item.abbr === provinceAbbr);
    const city = province?.cities.find(
      (candidate) =>
        !selected.some((selectedCity) => selectedCity.stateAbbr === provinceAbbr && selectedCity.citySlug === candidate.slug),
    );
    if (!province || !city) {
      continue;
    }

    selected.push({
      stateName: province.name,
      stateAbbr: province.abbr,
      stateSlug: province.slug,
      cityName: city.name,
      citySlug: city.slug,
    });
  }

  return selected;
}

const rows = [];

rows.push({
  url: `${SITE_URL}/`,
  path: "/",
  page_type: "homepage",
  province_abbr: "",
  province_name: "",
  city_name: "",
  city_slug: "",
  service_slug: "",
  service_name: "",
  industry_slug: "",
  industry_name: "",
});

rows.push({
  url: `${SITE_URL}/services`,
  path: "/services",
  page_type: "services-index",
  province_abbr: "",
  province_name: "",
  city_name: "",
  city_slug: "",
  service_slug: "",
  service_name: "",
  industry_slug: "",
  industry_name: "",
});

for (const serviceSlug of SERVICE_ORDER) {
  rows.push({
    url: `${SITE_URL}/services/${serviceSlug}`,
    path: `/services/${serviceSlug}`,
    page_type: "service-hub",
    province_abbr: "",
    province_name: "",
    city_name: "",
    city_slug: "",
    service_slug: serviceSlug,
    service_name: SERVICE_NAME_BY_SLUG[serviceSlug],
    industry_slug: "",
    industry_name: "",
  });

  rows.push({
    url: `${SITE_URL}/services/${serviceSlug}/near-me`,
    path: `/services/${serviceSlug}/near-me`,
    page_type: "near-me",
    province_abbr: "",
    province_name: "",
    city_name: "",
    city_slug: "",
    service_slug: serviceSlug,
    service_name: SERVICE_NAME_BY_SLUG[serviceSlug],
    industry_slug: "",
    industry_name: "",
  });

  for (const industry of INDUSTRIES_BY_SERVICE[serviceSlug] ?? []) {
    rows.push({
      url: `${SITE_URL}/services/${serviceSlug}/${industry.slug}`,
      path: `/services/${serviceSlug}/${industry.slug}`,
      page_type: "industry",
      province_abbr: "",
      province_name: "",
      city_name: "",
      city_slug: "",
      service_slug: serviceSlug,
      service_name: SERVICE_NAME_BY_SLUG[serviceSlug],
      industry_slug: industry.slug,
      industry_name: industry.name,
    });
  }
}

for (const province of locationDataset.provinces) {
  for (const serviceSlug of SERVICE_ORDER) {
    rows.push({
      url: `${SITE_URL}/${province.abbr}/services/${serviceSlug}`,
      path: `/${province.abbr}/services/${serviceSlug}`,
      page_type: "province-service",
      province_abbr: province.abbr,
      province_name: province.name,
      city_name: "",
      city_slug: "",
      service_slug: serviceSlug,
      service_name: SERVICE_NAME_BY_SLUG[serviceSlug],
      industry_slug: "",
      industry_name: "",
    });
  }
}

for (const city of selectLaunchCities()) {
  for (const serviceSlug of SERVICE_ORDER) {
    rows.push({
      url: `${SITE_URL}/${city.stateAbbr}/${city.citySlug}/${serviceSlug}`,
      path: `/${city.stateAbbr}/${city.citySlug}/${serviceSlug}`,
      page_type: "city-service",
      province_abbr: city.stateAbbr,
      province_name: city.stateName,
      city_name: city.cityName,
      city_slug: city.citySlug,
      service_slug: serviceSlug,
      service_name: SERVICE_NAME_BY_SLUG[serviceSlug],
      industry_slug: "",
      industry_name: "",
    });
  }
}

mkdirSync(path.dirname(outputPath), { recursive: true });

const header = [
  "url",
  "path",
  "page_type",
  "province_abbr",
  "province_name",
  "city_name",
  "city_slug",
  "service_slug",
  "service_name",
  "industry_slug",
  "industry_name",
];

const body = rows.map((row) => header.map((column) => csv(row[column])).join(","));
writeFileSync(outputPath, `${header.join(",")}\n${body.join("\n")}\n`);

console.log(`Wrote ${rows.length} live links to ${outputPath}`);
