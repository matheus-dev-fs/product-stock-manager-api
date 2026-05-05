import { db as database } from "../../db/connection.js";

export type DbClient = typeof database;
export type DbTransaction = Parameters<Parameters<DbClient["transaction"]>[0]>[0];