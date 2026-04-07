/** @format */

export const farmerCommodities = [
  "Cashew",
  "Cassava",
  "Cocoa",
  "Groundnut",
  "Gum Arabic",
  "Maize",
  "Palm Oil",
  "Rubber",
  "Sesame Seed",
  "Sorghum",
];

export const minerCommodities = [
  "Bauxite",
  "Coal",
  "Columbite",
  "Diamond",
  "Gold",
  "Tantalite",
];

export const processedCommodities = [
  "Corn Starch",
  "Corn Flour",
  "Cocoa Powder",
  "Cassava Flour",
  "Cassava Chips",
  "Cassava Starch",
  "Garri",
  "Sesame Oil",
];

export const commodityTypes = [
  { label: "Agric Produce", value: "agricProduce" },
  { label: "Solid Minerals", value: "solidMinerals" },
  { label: "Processed Commodities", value: "processedCommodities" },
];

export const commodityByType = {
  agricProduce: farmerCommodities,
  solidMinerals: minerCommodities,
  processedCommodities: processedCommodities,
};
