import "server-only";
import type { DataSource } from "@/lib/data/types";
import { apiSource } from "./api";
import { sampleSource } from "./sample";

/**
 * Picks where data comes from. "sample" (the default) returns the sample
 * records; "api" will call the real backend once each area is connected.
 * Set with CEVRYNT_DATA_SOURCE. Server only: the browser never imports this.
 */
export type DataSourceName = "sample" | "api";

export const dataSourceName: DataSourceName = process.env.CEVRYNT_DATA_SOURCE === "api" ? "api" : "sample";

export const source: DataSource = dataSourceName === "api" ? apiSource : sampleSource;
