import { AssertionError } from "assert";

function ok(condition: any, error?: string | Error): asserts condition {
  if (!condition) {
    const _error =
      typeof error === "string"
        ? new AssertionError({ message: error })
        : error;
    throw _error;
  }
}

export default ok;
