// Normalization runtime (CVS-143): turns raw source objects into validated canonical
// records (CVS-139) via source-specific mappers, dedupes them, and reports payload-free
// counts + rejections. Plugs into the fetch runtime (CVS-142) via `normalizeAsHandler`.
// See docs/data/connector-normalization.md.
export * from './types';
export { assembleRecord, normalizeBatch, normalizeAsHandler, type NormalizeOptions } from './normalize';
export { NORMALIZER_REGISTRY, getMapper, hasMapper } from './registry';
