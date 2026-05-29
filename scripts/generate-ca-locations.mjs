import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const outputPath = path.join(projectRoot, "data", "ca-locations.generated.json");

const PROVINCES = [
  { geonamesAdmin1: "01", name: "Alberta", abbr: "AB", context: "a mix of dense urban sites, rural acreages, and industrial yards that need dependable pumping support" },
  { geonamesAdmin1: "02", name: "British Columbia", abbr: "BC", context: "busy coastal service areas, restaurant-heavy corridors, and remote communities where route planning matters" },
  { geonamesAdmin1: "03", name: "Manitoba", abbr: "MB", context: "commercial corridors, rural properties, and municipal infrastructure that benefit from predictable maintenance" },
  { geonamesAdmin1: "04", name: "New Brunswick", abbr: "NB", context: "port cities, mixed-use commercial sites, and smaller surrounding communities that need reliable cleanup capacity" },
  { geonamesAdmin1: "05", name: "Newfoundland and Labrador", abbr: "NL", context: "coastal properties, rural homes, and industrial locations where weather and access can change quickly" },
  { geonamesAdmin1: "07", name: "Nova Scotia", abbr: "NS", context: "coastal communities, tourism properties, and mixed commercial sites that rely on quick response windows" },
  { geonamesAdmin1: "08", name: "Ontario", abbr: "ON", context: "dense restaurant markets, large commercial properties, and municipal drainage systems with heavy year-round demand" },
  { geonamesAdmin1: "09", name: "Prince Edward Island", abbr: "PE", context: "rural homes, cottages, hospitality sites, and seasonal properties that need proactive maintenance" },
  { geonamesAdmin1: "10", name: "Quebec", abbr: "QC", context: "high-density urban properties, industrial sites, and municipal infrastructure with strong maintenance needs" },
  { geonamesAdmin1: "11", name: "Saskatchewan", abbr: "SK", context: "rural holdings, service stations, and commercial properties spread across wide coverage areas" },
  { geonamesAdmin1: "12", name: "Yukon", abbr: "YT", context: "remote communities and industrial sites where timing, route efficiency, and equipment readiness matter" },
  { geonamesAdmin1: "13", name: "Northwest Territories", abbr: "NT", context: "remote work sites and municipal systems that need clear planning and durable service logistics" },
  { geonamesAdmin1: "14", name: "Nunavut", abbr: "NU", context: "remote communities where dependable equipment scheduling and straightforward communication are essential" },
];

const FEATURE_CODE_PRIORITY = {
  PPLC: 0,
  PPLA: 1,
  PPLA2: 2,
  PPLA3: 3,
  PPLA4: 4,
  PPL: 5,
  PPLL: 6,
  PPLQ: 7,
  PPLX: 8,
  PPLH: 9,
  PPLF: 10,
  PPLG: 11,
  PPLS: 12,
  PPLW: 13,
};

function slugify(value) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function compareLocations(a, b) {
  return (
    (FEATURE_CODE_PRIORITY[a.featureCode] ?? 99) - (FEATURE_CODE_PRIORITY[b.featureCode] ?? 99) ||
    b.population - a.population ||
    a.name.localeCompare(b.name) ||
    a.geonameId.localeCompare(b.geonameId)
  );
}

function download(url, outputFile) {
  execFileSync("curl", ["-L", "--fail", "--silent", url, "-o", outputFile], { stdio: "inherit" });
}

mkdirSync(path.dirname(outputPath), { recursive: true });

const tmpZip = path.join(projectRoot, ".tmp-ca-geonames.zip");
try {
  download("https://download.geonames.org/export/dump/CA.zip", tmpZip);

  const raw = execFileSync("unzip", ["-p", tmpZip, "CA.txt"], {
    encoding: "utf8",
    maxBuffer: 1024 * 1024 * 256,
  });

  const provinceByAdminCode = new Map(PROVINCES.map((province) => [province.geonamesAdmin1, province]));
  const locationsByProvince = new Map(PROVINCES.map((province) => [province.abbr, []]));

  for (const line of raw.trim().split("\n")) {
    const columns = line.split("\t");
    const featureClass = columns[6];
    const featureCode = columns[7];
    const admin1Code = columns[10];
    const province = provinceByAdminCode.get(admin1Code);

    if (featureClass !== "P" || !province) {
      continue;
    }

    const name = columns[1];
    const asciiName = columns[2];
    const population = Number(columns[14] || 0);
    const geonameId = columns[0];
    const baseSlug = slugify(asciiName || name);

    if (!baseSlug) {
      continue;
    }

    locationsByProvince.get(province.abbr).push({
      geonameId,
      name,
      asciiName,
      featureCode,
      population,
      baseSlug,
    });
  }

  const provinces = PROVINCES.map((province) => {
    const deduped = new Map();
    const sorted = locationsByProvince.get(province.abbr).sort(compareLocations);

    for (const location of sorted) {
      const existing = deduped.get(location.baseSlug) ?? [];
      existing.push(location);
      deduped.set(location.baseSlug, existing);
    }

    const cities = [...deduped.entries()]
      .flatMap(([baseSlug, group]) =>
        group.map((location, index) => ({
          name: location.name,
          slug: index === 0 ? baseSlug : `${baseSlug}-${index + 1}`,
          population: location.population,
          featureCode: location.featureCode,
          geonameId: location.geonameId,
        })),
      )
      .sort((a, b) => b.population - a.population || a.name.localeCompare(b.name) || a.slug.localeCompare(b.slug));

    return {
      name: province.name,
      slug: province.abbr,
      abbr: province.abbr,
      context: province.context,
      cities,
    };
  });

  writeFileSync(
    outputPath,
    `${JSON.stringify(
      {
        source: "GeoNames Canada dump (https://download.geonames.org/export/dump/CA.zip)",
        generatedAt: new Date().toISOString(),
        provinceCount: provinces.length,
        cityCount: provinces.reduce((sum, province) => sum + province.cities.length, 0),
        provinces,
      },
      null,
      2,
    )}\n`,
  );

  const cityCount = provinces.reduce((sum, province) => sum + province.cities.length, 0);
  console.log(`Wrote ${cityCount} populated places across ${provinces.length} provinces/territories to ${outputPath}`);
} finally {
  try {
    execFileSync("rm", ["-f", tmpZip]);
  } catch {
    // Ignore cleanup failures.
  }
}
