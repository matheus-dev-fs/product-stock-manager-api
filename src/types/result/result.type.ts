import { InvalidResult } from "./invalid-result.type";
import { ValidResult } from "./valid-result.type";

export type Result<T, U> = ValidResult<T> | InvalidResult<U>;