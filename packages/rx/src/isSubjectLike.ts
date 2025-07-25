import { isFn, isObj } from "@utiils/core";
import { SubjectLike } from "./types";

/**
 * Check if x is RxJS subject-like
 */
export const isSubjectLike = <T = unknown>(x: unknown): x is SubjectLike<T> => isObj(x) 
    && isFn((x as SubjectLike).next)
    && isFn((x as SubjectLike).subscribe)
    && ('value' in (x as SubjectLike))